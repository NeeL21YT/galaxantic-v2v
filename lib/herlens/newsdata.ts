/**
 * lib/herlens/newsdata.ts
 *
 * NewsData.io REST client for HerLens refresh jobs.
 * Server-side only. Never import from client components.
 */

import {
  HERLENS_ARTICLES_PER_CATEGORY,
  HERLENS_CATEGORIES,
  type HerLensCategory,
  type HerLensCategoryConfig,
} from "./categories";

const NEWSDATA_ENDPOINT = "https://newsdata.io/api/1/latest";
const REQUEST_TIMEOUT_MS = 12_000;

export interface NewsDataArticle {
  category: HerLensCategory;
  title: string;
  source: string | null;
  originalUrl: string | null;
  publishedAt: string | null;
  description: string | null;
  content: string | null;
}

interface NewsDataApiArticle {
  title?: string | null;
  link?: string | null;
  source_id?: string | null;
  source_name?: string | null;
  pubDate?: string | null;
  description?: string | null;
  content?: string | null;
}

interface NewsDataResponse {
  status?: string;
  results?: NewsDataApiArticle[];
  message?: string;
}

export type NewsDataErrorCode = "CONFIGURATION" | "TIMEOUT" | "NETWORK" | "RATE_LIMIT" | "API_ERROR";

export class NewsDataError extends Error {
  code: NewsDataErrorCode;

  constructor(code: NewsDataErrorCode, message: string) {
    super(message);
    this.name = "NewsDataError";
    this.code = code;
  }
}

function withTimeout(signal: AbortSignal): AbortSignal {
  const controller = new AbortController();

  const abort = () => controller.abort(signal.reason);
  if (signal.aborted) abort();
  signal.addEventListener("abort", abort, { once: true });

  const timer = setTimeout(() => {
    controller.abort(new NewsDataError("TIMEOUT", "NewsData request timed out."));
  }, REQUEST_TIMEOUT_MS);

  controller.signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
  return controller.signal;
}

function normalizeArticle(
  category: HerLensCategory,
  article: NewsDataApiArticle
): NewsDataArticle | null {
  const title = article.title?.replace(/\s+/g, " ").trim();
  if (!title) return null;
  const publishedAtMs = article.pubDate ? new Date(article.pubDate).getTime() : Number.NaN;

  return {
    category,
    title,
    source: article.source_name ?? article.source_id ?? null,
    originalUrl: article.link ?? null,
    publishedAt: Number.isNaN(publishedAtMs) ? null : new Date(publishedAtMs).toISOString(),
    description: article.description?.replace(/\s+/g, " ").trim() ?? null,
    content: article.content?.replace(/\s+/g, " ").trim() ?? null,
  };
}

async function fetchCategory(
  apiKey: string,
  category: HerLensCategoryConfig,
  signal: AbortSignal
): Promise<NewsDataArticle[]> {
  const url = new URL(NEWSDATA_ENDPOINT);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("q", category.query);
  url.searchParams.set("language", "en");
  url.searchParams.set("size", String(HERLENS_ARTICLES_PER_CATEGORY));

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: withTimeout(signal),
      cache: "no-store",
    });
  } catch (err) {
    if (err instanceof NewsDataError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new NewsDataError("NETWORK", msg);
  }

  if (response.status === 429) {
    throw new NewsDataError("RATE_LIMIT", "NewsData rate limit reached.");
  }
  if (!response.ok) {
    throw new NewsDataError("API_ERROR", `NewsData responded with ${response.status}.`);
  }

  const payload = (await response.json()) as NewsDataResponse;
  if (payload.status && payload.status !== "success") {
    throw new NewsDataError("API_ERROR", payload.message ?? "NewsData returned an error.");
  }

  return (payload.results ?? [])
    .slice(0, HERLENS_ARTICLES_PER_CATEGORY)
    .map((article) => normalizeArticle(category.id, article))
    .filter((article): article is NewsDataArticle => article !== null);
}

export function getNewsDataFriendlyError(code: NewsDataErrorCode): string {
  switch (code) {
    case "CONFIGURATION":
      return "News refresh is not configured yet.";
    case "TIMEOUT":
      return "NewsData took too long to respond.";
    case "RATE_LIMIT":
      return "NewsData rate limit was reached.";
    case "NETWORK":
      return "Could not connect to NewsData.";
    default:
      return "NewsData returned an unexpected response.";
  }
}

export async function fetchLatestHerLensArticles(): Promise<NewsDataArticle[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    throw new NewsDataError("CONFIGURATION", "NEWSDATA_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const categoryResults = await Promise.allSettled(
    HERLENS_CATEGORIES.map((category) => fetchCategory(apiKey, category, controller.signal))
  );

  const articles: NewsDataArticle[] = [];
  const failures: string[] = [];

  for (const result of categoryResults) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      failures.push(reason);
    }
  }

  if (articles.length === 0 && failures.length > 0) {
    throw new NewsDataError("API_ERROR", failures[0]);
  }

  return articles.slice(0, HERLENS_CATEGORIES.length * HERLENS_ARTICLES_PER_CATEGORY);
}
