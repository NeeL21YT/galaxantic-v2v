"use server";

/**
 * app/dashboard/herlens/actions.ts
 *
 * Server Actions for cached HerLens news.
 * Rendering reads Supabase only. NewsData and Gemini are used only by refresh.
 */

import { getUser } from "@/lib/supabase/server";
import {
  fetchCachedNews,
  fetchCategoryNews,
  fetchLatestHeadlines,
  getLastHerLensRefresh,
} from "@/lib/herlens/database";
import { refreshHerLensNews } from "@/lib/herlens/refresh";
import type { NewsCategory } from "@/types/dashboard";

async function requireAuth() {
  const user = await getUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function fetchCachedNewsAction() {
  try {
    await requireAuth();
    const [articles, lastUpdated] = await Promise.all([
      fetchCachedNews(),
      getLastHerLensRefresh(),
    ]);

    return { success: true, articles, lastUpdated };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg !== "UNAUTHENTICATED") {
      console.error("[herlens/actions] fetchCachedNewsAction:", msg);
    }
    return {
      success: false,
      articles: [],
      lastUpdated: null,
      error: msg === "UNAUTHENTICATED"
        ? "Please sign in to view HerLens."
        : "Could not load HerLens news.",
    };
  }
}

export async function fetchCategoryNewsAction(category: NewsCategory) {
  try {
    await requireAuth();
    const articles = await fetchCategoryNews(category);
    return { success: true, articles };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg !== "UNAUTHENTICATED") {
      console.error("[herlens/actions] fetchCategoryNewsAction:", msg);
    }
    return {
      success: false,
      articles: [],
      error: msg === "UNAUTHENTICATED"
        ? "Please sign in to view HerLens."
        : "Could not load this category.",
    };
  }
}

export async function fetchLatestHeadlinesAction(limit = 5) {
  try {
    await requireAuth();
    const articles = await fetchLatestHeadlines(limit);
    return { success: true, articles };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg !== "UNAUTHENTICATED") {
      console.error("[herlens/actions] fetchLatestHeadlinesAction:", msg);
    }
    return {
      success: false,
      articles: [],
      error: msg === "UNAUTHENTICATED"
        ? "Please sign in to view HerLens."
        : "Could not load latest headlines.",
    };
  }
}

export async function refreshNewsAction() {
  try {
    await requireAuth();

    if (process.env.NODE_ENV === "production" && process.env.HERLENS_ALLOW_MANUAL_REFRESH !== "true") {
      return {
        success: false,
        error: "Manual HerLens refresh is disabled in production. Use the protected refresh endpoint.",
        code: "MANUAL_REFRESH_DISABLED",
      };
    }

    return await refreshHerLensNews();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg !== "UNAUTHENTICATED") {
      console.error("[herlens/actions] refreshNewsAction:", msg);
    }
    return {
      success: false,
      error: msg === "UNAUTHENTICATED"
        ? "Please sign in to refresh HerLens."
        : "Could not refresh HerLens news.",
      code: msg === "UNAUTHENTICATED" ? "UNAUTHENTICATED" : "REFRESH_FAILED",
      maxArticles: 40,
    };
  }
}
