/**
 * lib/resume/gemini-helper.ts
 *
 * Analyses resume text using the Gemini API.
 *
 * Model waterfall - tries each model in priority order.
 * Fast-switches on 404 (model unavailable) or 503 (overloaded).
 * If all models fail returns a user-friendly busy message.
 *
 * Server-side only.
 */

import { GoogleGenAI, Type } from "@google/genai";
import type { ResumeAnalysis } from "@/types/resume-analysis";

/* ── Model priority chain ─────────────────────────────────── */

interface ModelConfig {
  id: string;
  label: string;          // for logging
  thinkingBudget: number; // 0 = disabled, >0 = tokens
}

const MODEL_CHAIN: ModelConfig[] = [
  { id: "gemini-3.5-flash",      label: "3.5 Flash (medium)",  thinkingBudget: 8192 },
  { id: "gemini-3.1-flash",      label: "3.1 Flash",           thinkingBudget: 4096 },
  { id: "gemini-3.1-flash-lite", label: "3.1 Flash Lite",      thinkingBudget: 0    },
];

const ANALYSIS_VERSION = "1.0";

/* ── Error classification ─────────────────────────────────── */

type ErrorClass = "FAST_SWITCH" | "RETRY" | "FATAL";

function classifyError(err: unknown): ErrorClass {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();

  // Instant switch - model is gone or slammed right now
  if (msg.includes("404") || msg.includes("not_found") || msg.includes("no longer available")) {
    return "FAST_SWITCH";
  }
  if (msg.includes("503") || msg.includes("unavailable") || msg.includes("high demand")) {
    return "FAST_SWITCH";
  }

  // Short wait then switch - quota
  if (msg.includes("429") || msg.includes("quota") || msg.includes("rate limit")) {
    return "RETRY";
  }

  // Unknown - one retry before switching
  return "RETRY";
}

/* ── JSON Schema for structured output ────────────────────── */

const stringArray = { type: Type.ARRAY, items: { type: Type.STRING } };

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    resumeScore:         { type: Type.INTEGER, description: "Overall resume score 0–100" },
    atsScore:            { type: Type.INTEGER, description: "ATS compatibility score 0–100" },
    careerReadiness:     { type: Type.INTEGER, description: "Career readiness score 0–100" },
    careerGapDetected:   { type: Type.BOOLEAN, description: "Whether a significant career gap was detected" },
    careerGapExplanation:{ type: Type.STRING,  description: "Explanation of the gap, empty string if none" },
    strengths:            stringArray,
    weaknesses:           stringArray,
    technicalSkills:      stringArray,
    softSkills:           stringArray,
    missingSkills:        stringArray,
    certifications:       { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended certifications" },
    recommendedProjects:  stringArray,
    interviewTips:        stringArray,
    resumeImprovements:   stringArray,
    summary:             { type: Type.STRING, description: "2–3 sentence professional summary" },
    roadmap: {
      type: Type.OBJECT,
      properties: {
        "30Days": stringArray,
        "60Days": stringArray,
        "90Days": stringArray,
      },
      required: ["30Days", "60Days", "90Days"],
    },
  },
  required: [
    "resumeScore","atsScore","careerReadiness","careerGapDetected",
    "careerGapExplanation","strengths","weaknesses","technicalSkills",
    "softSkills","missingSkills","certifications","recommendedProjects",
    "interviewTips","resumeImprovements","summary","roadmap",
  ],
};

/* ── Prompt ───────────────────────────────────────────────── */

function buildPrompt(resumeText: string): string {
  return `You are an expert ATS resume reviewer, career coach, HR consultant, and hiring manager with 20+ years of experience across top companies.

Analyse the following resume carefully and provide a detailed, honest, and actionable assessment.

RESUME TEXT:
---
${resumeText}
---

Scoring guidelines:
- resumeScore: Overall quality (format, clarity, impact, ATS-friendliness, achievements)
- atsScore: Keyword density, formatting compatibility with ATS parsers, section headers
- careerReadiness: How ready this candidate is to land interviews for their target role

For each section provide 3–6 concrete, specific, actionable items.
Reference actual content from the resume where possible - do not be generic.`;
}

