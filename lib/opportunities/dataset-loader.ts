/**
 * lib/opportunities/dataset-loader.ts
 *
 * Loads opportunity JSON files from data/*.json at the project root.
 * Module-level cache - files are read once per Node.js process lifetime.
 * Graceful fallback: missing files are skipped with a console warning.
 *
 * Server-side only. Never import from client components.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Opportunity, SearchIndexEntry } from "./types";

/* ── File config ─────────────────────────────────────────────── */

const DATA_DIR = join(process.cwd(), "data");

const DATASET_FILES: Array<{ file: string; category: string }> = [
  { file: "jobs.json",          category: "job"          },
  { file: "internships.json",   category: "internship"   },
  { file: "scholarships.json",  category: "scholarship"  },
  { file: "hackathons.json",    category: "hackathon"    },
  { file: "fellowships.json",   category: "fellowship"   },
  { file: "competitions.json",  category: "competition"  },
];

/* ── Module-level cache ───────────────────────────────────────── */

/** Cached dataset - loaded once per process */
let cachedDataset: Opportunity[] | null = null;
/** Cached search index - built once from the dataset */
let cachedSearchIndex: SearchIndexEntry[] | null = null;

/* ── Loader ──────────────────────────────────────────────────── */

/**
 * Returns all opportunities merged from all 6 JSON files.
 * Cached after first read - subsequent calls are synchronous-fast.
 */
export async function loadDataset(): Promise<Opportunity[]> {
  if (cachedDataset !== null) return cachedDataset;

  const results = await Promise.allSettled(
    DATASET_FILES.map(({ file }) => loadSingleFile(file))
  );

  const merged: Opportunity[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && Array.isArray(result.value)) {
      merged.push(...result.value);
    }
  }

  // Deduplicate by ID (safe guard for future multi-source repos)
  const seen = new Set<string>();
  const deduped = merged.filter((opp) => {
    if (seen.has(opp.id)) return false;
    seen.add(opp.id);
    return true;
  });

  cachedDataset = deduped;
  console.log(`[dataset-loader] Loaded ${deduped.length} opportunities from ${DATASET_FILES.length} files.`);
  return deduped;
}

/**
 * Reads and parses a single JSON file.
 * Returns [] on any error (file missing, invalid JSON, etc.).
 */
async function loadSingleFile(filename: string): Promise<Opportunity[]> {
  const filePath = join(DATA_DIR, filename);
  try {
    const raw = await readFile(filePath, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(`[dataset-loader] ${filename} is not a JSON array - skipping.`);
      return [];
    }
    return parsed as Opportunity[];
  } catch (err) {
    const isNotFound =
      err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT";
    if (!isNotFound) {
      console.warn(`[dataset-loader] Failed to read ${filename}:`, err);
    }
    // Silently skip missing files (expected until Stage 2D-1)
    return [];
  }
}

/* ── Search Index ────────────────────────────────────────────── */

/**
 * Builds a stable search index from the loaded dataset.
 * Called once and cached. O(n) build; O(n) search on the client.
 */
export function buildSearchIndexFromDataset(
  opportunities: Opportunity[]
): SearchIndexEntry[] {
  if (cachedSearchIndex !== null && cachedSearchIndex.length === opportunities.length) {
    return cachedSearchIndex;
  }
  cachedSearchIndex = opportunities.map((opp) => ({
    id: opp.id,
    searchText: [
      opp.title,
      opp.organization,
      opp.category,
      opp.location,
      opp.country,
      ...(opp.skills ?? []),
      ...(opp.preferredSkills ?? []),
      ...(opp.tags ?? []),
    ]
      .join(" ")
      .toLowerCase()
      .replace(/\s+/g, " "),
  }));
  return cachedSearchIndex;
}

/** Clears the module-level cache (useful for testing) */
export function clearDatasetCache(): void {
  cachedDataset = null;
  cachedSearchIndex = null;
}
