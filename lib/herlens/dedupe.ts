/**
 * lib/herlens/dedupe.ts
 *
 * Duplicate detection for HerLens refreshes.
 */

import type { NewsDataArticle } from "./newsdata";

export interface NewsFingerprint {
  title: string | null;
  original_url: string | null;
}

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeUrl(value: string | null | undefined): string {
  try {
    const url = new URL(value ?? "");
    url.hash = "";
    url.searchParams.sort();
    return url.toString().toLowerCase();
  } catch {
    return normalize(value);
  }
}

export function filterDuplicateArticles(
  articles: NewsDataArticle[],
  existing: NewsFingerprint[]
): NewsDataArticle[] {
  const seenTitles = new Set(existing.map((item) => normalize(item.title)).filter(Boolean));
  const seenUrls = new Set(existing.map((item) => normalizeUrl(item.original_url)).filter(Boolean));
  const batchTitles = new Set<string>();
  const batchUrls = new Set<string>();

  return articles.filter((article) => {
    const title = normalize(article.title);
    const url = normalizeUrl(article.originalUrl);

    const duplicate =
      (title && (seenTitles.has(title) || batchTitles.has(title))) ||
      (url && (seenUrls.has(url) || batchUrls.has(url)));

    if (duplicate) return false;

    if (title) batchTitles.add(title);
    if (url) batchUrls.add(url);
    return true;
  });
}
