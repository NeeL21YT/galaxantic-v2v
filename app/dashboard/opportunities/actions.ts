"use server";

/**
 * app/dashboard/opportunities/actions.ts
 *
 * Server Actions for the Opportunity Navigator.
 * All actions are authenticated - unauthenticated calls return errors.
 *
 * Architecture:
 *   getOpportunities() - load → filter → score locally → Gemini rank → return
 *   bookmarkOpportunity() - save to DB (opportunity_id + AI notes only)
 *   removeBookmark() - delete from DB
 *   getSavedOpportunities() - fetch bookmarked rows for current user
 */

import { getUser } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profiles";
import { getLatestAnalyzedResume } from "@/lib/db/resumes";
import { createOpportunityRepository } from "@/lib/opportunities/repository";
import { prepareGeminiCandidates, applyDeterministicFilter } from "@/lib/opportunities/filter-engine";
import {
  rankOpportunities,
  buildFilterKey,
  getCachedRankForOpportunity,
} from "@/lib/opportunities/gemini-ranking";
import {
  getBookmarks,
  addBookmark,
  removeBookmark as dbRemoveBookmark,
  getSavedOpportunities as dbGetSaved,
} from "@/lib/opportunities/bookmark-helper";
import type {
  OpportunityFilters,
  RankedOpportunity,
  GetOpportunitiesResult,
  BookmarkData,
  Opportunity,
} from "@/lib/opportunities/types";
import type {
  GeminiRankResult,
} from "@/lib/opportunities/types";
import type { ResumeAnalysis } from "@/types/resume-analysis";

/* ── Auth guard ──────────────────────────────────────────────── */