/* ── Validation ───────────────────────────────────────────── */

function validate(obj: unknown): obj is ResumeAnalysis {
  if (!obj || typeof obj !== "object") return false;
  const a = obj as Record<string, unknown>;
  return (
    typeof a.resumeScore === "number" &&
    typeof a.atsScore === "number" &&
    typeof a.careerReadiness === "number" &&
    typeof a.careerGapDetected === "boolean" &&
    typeof a.careerGapExplanation === "string" &&
    Array.isArray(a.strengths) &&
    Array.isArray(a.weaknesses) &&
    Array.isArray(a.technicalSkills) &&
    Array.isArray(a.softSkills) &&
    Array.isArray(a.missingSkills) &&
    Array.isArray(a.certifications) &&
    Array.isArray(a.recommendedProjects) &&
    Array.isArray(a.interviewTips) &&
    Array.isArray(a.resumeImprovements) &&
    typeof a.summary === "string" &&
    typeof a.roadmap === "object" &&
    a.roadmap !== null
  );
}

/* ── Single model attempt ─────────────────────────────────── */

async function tryModel(
  ai: GoogleGenAI,
  model: ModelConfig,
  prompt: string
): Promise<{ analysis: ResumeAnalysis; durationMs: number }> {
  const startMs = Date.now();

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

  const durationMs = Date.now() - startMs;
  const raw = response.text;

  if (!raw) throw new Error("Empty response from model.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON from model: ${raw.slice(0, 200)}`);
  }

  if (!validate(parsed)) throw new Error("Response missing required fields.");

  // Clamp scores
  parsed.resumeScore     = Math.min(100, Math.max(0, Math.round(parsed.resumeScore)));
  parsed.atsScore        = Math.min(100, Math.max(0, Math.round(parsed.atsScore)));
  parsed.careerReadiness = Math.min(100, Math.max(0, Math.round(parsed.careerReadiness)));

  return { analysis: parsed, durationMs };
}

/* ── Main export ──────────────────────────────────────────── */

export interface GeminiAnalysisResult {
  analysis: ResumeAnalysis;
  modelUsed: string;
  analysisVersion: string;
  analysisDurationMs: number;
}

/**
 * Tries each model in MODEL_CHAIN in order.
 * Fast-switches on 404/503; does one retry for other errors.
 * Throws "HERIZON_AI_BUSY" if every model fails.
 */
export async function analyzeResumeWithGemini(
  resumeText: string
): Promise<GeminiAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured in .env.local");

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(resumeText);

  for (const model of MODEL_CHAIN) {
    console.log(`[gemini] Trying ${model.label} (${model.id})…`);

    // Each model gets up to 2 attempts for non-fast-switch errors
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const { analysis, durationMs } = await tryModel(ai, model, prompt);

        console.log(`[gemini] ✓ Success with ${model.label} in ${durationMs}ms`);

        return {
          analysis,
          modelUsed: model.id,
          analysisVersion: ANALYSIS_VERSION,
          analysisDurationMs: durationMs,
        };
      } catch (err) {
        const cls = classifyError(err);
        const errMsg = err instanceof Error ? err.message : String(err);

        if (cls === "FAST_SWITCH") {
          // Don't retry this model - move to next immediately
          console.warn(`[gemini] Fast-switch from ${model.label}: ${errMsg.slice(0, 120)}`);
          break; // exit inner loop → try next model
        }

        // RETRY path
        if (attempt === 0) {
          console.warn(`[gemini] ${model.label} attempt 1 failed, retrying in 2s: ${errMsg.slice(0, 120)}`);
          await new Promise((r) => setTimeout(r, 2000));
        } else {
          // Second attempt also failed - switch to next model
          console.warn(`[gemini] ${model.label} both attempts failed, switching model.`);
        }
      }
    }
  }

  // All models exhausted
  throw new Error("HERIZON_AI_BUSY");
}
