/**
 * lib/opportunities/types.ts
 *
 * Canonical TypeScript types for the Opportunity Navigator.
 * All types are data-source agnostic - the same shapes are used
 * regardless of whether data comes from JSON files, Supabase, or APIs.
 *
 * NEVER import UI-specific types (ReactNode etc.) here.
 */

/* ── Categories ──────────────────────────────────────────────── */

export type OpportunityCategory =
  | "job"
  | "internship"
  | "scholarship"
  | "hackathon"
  | "fellowship"
  | "competition";

/* ── Education + Career Stage ────────────────────────────────── */

export type EducationLevelFilter =
  | "any"
  | "high_school"
  | "diploma"
  | "undergraduate"
  | "postgraduate"
  | "phd"
  | "other";

export type CareerStageFilter =
  | "any"
  | "student"
  | "career_break"
  | "working"
  | "freelancer"
  | "entrepreneur";

/* ── Work Mode / Priority ────────────────────────────────────── */

export type WorkMode = "remote" | "hybrid" | "onsite";

export type Priority = "high" | "medium" | "low";

/* ── Core Opportunity (matches JSON dataset schema) ──────────── */

/**
 * Raw opportunity as stored in the JSON dataset.
 * This is the canonical, immutable shape from the data source.
 * The OpportunityRepository returns this type.
 */
export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  eligibility: string[];
  requirements: string[];
  skills: string[];
  preferredSkills: string[];
  location: string;
  country: string;
  remote: boolean;
  hybrid: boolean;
  deadline: string;           // ISO date string
  duration: string | null;
  stipend: string | null;
  applyUrl: string;
  featured: boolean;
  womenFocused: boolean;
  careerBreakFriendly: boolean;
  educationLevel: EducationLevelFilter;
  careerStage: CareerStageFilter;
  tags: string[];
}

/* ── AI Ranking ───────────────────────────────────────────────── */

/**
 * Gemini AI ranking result for a single opportunity.
 * Stored and retrieved SEPARATELY from the static Opportunity -
 * never mutated or merged into the dataset record.
 */
export interface GeminiRankResult {
  id: string;
  matchScore: number;           // 0–100 integer
  whyMatched: string;           // 2–3 sentence reasoning
  missingSkills: string[];
  recommendedLearning: string[];
  priority: Priority;
  nextAction: string;           // One specific action for the user to take
}

/**
 * Ranking run metadata - stored alongside AI notes in saved_opportunities.
 * Enables future re-ranking without modifying the original dataset.
 */
export interface RankingMeta {
  modelUsed: string;
  rankingVersion: string;
  rankedAt: string;             // ISO date string
  candidateCount: number;
  filterKey: string;
}

/* ── Ranked Opportunity (runtime shape for UI) ───────────────── */

/**
 * A ranked opportunity = static Opportunity + AI result + local pre-score.
 * This is the shape the UI consumes. It is NEVER persisted wholesale -
 * only the IDs and AI notes are saved to the DB.
 */
export interface RankedOpportunity {
  opportunity: Opportunity;
  rank: GeminiRankResult;
  localScore: number;           // Deterministic pre-score (for ordering before AI)
  isBookmarked: boolean;
}

/* ── Filters ─────────────────────────────────────────────────── */

export interface OpportunityFilters {
  categories: OpportunityCategory[];   // Empty = all categories
  workMode: WorkMode | null;            // null = all modes
  country: string | null;              // null = all countries
  educationLevel: EducationLevelFilter | null;
  womenFocused: boolean;
  careerBreakFriendly: boolean;
  hideExpired: boolean;
  highMatchOnly: boolean;              // Only show matchScore >= 70
  bookmarkedOnly: boolean;
}

export const DEFAULT_FILTERS: OpportunityFilters = {
  categories: [],
  workMode: null,
  country: null,
  educationLevel: null,
  womenFocused: false,
  careerBreakFriendly: false,
  hideExpired: true,
  highMatchOnly: false,
  bookmarkedOnly: false,
};

/* ── Pagination ───────────────────────────────────────────────── */

/**
 * Paginated result container.
 * First version always returns a single page; the structure is
 * already ready for larger datasets via page/pageSize.
 */
export interface OpportunityPage {
  items: RankedOpportunity[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

/* ── Search Index ─────────────────────────────────────────────── */

/**
 * Pre-built search index entry - generated once during dataset loading.
 * Enables fast O(n) client-side search even as the dataset grows.
 */
export interface SearchIndexEntry {
  id: string;
  /** Lowercased concatenation: title + org + category + skills + tags */
  searchText: string;
}

/* ── Server Action Response ───────────────────────────────────── */

export interface GetOpportunitiesResult {
  topMatches: RankedOpportunity[];
  allFiltered: Opportunity[];
  searchIndex: SearchIndexEntry[];
  meta: {
    total: number;
    filtered: number;
    sentToAI: number;
    ranked: number;
    fromCache: boolean;
    rankingMeta?: RankingMeta;
  };
}

export interface BookmarkData {
  rank: GeminiRankResult | null;
  rankingMeta: RankingMeta | null;
}
