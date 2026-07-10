/**
 * lib/herlens/refresh.ts
 *
 * Scheduler-ready HerLens refresh pipeline:
 * NewsData.io → dedupe → Gemini summaries → Supabase.
 */

import { filterDuplicateArticles } from "./dedupe";
import {
  expectedMaxRefreshArticles,
  getExistingNewsFingerprints,
  insertSummarizedNews,
} from "./database";
import { summarizeHerLensArticles } from "./gemini-summary";
import { fetchLatestHerLensArticles } from "./newsdata";

export interface HerLensRefreshResult {
  success: true;
  fetched: number;
  duplicatesSkipped: number;
  summarized: number;
  inserted: number;
  failed: number;
  maxArticles: number;
}

export interface HerLensRefreshFailure {
  success: false;
  error: string;
  code: string;
  maxArticles: number;
}

export type HerLensRefreshResponse = HerLensRefreshResult | HerLensRefreshFailure;

function friendlyRefreshError(err: unknown): HerLensRefreshFailure {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("[herlens/refresh]", msg);

  return {
    success: false,
    error: "HerLens refresh could not complete. Please try again later.",
    code: "REFRESH_FAILED",
    maxArticles: expectedMaxRefreshArticles(),
  };
}

export async function refreshHerLensNews(): Promise<HerLensRefreshResponse> {
  try {
    const [freshArticles, existing] = await Promise.all([
      fetchLatestHerLensArticles(),
      getExistingNewsFingerprints(),
    ]);

    const uniqueArticles = filterDuplicateArticles(freshArticles, existing);
    if (uniqueArticles.length === 0) {
      return {
        success: true,
        fetched: freshArticles.length,
        duplicatesSkipped: freshArticles.length,
        summarized: 0,
        inserted: 0,
        failed: 0,
        maxArticles: expectedMaxRefreshArticles(),
      };
    }

    const summarized = await summarizeHerLensArticles(uniqueArticles);
    const stored = await insertSummarizedNews(summarized);

    return {
      success: true,
      fetched: freshArticles.length,
      duplicatesSkipped: freshArticles.length - uniqueArticles.length,
      summarized: summarized.length,
      inserted: stored.inserted,
      failed: stored.failed,
      maxArticles: expectedMaxRefreshArticles(),
    };
  } catch (err) {
    return friendlyRefreshError(err);
  }
}
