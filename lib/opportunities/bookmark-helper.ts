/**
 * lib/opportunities/bookmark-helper.ts
 *
 * Data-access helpers for the saved_opportunities table.
 * Stores only: opportunity_id, lightweight snapshot, and AI notes.
 * Does NOT duplicate the full opportunity record.
 *
 * Server-side only.
 */

import { createClient } from "@/lib/supabase/server";
import type { GeminiRankResult, RankingMeta, OpportunityCategory } from "./types";
import type { Opportunity } from "./types";

/* ── Types ───────────────────────────────────────────────────── */

export interface BookmarkRow {
  id: string;
  user_id: string;
  opportunity_id: string;
  title: string | null;
  organization: string | null;
  category: string | null;
  deadline: string | null;
  url: string | null;
  ai_notes: BookmarkAiNotes | null;
  saved_at: string;
}

export interface BookmarkAiNotes {
  matchScore?: number;
  whyMatched?: string;
  missingSkills?: string[];
  priority?: string;
  nextAction?: string;
  modelUsed?: string;
  rankingVersion?: string;
  rankedAt?: string;
}

/* ── Read ────────────────────────────────────────────────────── */

/**
 * Returns a Map<opportunity_id, BookmarkRow> for the current user.
 * O(1) lookup: isBookmarked(map.has(id)).
 */
export async function getBookmarks(): Promise<Map<string, BookmarkRow>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Map();

  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("*")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  if (error) {
    console.error("[bookmark-helper] getBookmarks:", error.message);
    return new Map();
  }

  const map = new Map<string, BookmarkRow>();
  for (const row of (data ?? []) as BookmarkRow[]) {
    if (row.opportunity_id) {
      map.set(row.opportunity_id, row);
    }
  }
  return map;
}

/**
 * Returns all saved bookmark rows for display in the Bookmarks tab.
 */
export async function getSavedOpportunities(): Promise<BookmarkRow[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("*")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  if (error) {
    console.error("[bookmark-helper] getSavedOpportunities:", error.message);
    return [];
  }
  return (data ?? []) as BookmarkRow[];
}

/* ── Write ───────────────────────────────────────────────────── */

/**
 * Saves a bookmark. Stores only opportunity_id + lightweight snapshot + AI notes.
 * The full opportunity data is never duplicated into the DB.
 */
export async function addBookmark(
  opportunity: Opportunity,
  rank: GeminiRankResult | null,
  rankingMeta: RankingMeta | null
): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const aiNotes: BookmarkAiNotes | null = rank
    ? {
        matchScore: rank.matchScore,
        whyMatched: rank.whyMatched,
        missingSkills: rank.missingSkills,
        priority: rank.priority,
        nextAction: rank.nextAction,
        modelUsed: rankingMeta?.modelUsed,
        rankingVersion: rankingMeta?.rankingVersion,
        rankedAt: rankingMeta?.rankedAt,
      }
    : null;

  const { data, error } = await supabase
    .from("saved_opportunities")
    .insert({
      user_id: user.id,
      opportunity_id: opportunity.id,
      // Lightweight snapshot - so bookmarks display even if dataset changes
      title: opportunity.title,
      organization: opportunity.organization,
      category: opportunity.category as OpportunityCategory,
      deadline: opportunity.deadline,
      url: opportunity.applyUrl,
      ai_notes: aiNotes as unknown as Record<string, unknown>,
      saved_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[bookmark-helper] addBookmark:", error.message);
    return null;
  }
  return data;
}

/**
 * Removes a bookmark by opportunity_id for the current user.
 */
export async function removeBookmark(opportunityId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("saved_opportunities")
    .delete()
    .eq("user_id", user.id)
    .eq("opportunity_id", opportunityId);

  if (error) {
    console.error("[bookmark-helper] removeBookmark:", error.message);
    return false;
  }
  return true;
}

/**
 * Returns the count of saved opportunities for the current user.
 */
export async function getBookmarkCount(): Promise<number> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("saved_opportunities")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) return 0;
  return count ?? 0;
}
