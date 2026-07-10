/**
 * lib/opportunities/gemini-ranking.ts
 *
 * Ranks pre-filtered opportunity candidates using the Gemini API.
 *
 * Features:
 *   • Model waterfall: 3.5 Flash → 3.1 Flash → 3.1 Flash Lite
 *   • 10-minute per-user/filter cache (avoids re-ranking identical requests)
 *   • Structured JSON schema output
 *   • Retry on invalid response (max 2 retries)
 *   • AI ranking stored separately from static opportunity data
 *
 * Server-side only.
 */

import { GoogleGenAI, Type } from "@google/genai";
import type { Profile } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-analysis";
import type {
  GeminiRankResult,
  RankingMeta,
  OpportunityFilters,
} from "./types";
import type { ScoredOpportunity } from "./filter-engine";

/* ── Model Waterfall ─────────────────────────────────────────── */

interface ModelConfig {
  id: string;
  label: string;
  thinkingBudget: number;
}

const MODEL_CHAIN: ModelConfig[] = [
  { id: "gemini-3.5-flash",      label: "3.5 Flash",      thinkingBudget: 4096 },
  { id: "gemini-3.1-flash",      label: "3.1 Flash",      thinkingBudget: 2048 },
  { id: "gemini-3.1-flash-lite", label: "3.1 Flash Lite", thinkingBudget: 0    },
];

const RANKING_VERSION = "1.0";

/* ── 10-Minute Ranking Cache ─────────────────────────────────── */

interface CacheEntry {
  results: GeminiRankResult[];
  meta: RankingMeta;
  expiresAt: number;
}

/** Module-level cache keyed by userId:filterKey */
const rankingCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function buildFilterKey(userId: string, filters: OpportunityFilters, profile: Profile): string {
  return JSON.stringify({
    uid: userId,
    cats: [...filters.categories].sort(),
    mode: filters.workMode,
    country: filters.country,
    edu: filters.educationLevel,
    wf: filters.womenFocused,
    cb: filters.careerBreakFriendly,
    skills: [...(profile.skills ?? [])].sort(),
    stage: profile.career_stage,
    education: profile.education_level,
  });
}

function getCached(cacheKey: string): { results: GeminiRankResult[]; meta: RankingMeta } | null {
  const entry = rankingCache.get(cacheKey);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    rankingCache.delete(cacheKey);
    return null;
  }
  return { results: entry.results, meta: entry.meta };
}

function setCache(cacheKey: string, results: GeminiRankResult[], meta: RankingMeta): void {
  rankingCache.set(cacheKey, { results, meta, expiresAt: Date.now() + CACHE_TTL_MS });
}

/** Expose cache lookup for detail page - returns null on cache miss */
export function getCachedRankForOpportunity(
  cacheKey: string,
  opportunityId: string
): GeminiRankResult | null {
  const cached = getCached(cacheKey);
  if (!cached) return null;
  return cached.results.find((r) => r.id === opportunityId) ?? null;
}

/* ── Gemini Response Schema ──────────────────────────────────── */

const RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id:                   { type: Type.STRING,  description: "opportunity id from the candidate list" },
      matchScore:           { type: Type.INTEGER, description: "match score 0-100" },
      whyMatched:           { type: Type.STRING,  description: "2-3 sentence personalised reasoning" },
      missingSkills:        { type: Type.ARRAY,   items: { type: Type.STRING } },
      recommendedLearning:  { type: Type.ARRAY,   items: { type: Type.STRING } },
      priority:             { type: Type.STRING,  description: "high | medium | low" },
      nextAction:           { type: Type.STRING,  description: "one specific action for the user" },
    },
    required: ["id", "matchScore", "whyMatched", "missingSkills", "recommendedLearning", "priority", "nextAction"],
  },
};

/* ── Prompt Builder ──────────────────────────────────────────── */