async function requireAuth() {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

/* ── Resume analysis extractor ───────────────────────────────── */

function extractAnalysis(resume: Awaited<ReturnType<typeof getLatestAnalyzedResume>>): ResumeAnalysis | null {
  if (!resume?.analysis_json) return null;
  try {
    return resume.analysis_json as unknown as ResumeAnalysis;
  } catch {
    return null;
  }
}

/* ── getOpportunities ────────────────────────────────────────── */

export async function getOpportunities(
  filters: OpportunityFilters
): Promise<
  | GetOpportunitiesResult
  | { success: false; error: string; code: string }
> {
  try {
    const user = await requireAuth();
    const [profile, latestResume] = await Promise.all([
      getProfile(),
      getLatestAnalyzedResume(),
    ]);

    if (!profile) {
      return { success: false, error: "Profile not found.", code: "NO_PROFILE" };
    }

    const analysis = extractAnalysis(latestResume);
    if (!profile.onboarding_completed || !analysis) {
      return {
        topMatches: [],
        allFiltered: [],
        searchIndex: [],
        meta: {
          total: 0,
          filtered: 0,
          sentToAI: 0,
          ranked: 0,
          fromCache: false,
        },
      };
    }

    const repo = createOpportunityRepository();
    const [allOpps, searchIndex, bookmarkMap] = await Promise.all([
      repo.findAll(),
      repo.getSearchIndex(),
      getBookmarks(),
    ]);

    // Phase 1 + 2: deterministic filter + local score → top 25 for Gemini
    const filterCtx = { profile, resumeAnalysis: analysis, filters };
    const candidates = prepareGeminiCandidates(allOpps, filterCtx);
    const allFiltered = applyDeterministicFilter(allOpps, filterCtx);

    // Build cache key from user + filters + profile
    const cacheKey = buildFilterKey(user.id, filters, profile);

    let topMatches: RankedOpportunity[] = [];
    let rankResult: Awaited<ReturnType<typeof rankOpportunities>> | null = null;

    if (candidates.length > 0) {
      try {
        rankResult = await rankOpportunities(candidates, profile, analysis, cacheKey);

        // Merge AI results with static opportunity data
        const candidateMap = new Map(candidates.map((c) => [c.opportunity.id, c]));

        topMatches = rankResult.results
          .map((rank) => {
            const scored = candidateMap.get(rank.id);
            if (!scored) return null;
            return {
              opportunity: scored.opportunity,
              rank,
              localScore: scored.localScore,
              isBookmarked: bookmarkMap.has(rank.id),
            } satisfies RankedOpportunity;
          })
          .filter((r): r is RankedOpportunity => r !== null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg === "HERIZON_AI_BUSY") {
          // Return deterministic results without AI ranking when Gemini is busy
          topMatches = candidates.slice(0, 10).map((c) => ({
            opportunity: c.opportunity,
            rank: {
              id: c.opportunity.id,
              matchScore: Math.min(99, c.localScore),
              whyMatched: "AI ranking is temporarily unavailable. Showing best local matches.",
              missingSkills: [],
              recommendedLearning: [],
              priority: "medium" as const,
              nextAction: "Review this opportunity and apply if it matches your goals.",
            },
            localScore: c.localScore,
            isBookmarked: bookmarkMap.has(c.opportunity.id),
          }));
        } else {
          throw err;
        }
      }
    }

    return {
      topMatches,
      allFiltered: allFiltered.map((opp) => opp),
      searchIndex,
      meta: {
        total: allOpps.length,
        filtered: allFiltered.length,
        sentToAI: candidates.length,
        ranked: topMatches.length,
        fromCache: rankResult?.fromCache ?? false,
        rankingMeta: rankResult?.meta,
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[opportunities/actions] getOpportunities:", msg);
    return {
      success: false,
      error: msg === "UNAUTHENTICATED"
        ? "Please sign in to view opportunities."
        : "Failed to load opportunities. Please try again.",
      code: msg === "UNAUTHENTICATED" ? "UNAUTHENTICATED" : "LOAD_FAILED",
    };
  }
}

/* ── bookmarkOpportunity ─────────────────────────────────────── */

export async function bookmarkOpportunity(
  opportunity: Opportunity,
  bookmarkData: BookmarkData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();
    const result = await addBookmark(
      opportunity,
      bookmarkData.rank,
      bookmarkData.rankingMeta
    );
    if (!result) return { success: false, error: "Failed to save bookmark." };
    return { success: true };
  } catch (err) {
    console.error("[opportunities/actions] bookmarkOpportunity:", err);
    return { success: false, error: "Failed to bookmark opportunity." };
  }
}

/* ── removeBookmark ──────────────────────────────────────────── */

export async function removeBookmark(
  opportunityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();
    const ok = await dbRemoveBookmark(opportunityId);
    if (!ok) return { success: false, error: "Failed to remove bookmark." };
    return { success: true };
  } catch (err) {
    console.error("[opportunities/actions] removeBookmark:", err);
    return { success: false, error: "Failed to remove bookmark." };
  }
}

/* ── getSavedOpportunities ───────────────────────────────────── */

export async function getSavedOpportunities() {
  try {
    await requireAuth();
    return await dbGetSaved();
  } catch {
    return [];
  }
}

/* ── getMatchedCount (for dashboard stat card) ───────────────── */

export async function getMatchedCount(): Promise<number> {
  try {
    const user = await getUser();
    if (!user) return 0;
    const [repo, profile] = await Promise.all([
      Promise.resolve(createOpportunityRepository()),
      getProfile(),
    ]);
    const latestResume = await getLatestAnalyzedResume();
    if (!profile?.onboarding_completed || !latestResume?.analysis_json) return 0;
    const allOpps = await repo.findAll();
    const { DEFAULT_FILTERS } = await import("@/lib/opportunities/types");
    const filtered = applyDeterministicFilter(allOpps, {
      profile,
      resumeAnalysis: null,
      filters: DEFAULT_FILTERS,
    });
    return Math.min(filtered.length, 999);
  } catch {
    return 0;
  }
}

/* ── getOpportunityWithRank (for detail page) ────────────────── */

export async function getOpportunityWithRank(
  opportunityId: string
): Promise<{
  opportunity: Opportunity | null;
  rank: GeminiRankResult | null;
  isBookmarked: boolean;
}> {
  try {
    const user = await requireAuth();
    const [profile, repo, bookmarkMap] = await Promise.all([
      getProfile(),
      Promise.resolve(createOpportunityRepository()),
      getBookmarks(),
    ]);

    const opportunity = await repo.findById(opportunityId);
    if (!opportunity) return { opportunity: null, rank: null, isBookmarked: false };

    // Try to get AI rank from module-level cache
    let rank: GeminiRankResult | null = null;
    if (profile) {
      const { DEFAULT_FILTERS } = await import("@/lib/opportunities/types");
      const cacheKey = buildFilterKey(user.id, DEFAULT_FILTERS, profile);
      rank = getCachedRankForOpportunity(cacheKey, opportunityId);

      // Also check bookmark for stored AI notes
      if (!rank) {
        const bookmark = bookmarkMap.get(opportunityId);
        if (bookmark?.ai_notes) {
          const notes = bookmark.ai_notes;
          rank = {
            id: opportunityId,
            matchScore: (notes as Record<string, unknown>).matchScore as number ?? 0,
            whyMatched: (notes as Record<string, unknown>).whyMatched as string ?? "",
            missingSkills: ((notes as Record<string, unknown>).missingSkills as string[]) ?? [],
            recommendedLearning: [],
            priority: ((notes as Record<string, unknown>).priority as "high" | "medium" | "low") ?? "medium",
            nextAction: (notes as Record<string, unknown>).nextAction as string ?? "",
          };
        }
      }
    }

    return {
      opportunity,
      rank,
      isBookmarked: bookmarkMap.has(opportunityId),
    };
  } catch {
    return { opportunity: null, rank: null, isBookmarked: false };
  }
}
