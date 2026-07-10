/**
 * app/dashboard/herlens/page.tsx
 *
 * HerLens - AI-curated daily knowledge hub.
 *
 * Architecture:
 * Currently uses placeholder data from lib/data/placeholder.ts
 *
 * TODO Stage 2: Replace HERLENS_ARTICLES with data fetched from Supabase.
 * Architecture:
 *   Hourly Scheduler (Vercel Cron) → NewsData.io (fetch latest articles)
 *   → Group by category → Gemini (ONE request per category, batch all articles)
 *   → Returns: 10 summaries + 10 key takeaways + structured JSON per category
 *   → Supabase (store pre-processed summaries with timestamp)
 *   → This page: read from Supabase, render instantly (no AI on user request)
 *
 * IMPORTANT: Do NOT summarise articles on-demand when the user opens this page.
 * Users should always receive pre-cached summaries for instant page load.
 */

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Info, Newspaper } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CategoryPill } from "@/components/herlens/CategoryPill";
import { NewsCard } from "@/components/herlens/NewsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  HERLENS_ARTICLES,
  HERLENS_CATEGORY_LABELS,
} from "@/lib/data/placeholder";
import type { NewsCategory } from "@/types/dashboard";

const CATEGORIES: NewsCategory[] = [
  "all",
  "beauty-health",
  "fashion-lifestyle",
  "career-finance",
  "education-stem",
  "sports-entertainment",
  "policy-leadership",
  "parenting-family",
  "travel-arts",
];

export default function HerLensPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("all");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") return HERLENS_ARTICLES;
    return HERLENS_ARTICLES.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <PageHeader
        title="HerLens"
        subtitle="Stay informed. Stay ahead."
      />

      {/* Meta bar - last updated + refresh note */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 -mt-4"
      >
        <div className="flex items-center gap-2">
          <Clock
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "var(--color-text-muted)" }}
            aria-hidden="true"
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            Last Updated:{" "}
            <span style={{ color: "var(--color-puce-red)" }}>
              Today • 10:00 AM
            </span>
          </span>
        </div>
        {/*
         * TODO Stage 2: Replace this static label with a live "Last refreshed X minutes ago"
         * using the timestamp stored in Supabase after each scheduled NewsData.io → Gemini run.
         * There is intentionally NO manual refresh button - news is always pre-cached.
         */}
        <span
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Automatically refreshed every hour
        </span>
      </motion.div>

      {/* Category pills - horizontal scroll on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
        role="tablist"
        aria-label="News categories"
      >
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat}
            label={HERLENS_CATEGORY_LABELS[cat]}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </motion.div>

      {/* News grid */}
      {filteredArticles.length > 0 ? (
        <section aria-label={`${HERLENS_CATEGORY_LABELS[activeCategory]} news articles`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article, i) => (
              <NewsCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          icon={<Newspaper className="w-8 h-8" />}
          title="No insights available."
          description="Check back soon. News summaries are refreshed every hour."
        />
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-start gap-3 rounded-2xl px-5 py-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
        }}
        role="note"
        aria-label="Disclaimer"
      >
        <Info
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: "var(--color-text-muted)" }}
          aria-hidden="true"
        />
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          News summaries are AI-generated from recent articles and are intended
          for quick reading. Please refer to the original source for complete
          details.
        </p>
      </motion.div>
    </div>
  );
}
