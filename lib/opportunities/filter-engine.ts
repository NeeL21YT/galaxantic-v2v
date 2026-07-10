/**
 * lib/opportunities/filter-engine.ts
 *
 * Two-phase pipeline before Gemini ranking:
 *
 * Phase 1 - Deterministic filtering
 *   Hard eliminates candidates that don't match the user's filters.
 *
 * Phase 2 - Local relevance scoring
 *   Scores each remaining candidate using skill overlap, education,
 *   career stage, deadline proximity, and platform-specific boosts.
 *   Returns the top 20–30 best candidates to send to Gemini.
 *
 * Gemini then focuses on reasoning and prioritisation, not basic filtering.
 *
 * Server-side only.
 */

import type { Profile, EducationLevel } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-analysis";
import type { Opportunity, OpportunityFilters } from "./types";

/* ── Configuration ───────────────────────────────────────────── */

/** Maximum candidates to send to Gemini - balances quality vs token cost */
const MAX_GEMINI_CANDIDATES = 25;

/** Education levels in ascending order (for adjacent-level scoring) */
const EDUCATION_ORDER: EducationLevel[] = [
  "high_school",
  "diploma",
  "undergraduate",
  "postgraduate",
  "phd",
];

/* ── Phase 1: Deterministic Filter ───────────────────────────── */

export interface FilterContext {
  profile: Profile;
  resumeAnalysis: ResumeAnalysis | null;
  filters: OpportunityFilters;
}

/**
 * Hard-eliminates opportunities that do not satisfy the user's explicit filters.
 * Returns only candidates that pass ALL filter conditions.
 */
export function applyDeterministicFilter(
  opportunities: Opportunity[],
  ctx: FilterContext
): Opportunity[] {
  const now = new Date();

  return opportunities.filter((opp) => {
    // ── Category ─────────────────────────────────────────────
    if (ctx.filters.categories.length > 0) {
      if (!ctx.filters.categories.includes(opp.category)) return false;
    }

    // ── Work mode ────────────────────────────────────────────
    if (ctx.filters.workMode === "remote" && !opp.remote) return false;
    if (ctx.filters.workMode === "hybrid" && !opp.hybrid) return false;
    if (ctx.filters.workMode === "onsite" && (opp.remote || opp.hybrid)) return false;

    // ── Country (skip if remote) ─────────────────────────────
    if (ctx.filters.country && !opp.remote) {
      if (opp.country.toLowerCase() !== ctx.filters.country.toLowerCase()) return false;
    }

    // ── Education level ──────────────────────────────────────
    if (ctx.filters.educationLevel && ctx.filters.educationLevel !== "any") {
      if (opp.educationLevel !== "any" && opp.educationLevel !== ctx.filters.educationLevel) {
        return false;
      }
    }

    // ── Women-focused ────────────────────────────────────────
    if (ctx.filters.womenFocused && !opp.womenFocused) return false;

    // ── Career-break friendly ────────────────────────────────
    if (ctx.filters.careerBreakFriendly && !opp.careerBreakFriendly) return false;

    // ── Deadline (hide expired) ──────────────────────────────
    if (ctx.filters.hideExpired) {
      const deadline = new Date(opp.deadline);
      if (isNaN(deadline.getTime()) || deadline < now) return false;
    }

    return true;
  });
}

/* ── Phase 2: Local Relevance Scoring ────────────────────────── */

export interface ScoredOpportunity {
  opportunity: Opportunity;
  localScore: number;
}

/**
 * Scores a single opportunity against the user's profile and resume analysis.
 * Returns a numeric score - used only for ordering before Gemini ranking.
 *
 * Scoring breakdown (total possible ≈ 100+):
 *   Skill overlap    0–40 pts
 *   Education match  0–15 pts
 *   Career stage     0–15 pts
 *   Deadline         0–10 pts (urgency boost)
 *   Featured         0–8 pts
 *   Women-focused    0–5 pts
 *   Career break     0–7 pts
 *   Interests        0–5 pts
 */
