/**
 * app/dashboard/herlens/page.tsx
 *
 * HerLens - AI-curated daily knowledge hub.
 *
 * Stage 2F architecture:
 * Scheduler → /api/herlens/refresh → NewsData.io → Gemini → Supabase.
 * This page only reads cached Supabase data and filters locally in the client UI.
 */

import { HerLensPageClient } from "@/components/herlens/HerLensPageClient";
import { fetchCachedNewsAction } from "./actions";

export const metadata = {
  title: "HerLens - Herizon",
  description: "AI-curated news summaries for career, wellness, leadership, and culture.",
};

export default async function HerLensPage() {
  const result = await fetchCachedNewsAction();

  return (
    <HerLensPageClient
      articles={result.articles}
      lastUpdated={result.lastUpdated}
      error={result.success ? null : result.error}
    />
  );
}
