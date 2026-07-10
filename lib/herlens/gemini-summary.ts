/**
 * lib/herlens/gemini-summary.ts
 *
 * Gemini summaries and key takeaways for HerLens articles.
 * Server-side only.
 */

import { GoogleGenAI, Type } from "@google/genai";
import type { NewsDataArticle } from "./newsdata";

const MODEL_CHAIN = [
  { id: "gemini-3.5-flash",      thinkingBudget: 1024 },
  { id: "gemini-3.1-flash",      thinkingBudget: 1024 },
  { id: "gemini-3.1-flash-lite", thinkingBudget: 0    },
];
const REQUEST_TIMEOUT_MS = 25_000;

const RESPONSE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      index: { type: Type.INTEGER },
      summary: {
        type: Type.STRING,
        description: "Professional, easy-to-understand summary. Maximum 90 words. No markdown.",
      },
      keyTakeaways: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "2 to 4 concise bullet-style takeaways. No markdown.",
      },
    },
    required: ["index", "summary", "keyTakeaways"],
  },
};

export interface SummarizedHerLensArticle extends NewsDataArticle {
  summary: string;
  keyTakeaways: string[];
}

export type GeminiSummaryErrorCode =
  | "CONFIGURATION"
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "QUOTA"
  | "NETWORK"
  | "INVALID_RESPONSE"
  | "UNAVAILABLE";

export class GeminiSummaryError extends Error {
  code: GeminiSummaryErrorCode;

  constructor(code: GeminiSummaryErrorCode, message: string) {
    super(message);
    this.name = "GeminiSummaryError";
    this.code = code;
  }
}

function classifyError(err: unknown): GeminiSummaryErrorCode {
  if (err instanceof GeminiSummaryError) return err.code;
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();

  if (msg.includes("timeout")) return "TIMEOUT";
  if (msg.includes("429") || msg.includes("rate limit")) return "RATE_LIMIT";
  if (msg.includes("quota")) return "QUOTA";
  if (msg.includes("network") || msg.includes("fetch failed") || msg.includes("econnreset")) return "NETWORK";
  if (msg.includes("invalid") || msg.includes("missing")) return "INVALID_RESPONSE";
  return "UNAVAILABLE";
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function enforceSummaryLimit(summary: string): string {
  const words = summary.replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length <= 90) return words.join(" ");
  return `${words.slice(0, 90).join(" ")}.`;
}

function cleanTakeaways(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item).replace(/^[-*•]\s*/, "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 4);
}

function buildPrompt(articles: NewsDataArticle[]): string {
  const compactArticles = articles.map((article, index) => ({
    index,
    category: article.category,
    title: article.title,
    source: article.source,
    publishedAt: article.publishedAt,
    description: article.description,
    content: article.content?.slice(0, 2500) ?? null,
  }));

  return `You are HerLens AI, a professional news summarizer for Herizon, a career and growth platform for women.

Summarize each article for quick reading.

Rules:
- Summary must be maximum 90 words.
- Summary must be professional, clear, and easy to understand.
- Do not use markdown.
- Do not invent facts outside the supplied title, description, and content.
- If the article has limited information, state only what is available.
- Generate 2 to 4 concise bullet-style key takeaways.
- Key takeaways must not use markdown bullets; return plain strings.

ARTICLES:
${JSON.stringify(compactArticles, null, 2)}

Return only valid JSON matching the provided schema.`;
}

