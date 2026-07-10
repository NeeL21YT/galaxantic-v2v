/**
 * lib/financial/gemini-financial.ts
 *
 * Gemini communication for Financial Compass AI.
 * Mirrors the architecture of lib/coach/gemini-chat.ts.
 *
 * Rules:
 * - Only responsible for Gemini API communication.
 * - No mathematical calculations.
 * - Uses model fallback chain for resilience.
 * - Returns typed FinancialGeminiResponse with metadata.
 */

import { GoogleGenAI } from "@google/genai";
import type { FinancialGeminiAnalysis } from "@/types/dashboard";
import {
  FINANCIAL_RESPONSE_SCHEMA,
  validateFinancialGeminiResponse,
} from "./prompt-builder";

/* ── Model Chain ─────────────────────────────────────────────── */

interface ModelConfig {
  id: string;
  label: string;
  thinkingBudget: number;
}

const MODEL_CHAIN: ModelConfig[] = [
  { id: "gemini-3.5-flash",      label: "3.5 Flash",      thinkingBudget: 8192 },
  { id: "gemini-3.1-flash",      label: "3.1 Flash",      thinkingBudget: 4096 },
  { id: "gemini-3.1-flash-lite", label: "3.1 Flash Lite", thinkingBudget: 0    },
];

const REQUEST_TIMEOUT_MS = 30_000;

/* ── Error Types ─────────────────────────────────────────────── */

export type FinancialGeminiErrorCode =
  | "CONFIGURATION"
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "QUOTA"
  | "NETWORK"
  | "INVALID_RESPONSE"
  | "UNAVAILABLE";

export class FinancialGeminiError extends Error {
  code: FinancialGeminiErrorCode;

  constructor(code: FinancialGeminiErrorCode, message: string) {
    super(message);
    this.name = "FinancialGeminiError";
    this.code = code;
  }
}

function classifyError(err: unknown): FinancialGeminiErrorCode {
  if (err instanceof FinancialGeminiError) return err.code;
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();

  if (msg.includes("timeout")) return "TIMEOUT";
  if (msg.includes("429") || msg.includes("rate limit")) return "RATE_LIMIT";
  if (msg.includes("quota")) return "QUOTA";
  if (msg.includes("network") || msg.includes("fetch failed") || msg.includes("econnreset")) return "NETWORK";
  if (msg.includes("invalid json") || msg.includes("missing required")) return "INVALID_RESPONSE";
  return "UNAVAILABLE";
}

export function getFriendlyFinancialErrorMessage(code: FinancialGeminiErrorCode): string {
  switch (code) {
    case "CONFIGURATION":
      return "Financial AI is not configured. Please add the GEMINI_API_KEY to your environment.";
    case "TIMEOUT":
      return "Financial AI took too long to respond. Please try again.";
    case "RATE_LIMIT":
    case "QUOTA":
      return "Financial AI is temporarily busy. Please wait a moment and try again.";
    case "NETWORK":
      return "Could not connect to Financial AI. Please check your connection.";
    case "INVALID_RESPONSE":
      return "Financial AI returned an incomplete response. Please try again.";
    default:
      return "Financial AI is temporarily unavailable. Please try again soon.";
  }
}

/* ── Timeout Wrapper ─────────────────────────────────────────── */

async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  const timeout = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new FinancialGeminiError("TIMEOUT", "Gemini financial request timed out."));
    }, REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timerId) clearTimeout(timerId);
  }
}

/* ── Result Type ─────────────────────────────────────────────── */

export interface FinancialGeminiResult {
  analysis: FinancialGeminiAnalysis;
  modelUsed: string;
  processingTimeMs: number;
}

/* ── Main Function ───────────────────────────────────────────── */

export async function sendFinancialPromptToGemini(prompt: string): Promise<FinancialGeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new FinancialGeminiError("CONFIGURATION", "GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const startMs = Date.now();
  let lastCode: FinancialGeminiErrorCode = "UNAVAILABLE";

  for (const model of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: model.id,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: FINANCIAL_RESPONSE_SCHEMA,
              ...(model.thinkingBudget > 0
                ? { thinkingConfig: { thinkingBudget: model.thinkingBudget } }
                : {}),
            },
          })
        );

        if (!response.text) {
          throw new FinancialGeminiError("INVALID_RESPONSE", "Empty response from Gemini.");
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(response.text);
        } catch {
          throw new FinancialGeminiError(
            "INVALID_RESPONSE",
            `Invalid JSON from Gemini: ${response.text.slice(0, 160)}`
          );
        }

        return {
          analysis:         validateFinancialGeminiResponse(parsed),
          modelUsed:        model.id,
          processingTimeMs: Date.now() - startMs,
        };
      } catch (err) {
        lastCode = classifyError(err);
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(
          `[financial/gemini] [${model.label}] attempt ${attempt + 1} failed: ${errMsg.slice(0, 160)}`
        );

        // Hard failures — do not retry
        if (lastCode === "CONFIGURATION" || lastCode === "INVALID_RESPONSE") {
          throw new FinancialGeminiError(lastCode, getFriendlyFinancialErrorMessage(lastCode));
        }

        // Switch model immediately on 404 / 503 / quota
        const msg = errMsg.toLowerCase();
        if (
          msg.includes("404") ||
          msg.includes("not_found") ||
          msg.includes("no longer available") ||
          msg.includes("503") ||
          msg.includes("high demand") ||
          lastCode === "QUOTA"
        ) {
          lastCode = "UNAVAILABLE";
          break; // move to next model
        }

        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      }
    }
  }

  throw new FinancialGeminiError(lastCode, getFriendlyFinancialErrorMessage(lastCode));
}
