/**
 * lib/opportunities/repository.ts
 *
 * OpportunityRepository abstraction.
 *
 * The active implementation intentionally returns no records until a real
 * opportunity source is connected. This prevents generated local records from
 * appearing as personalized recommendations.
 *
 * Server-side only.
 */

import type { Opportunity, SearchIndexEntry } from "./types";

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

import { createLocalOpportunityRepository } from "./dataset-loader";

/* ── Factory ─────────────────────────────────────────────────── */

/**
 * Returns the active OpportunityRepository implementation.
 * Change this single line to swap data sources project-wide.
 */
export function createOpportunityRepository(): OpportunityRepository {
  return createLocalOpportunityRepository();
}

/* ── Empty Implementation ────────────────────────────────────── */

function createEmptyOpportunityRepository(): OpportunityRepository {
  return {
    findAll: async () => [],

    findById: async (): Promise<Opportunity | null> => null,

    getSearchIndex: async (): Promise<SearchIndexEntry[]> => [],

    count: async (): Promise<number> => 0,
  };
}
