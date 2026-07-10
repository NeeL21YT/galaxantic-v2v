/**
 * lib/opportunities/repository.ts
 *
 * OpportunityRepository abstraction.
 *
 * Today: reads from local JSON files (data/*.json).
 * Future: swap to Supabase, REST API, or any other source
 * by returning a different implementation from createOpportunityRepository()
 * - without touching the filter engine, ranking engine, or UI.
 *
 * Server-side only.
 */

import type { Opportunity, SearchIndexEntry } from "./types";
import { loadDataset, buildSearchIndexFromDataset } from "./dataset-loader";

/* ── Repository Contract ─────────────────────────────────────── */

export interface OpportunityRepository {
  /** Returns all opportunities across all categories */
  findAll(): Promise<Opportunity[]>;
  /** Finds a single opportunity by dataset ID */
  findById(id: string): Promise<Opportunity | null>;
  /** Returns the pre-built search index (built once at load time) */
  getSearchIndex(): Promise<SearchIndexEntry[]>;
  /** Total count without materialising all records */
  count(): Promise<number>;
}

/* ── Factory ─────────────────────────────────────────────────── */

/**
 * Returns the active OpportunityRepository implementation.
 * Change this single line to swap data sources project-wide.
 */
export function createOpportunityRepository(): OpportunityRepository {
  return createJsonFileRepository();
}

/* ── JSON File Implementation ────────────────────────────────── */

function createJsonFileRepository(): OpportunityRepository {
  return {
    findAll: loadDataset,

    findById: async (id: string): Promise<Opportunity | null> => {
      const all = await loadDataset();
      return all.find((o) => o.id === id) ?? null;
    },

    getSearchIndex: async (): Promise<SearchIndexEntry[]> => {
      const all = await loadDataset();
      return buildSearchIndexFromDataset(all);
    },

    count: async (): Promise<number> => {
      const all = await loadDataset();
      return all.length;
    },
  };
}