function buildPrompt(
  profile: Profile,
  analysis: ResumeAnalysis | null,
  candidates: ScoredOpportunity[]
): string {
  const profileSummary = {
    education: profile.education_level ?? "not specified",
    careerStage: profile.career_stage ?? "not specified",
    location: profile.location ?? "not specified",
    skills: profile.skills ?? [],
    interests: profile.interests ?? [],
    bio: profile.bio ?? "",
  };

  const analysisSummary = analysis
    ? {
        resumeScore: analysis.resumeScore,
        careerReadiness: analysis.careerReadiness,
        technicalSkills: analysis.technicalSkills,
        softSkills: analysis.softSkills,
        missingSkills: analysis.missingSkills,
        careerGapDetected: analysis.careerGapDetected,
        careerGapExplanation: analysis.careerGapExplanation,
        summary: analysis.summary,
      }
    : "No resume analysis available yet.";

  const candidateList = candidates.map((c) => ({
    id: c.opportunity.id,
    title: c.opportunity.title,
    organization: c.opportunity.organization,
    category: c.opportunity.category,
    skills: c.opportunity.skills,
    preferredSkills: c.opportunity.preferredSkills,
    educationLevel: c.opportunity.educationLevel,
    careerStage: c.opportunity.careerStage,
    location: c.opportunity.location,
    remote: c.opportunity.remote,
    womenFocused: c.opportunity.womenFocused,
    careerBreakFriendly: c.opportunity.careerBreakFriendly,
    deadline: c.opportunity.deadline,
    featured: c.opportunity.featured,
    tags: c.opportunity.tags,
    localScore: c.localScore,
  }));

  return `You are Herizon AI, an expert career advisor specialising in helping women professionals discover the best opportunities for their career stage and goals.

USER PROFILE:
${JSON.stringify(profileSummary, null, 2)}

RESUME ANALYSIS:
${JSON.stringify(analysisSummary, null, 2)}

CANDIDATE OPPORTUNITIES (${candidateList.length} pre-filtered and locally scored):
${JSON.stringify(candidateList, null, 2)}

TASK:
Analyse each candidate opportunity against this user's exact profile. Select and rank only the TOP 10 best matches.

Consider:
1. Skill alignment (both current and aspirational skills from resume)
2. Education and career stage compatibility
3. Career gap support (if applicable - prioritise career-break-friendly opportunities)
4. Growth potential and relevance to the user's stated interests
5. Deadline feasibility and urgency
6. Women-focused opportunities (give them positive consideration)

For each of your top 10, provide:
- A PRECISE matchScore (0-100, be realistic not generous)
- A personalised whyMatched (2-3 sentences referencing the user's specific skills/background)
- Concrete missingSkills the user should acquire
- Specific recommendedLearning (courses, certifications, or resources)
- Priority: "high" (apply immediately), "medium" (apply within 2 weeks), "low" (explore when ready)
- nextAction: one clear, specific action the user should take right now

Return ONLY a valid JSON array of exactly 10 objects. No explanations outside the JSON.`;
}

/* ── Response Validation ─────────────────────────────────────── */

function validateResponse(parsed: unknown, candidateIds: Set<string>): GeminiRankResult[] {
  if (!Array.isArray(parsed)) throw new Error("Response is not an array.");
  if (parsed.length === 0) throw new Error("Response array is empty.");

  const valid: GeminiRankResult[] = [];
  for (const item of parsed) {
    if (typeof item !== "object" || item === null) continue;
    const r = item as Record<string, unknown>;

    if (typeof r.id !== "string" || !candidateIds.has(r.id)) continue;
    if (typeof r.matchScore !== "number") continue;
    if (typeof r.whyMatched !== "string") continue;

    valid.push({
      id: r.id,
      matchScore: Math.min(100, Math.max(0, Math.round(r.matchScore as number))),
      whyMatched: String(r.whyMatched),
      missingSkills: Array.isArray(r.missingSkills)
        ? (r.missingSkills as unknown[]).map(String)
        : [],
      recommendedLearning: Array.isArray(r.recommendedLearning)
        ? (r.recommendedLearning as unknown[]).map(String)
        : [],
      priority: ["high", "medium", "low"].includes(r.priority as string)
        ? (r.priority as "high" | "medium" | "low")
        : "medium",
      nextAction: typeof r.nextAction === "string" ? r.nextAction : "Review this opportunity.",
    });
  }

  if (valid.length === 0) throw new Error("No valid ranked results in response.");
  return valid;
}

