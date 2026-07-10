/**
 * lib/coach/gemini-chat.ts
 *
 * Gemini communication for the AI Career Coach.
 * Uses @google/genai with structured JSON responses.
 */

import { GoogleGenAI, Type } from "@google/genai";

interface ModelConfig {
  id: string;
  label: string;
  thinkingBudget: number;
}

const MODEL_CHAIN: ModelConfig[] = [
  { id: "gemini-3.5-flash",      label: "3.5 Flash (medium)",  thinkingBudget: 8192 },
  { id: "gemini-3.1-flash",      label: "3.1 Flash",           thinkingBudget: 4096 },
  { id: "gemini-3.1-flash-lite", label: "3.1 Flash Lite",      thinkingBudget: 0    },
];
const RESPONSE_VERSION = "1.0";
const REQUEST_TIMEOUT_MS = 30_000;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    responseMarkdown: {
      type: Type.STRING,
      description: "Personalized career coaching answer in safe Markdown.",
    },
    intent: {
      type: Type.STRING,
      description: "Short intent label for this user request.",
    },
    followUpSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 to 4 short suggested follow-up prompts.",
    },
  },
  required: ["responseMarkdown", "intent", "followUpSuggestions"],
};

export interface CoachGeminiResponse {
  responseMarkdown: string;
  intent: string;
  followUpSuggestions: string[];
  modelUsed: string;
  responseVersion: string;
  durationMs: number;
}

export type CoachGeminiErrorCode =
  | "CONFIGURATION"
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "QUOTA"
  | "NETWORK"
  | "INVALID_RESPONSE"
  | "UNAVAILABLE";

export class CoachGeminiError extends Error {
  code: CoachGeminiErrorCode;

  constructor(code: CoachGeminiErrorCode, message: string) {
    super(message);
    this.name = "CoachGeminiError";
    this.code = code;
  }
}

function classifyError(err: unknown): CoachGeminiErrorCode {
  if (err instanceof CoachGeminiError) return err.code;

  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();

  if (msg.includes("timeout")) return "TIMEOUT";
  if (msg.includes("429") || msg.includes("rate limit")) return "RATE_LIMIT";
  if (msg.includes("quota")) return "QUOTA";
  if (msg.includes("network") || msg.includes("fetch failed") || msg.includes("econnreset")) return "NETWORK";
  if (msg.includes("invalid json") || msg.includes("missing required")) return "INVALID_RESPONSE";
  return "UNAVAILABLE";
}

function validateResponse(parsed: unknown): Omit<CoachGeminiResponse, "modelUsed" | "responseVersion" | "durationMs"> {
  if (!parsed || typeof parsed !== "object") {
    throw new CoachGeminiError("INVALID_RESPONSE", "Invalid AI response shape.");
  }

  const data = parsed as Record<string, unknown>;
  if (typeof data.responseMarkdown !== "string" || data.responseMarkdown.trim().length === 0) {
    throw new CoachGeminiError("INVALID_RESPONSE", "AI response missing required message.");
  }

  const suggestions = Array.isArray(data.followUpSuggestions)
    ? data.followUpSuggestions.map(String).filter(Boolean).slice(0, 4)
    : [];

  return {
    responseMarkdown: data.responseMarkdown.trim(),
    intent: typeof data.intent === "string" && data.intent.trim()
      ? data.intent.trim()
      : "general_career_advice",
    followUpSuggestions: suggestions,
  };
}

async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new CoachGeminiError("TIMEOUT", "Gemini request timed out."));
    }, REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function generateOnce(ai: GoogleGenAI, prompt: string, model: ModelConfig): Promise<string> {
  const response = await withTimeout(
    ai.models.generateContent({
      model: model.id,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        ...(model.thinkingBudget > 0 ? { thinkingConfig: { thinkingBudget: model.thinkingBudget } } : {}),
      },
    })
  );

  if (!response.text) {
    throw new CoachGeminiError("INVALID_RESPONSE", "Empty response from Gemini.");
  }

  return response.text;
}

export function getFriendlyCoachErrorMessage(code: CoachGeminiErrorCode): string {
  switch (code) {
    case "CONFIGURATION":
      return "The AI Coach is not configured yet. Please add the Gemini API key and try again.";
    case "TIMEOUT":
      return "The AI Coach took too long to respond. Please try again in a moment.";
    case "RATE_LIMIT":
    case "QUOTA":
      return "The AI Coach is temporarily busy. Please wait a little and try again.";
    case "NETWORK":
      return "The AI Coach could not connect right now. Please check your connection and try again.";
    case "INVALID_RESPONSE":
      return "The AI Coach generated an incomplete response. Please try rephrasing your question.";
    default:
      return "The AI Coach is temporarily unavailable. Please try again soon.";
  }
}

export async function sendCoachPromptToGemini(prompt: string): Promise<CoachGeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new CoachGeminiError("CONFIGURATION", "GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const startMs = Date.now();
  let lastCode: CoachGeminiErrorCode = "UNAVAILABLE";

  for (const model of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await generateOnce(ai, prompt, model);
        let parsed: unknown;

        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new CoachGeminiError("INVALID_RESPONSE", `Invalid JSON from Gemini: ${raw.slice(0, 160)}`);
        }

        return {
          ...validateResponse(parsed),
          modelUsed: model.id,
          responseVersion: RESPONSE_VERSION,
          durationMs: Date.now() - startMs,
        };
      } catch (err) {
        lastCode = classifyError(err);
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`[coach/gemini-chat] [${model.label}] attempt ${attempt + 1} failed: ${errMsg.slice(0, 160)}`);

        if (lastCode === "CONFIGURATION" || lastCode === "INVALID_RESPONSE") {
          throw new CoachGeminiError(lastCode, getFriendlyCoachErrorMessage(lastCode));
        }

        // Fast switch on 404, 503, or Quota errors
        const msg = errMsg.toLowerCase();
        if (msg.includes("404") || msg.includes("not_found") || msg.includes("no longer available") || msg.includes("503") || msg.includes("high demand") || lastCode === "QUOTA") {
          lastCode = "UNAVAILABLE";
          break; // break the retry loop, try the next model
        }

        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      }
    }
  }

  throw new CoachGeminiError(lastCode, getFriendlyCoachErrorMessage(lastCode));
}
