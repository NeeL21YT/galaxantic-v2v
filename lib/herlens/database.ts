/**
 * lib/herlens/database.ts
 *
 * Supabase CRUD helpers for cached HerLens news.
 * Reads use the authenticated server client. Refresh writes use the admin
 * client because herlens_news is intentionally service-role-write-only.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { HerlensNewsInsert, HerlensNewsRow } from "@/types/database";
import type { NewsArticle, NewsCategory } from "@/types/dashboard";
import type { SummarizedHerLensArticle } from "./gemini-summary";
import type { NewsFingerprint } from "./dedupe";
import {
  HERLENS_ARTICLES_PER_CATEGORY,
  HERLENS_CATEGORIES,
  isHerLensCategory,
  type HerLensCategory,
} from "./categories";

const MAX_CACHED_NEWS = 80;

function safeTakeaways(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean).slice(0, 4);
}

function relativeTime(value: string | null): string {
  if (!value) return "Recently";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Recently";

  const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (diffMinutes < 1) return "Now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function mapHerlensRowToArticle(row: HerlensNewsRow): NewsArticle | null {
  if (!row.category || !isHerLensCategory(row.category)) return null;

  return {
    id: row.id,
    category: row.category,
    headline: row.title,
    publishedTime: relativeTime(row.published_at ?? row.updated_at),
    summary: row.summary ?? "",
    detailedSummary: row.summary ?? "",
    keyTakeaways: safeTakeaways(row.key_takeaways),
    sourceName: row.source ?? "Original source",
    sourceUrl: row.original_url ?? "#",
  };
}

export async function fetchCachedNews(): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("herlens_news")
    .select("id, category, title, summary, key_takeaways, source, original_url, published_at, updated_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(MAX_CACHED_NEWS);

  if (error) {
    console.error("[herlens/database] fetchCachedNews:", error.message);
    return [];
  }

  return ((data ?? []) as HerlensNewsRow[])
    .map(mapHerlensRowToArticle)
    .filter((article): article is NewsArticle => article !== null);
}

export async function fetchCategoryNews(category: NewsCategory): Promise<NewsArticle[]> {
  const allNews = await fetchCachedNews();
  if (category === "all") return allNews;
  return allNews.filter((article) => article.category === category);
}

export async function fetchLatestHeadlines(limit = 5): Promise<NewsArticle[]> {
  const allNews = await fetchCachedNews();
  return allNews.slice(0, limit);
}

export async function getLastHerLensRefresh(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("herlens_news")
    .select("updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[herlens/database] getLastHerLensRefresh:", error.message);
    return null;
  }

  return (data as { updated_at?: string } | null)?.updated_at ?? null;
}

export async function getExistingNewsFingerprints(): Promise<NewsFingerprint[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("herlens_news")
    .select("title, original_url");

  if (error) {
    console.error("[herlens/database] getExistingNewsFingerprints:", error.message);
    throw new Error("Failed to load existing HerLens news.");
  }

  return (data ?? []) as NewsFingerprint[];
}

function toInsert(article: SummarizedHerLensArticle): HerlensNewsInsert {
  return {
    category: article.category,
    title: article.title,
    summary: article.summary,
    key_takeaways: article.keyTakeaways,
    source: article.source,
    original_url: article.originalUrl,
    published_at: article.publishedAt,
  };
}

export async function insertSummarizedNews(
  articles: SummarizedHerLensArticle[]
): Promise<{ inserted: number; failed: number }> {
  if (articles.length === 0) return { inserted: 0, failed: 0 };

  const supabase = createAdminClient();
  const rows = articles.map(toInsert);
  const { data, error } = await supabase
    .from("herlens_news")
    .insert(rows)
    .select("id");

  if (error) {
    console.error("[herlens/database] insertSummarizedNews:", error.message);
    throw new Error("Failed to store HerLens news.");
  }

  return {
    inserted: data?.length ?? 0,
    failed: Math.max(0, rows.length - (data?.length ?? 0)),
  };
}

export function expectedMaxRefreshArticles(): number {
  return HERLENS_CATEGORIES.length * HERLENS_ARTICLES_PER_CATEGORY;
}

export type { HerLensCategory };