async function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new GeminiSummaryError("TIMEOUT", "Gemini summary request timed out."));
    }, REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function validateResponse(parsed: unknown, articles: NewsDataArticle[]): SummarizedHerLensArticle[] {
  if (!Array.isArray(parsed)) {
    throw new GeminiSummaryError("INVALID_RESPONSE", "Gemini response was not an array.");
  }

  const byIndex = new Map<number, { summary: string; keyTakeaways: string[] }>();

  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const index = Number(record.index);
    const summary = typeof record.summary === "string" ? enforceSummaryLimit(record.summary) : "";
    const keyTakeaways = cleanTakeaways(record.keyTakeaways);

    if (
      Number.isInteger(index) &&
      index >= 0 &&
      index < articles.length &&
      summary &&
      wordCount(summary) <= 90 &&
      keyTakeaways.length >= 2
    ) {
      byIndex.set(index, { summary, keyTakeaways });
    }
  }

  const summarized = articles
    .map((article, index) => {
      const result = byIndex.get(index);
      if (!result) return null;
      return {
        ...article,
        summary: result.summary,
        keyTakeaways: result.keyTakeaways,
      } satisfies SummarizedHerLensArticle;
    })
    .filter((article): article is SummarizedHerLensArticle => article !== null);

  if (summarized.length === 0) {
    throw new GeminiSummaryError("INVALID_RESPONSE", "No valid summaries returned.");
  }

  return summarized;
}

async function summarizeBatch(ai: GoogleGenAI, articles: NewsDataArticle[]): Promise<SummarizedHerLensArticle[]> {
  let lastError: unknown;
  let responseText: string | null = null;

  for (const model of MODEL_CHAIN) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: model.id,
          contents: buildPrompt(articles),
          config: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            ...(model.thinkingBudget > 0 ? { thinkingConfig: { thinkingBudget: model.thinkingBudget } } : {}),
          },
        })
      );
      if (response.text) {
        responseText = response.text;
        break;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[herlens/gemini-summary] ${model.id} failed:`, err instanceof Error ? err.message.slice(0, 100) : String(err));
    }
  }

  if (!responseText) {
    if (lastError) throw lastError;
    throw new GeminiSummaryError("INVALID_RESPONSE", "Empty Gemini response from all models.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new GeminiSummaryError("INVALID_RESPONSE", `Invalid Gemini JSON: ${responseText.slice(0, 160)}`);
  }

  return validateResponse(parsed, articles);
}

export function getGeminiSummaryFriendlyError(code: GeminiSummaryErrorCode): string {
  switch (code) {
    case "CONFIGURATION":
      return "Gemini summaries are not configured yet.";
    case "TIMEOUT":
      return "Gemini took too long to summarize the articles.";
    case "RATE_LIMIT":
    case "QUOTA":
      return "Gemini is temporarily busy or quota-limited.";
    case "NETWORK":
      return "Could not connect to Gemini.";
    case "INVALID_RESPONSE":
      return "Gemini returned an incomplete summary response.";
    default:
      return "Gemini summaries are temporarily unavailable.";
  }
}

export async function summarizeHerLensArticles(
  articles: NewsDataArticle[]
): Promise<SummarizedHerLensArticle[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiSummaryError("CONFIGURATION", "GEMINI_API_KEY is not configured.");
  }

  if (articles.length === 0) return [];

  const ai = new GoogleGenAI({ apiKey });
  const byCategory = new Map<string, NewsDataArticle[]>();
  for (const article of articles) {
    const existing = byCategory.get(article.category) ?? [];
    existing.push(article);
    byCategory.set(article.category, existing);
  }
  const summarized: SummarizedHerLensArticle[] = [];

  for (const categoryArticles of byCategory.values()) {
    let lastCode: GeminiSummaryErrorCode = "UNAVAILABLE";

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        summarized.push(...await summarizeBatch(ai, categoryArticles));
        lastCode = "UNAVAILABLE";
        break;
      } catch (err) {
        lastCode = classifyError(err);
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[herlens/gemini-summary] attempt ${attempt + 1} failed: ${msg.slice(0, 160)}`);

        if (lastCode === "CONFIGURATION" || lastCode === "QUOTA") break;
        if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (lastCode !== "UNAVAILABLE") {
      console.warn(`[herlens/gemini-summary] skipped category after failure: ${lastCode}`);
    }
  }

  if (summarized.length === 0) {
    throw new GeminiSummaryError("UNAVAILABLE", "No articles could be summarized.");
  }

  return summarized;
}