export function scoreOpportunity(
  opp: Opportunity,
  profile: Profile,
  analysis: ResumeAnalysis | null
): number {
  let score = 0;

  // ── Skill overlap (0–40) ──────────────────────────────────
  const userSkills = normalizeSkills([
    ...(profile.skills ?? []),
    ...(analysis?.technicalSkills ?? []),
    ...(analysis?.softSkills ?? []),
  ]);
  const oppSkills = normalizeSkills([...(opp.skills ?? []), ...(opp.preferredSkills ?? [])]);

  if (oppSkills.length > 0 && userSkills.length > 0) {
    const matchCount = userSkills.filter((us) =>
      oppSkills.some((os) => os.includes(us) || us.includes(os))
    ).length;
    score += Math.min(40, (matchCount / oppSkills.length) * 60);
  }

  // ── Education match (0–15) ────────────────────────────────
  if (opp.educationLevel === "any") {
    score += 10;
  } else if (profile.education_level) {
    if (opp.educationLevel === profile.education_level) {
      score += 15;
    } else {
      const userIdx = EDUCATION_ORDER.indexOf(profile.education_level as EducationLevel);
      const oppIdx = EDUCATION_ORDER.indexOf(opp.educationLevel as EducationLevel);
      if (userIdx !== -1 && oppIdx !== -1) {
        const gap = Math.abs(userIdx - oppIdx);
        if (gap === 1) score += 7;
        else if (gap === 2) score += 3;
      }
    }
  }

  // ── Career stage (0–15) ──────────────────────────────────
  if (opp.careerStage === "any") {
    score += 10;
  } else if (opp.careerStage === profile.career_stage) {
    score += 15;
  }

  // ── Deadline proximity (0–10, urgency boost) ─────────────
  const daysLeft = daysUntil(opp.deadline);
  if (daysLeft > 0) {
    if (daysLeft <= 14) score += 10;
    else if (daysLeft <= 30) score += 8;
    else if (daysLeft <= 90) score += 5;
    else if (daysLeft <= 180) score += 2;
    else score += 1;
  }

  // ── Featured boost (0–8) ─────────────────────────────────
  if (opp.featured) score += 8;

  // ── Women-focused (always relevant on Herizon) (0–5) ─────
  if (opp.womenFocused) score += 5;

  // ── Career-break friendly (0–7) ──────────────────────────
  if (opp.careerBreakFriendly) {
    score += profile.career_stage === "career_break" ? 7 : 2;
  }

  // ── Interest match (0–5) ─────────────────────────────────
  if (profile.interests && profile.interests.length > 0) {
    const oppText = `${opp.title} ${opp.description} ${opp.tags.join(" ")}`.toLowerCase();
    const matched = profile.interests.some((interest) =>
      oppText.includes(interest.toLowerCase())
    );
    if (matched) score += 5;
  }

  return Math.round(score);
}

/**
 * Filters candidates deterministically, scores them locally,
 * and returns the top MAX_GEMINI_CANDIDATES sorted by localScore desc.
 * This is the list sent to Gemini.
 */
export function prepareGeminiCandidates(
  opportunities: Opportunity[],
  ctx: FilterContext
): ScoredOpportunity[] {
  const filtered = applyDeterministicFilter(opportunities, ctx);

  const scored: ScoredOpportunity[] = filtered.map((opp) => ({
    opportunity: opp,
    localScore: scoreOpportunity(opp, ctx.profile, ctx.resumeAnalysis),
  }));

  // Sort by localScore descending, then take top N for Gemini
  scored.sort((a, b) => b.localScore - a.localScore);

  return scored.slice(0, MAX_GEMINI_CANDIDATES);
}

/* ── Helpers ─────────────────────────────────────────────────── */

function normalizeSkills(skills: string[]): string[] {
  return skills
    .map((s) => s.toLowerCase().trim())
    .filter(Boolean)
    .filter((s) => s.length > 1);
}

function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return -1;
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/** Exported for use in actions and UI */
export { MAX_GEMINI_CANDIDATES };