/* ── Error Classification ────────────────────────────────────── */

function isFastSwitch(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("404") ||
    msg.includes("not_found") ||
    msg.includes("no longer available") ||
    msg.includes("503") ||
    msg.includes("unavailable") ||
    msg.includes("high demand")
  );
}

/* ── Single Model Attempt ────────────────────────────────────── */

async function tryModel(
  ai: GoogleGenAI,
  model: ModelConfig,
  prompt: string,
  candidateIds: Set<string>
): Promise<GeminiRankResult[]> {
  const config: Record<string, unknown> = {
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
  };
  if (model.thinkingBudget > 0) {
    config.thinkingConfig = { thinkingBudget: model.thinkingBudget };
  }

  const response = await ai.models.generateContent({
    model: model.id,
    contents: prompt,
    config,
  });

  const raw = response.text;
  if (!raw) throw new Error("Empty response from model.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON from model: ${raw.slice(0, 200)}`);
  }

  return validateResponse(parsed, candidateIds);
}

/* ── Main Export ─────────────────────────────────────────────── */

export interface RankOpportunitiesResult {
  results: GeminiRankResult[];
  meta: RankingMeta;
  fromCache: boolean;
}

/**
 * Ranks the given pre-filtered candidates using Gemini AI.
 * Returns cached results if available (10-min TTL).
 * Throws "HERIZON_AI_BUSY" if all models fail.
 */
export async function rankOpportunities(
  candidates: ScoredOpportunity[],
  profile: Profile,
  analysis: ResumeAnalysis | null,
  cacheKey: string
): Promise<RankOpportunitiesResult> {
  if (candidates.length === 0) {
    return {
      results: [],
      meta: {
        modelUsed: "none",
        rankingVersion: RANKING_VERSION,
        rankedAt: new Date().toISOString(),
        candidateCount: 0,
        filterKey: cacheKey,
      },
      fromCache: false,
    };
  }

  // Cache hit
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`[gemini-ranking] Cache hit for key ${cacheKey.slice(0, 40)}…`);
    return { results: cached.results, meta: cached.meta, fromCache: true };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(profile, analysis, candidates);
  const candidateIds = new Set(candidates.map((c) => c.opportunity.id));
  const startMs = Date.now();

  for (const model of MODEL_CHAIN) {
    console.log(`[gemini-ranking] Trying ${model.label} for ${candidates.length} candidates…`);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const results = await tryModel(ai, model, prompt, candidateIds);

        const meta: RankingMeta = {
          modelUsed: model.id,
          rankingVersion: RANKING_VERSION,
          rankedAt: new Date().toISOString(),
          candidateCount: candidates.length,
          filterKey: cacheKey,
        };

        setCache(cacheKey, results, meta);
        console.log(
          `[gemini-ranking] ✓ ${model.label} ranked ${results.length} results in ${Date.now() - startMs}ms`
        );
        return { results, meta, fromCache: false };
      } catch (err) {
        if (isFastSwitch(err)) {
          console.warn(`[gemini-ranking] Fast-switch from ${model.label}: ${String(err).slice(0, 100)}`);
          break; // Try next model immediately
        }
        if (attempt === 0) {
          console.warn(`[gemini-ranking] ${model.label} attempt 1 failed, retrying in 2s…`);
          await new Promise((r) => setTimeout(r, 2000));
        } else {
          console.warn(`[gemini-ranking] ${model.label} both attempts failed, switching model.`);
        }
      }
    }
  }

  throw new Error("HERIZON_AI_BUSY");
}
