/**
 * components/herlens/HerLensPageClient.tsx
 *
 * Existing HerLens UI wired to cached Supabase data.
 * Filters locally; never calls NewsData or Gemini.
 */

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Info, Newspaper } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CategoryPill } from "@/components/herlens/CategoryPill";
import { NewsCard } from "@/components/herlens/NewsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { HERLENS_CATEGORY_LABELS } from "@/lib/herlens/categories";
import type { NewsArticle, NewsCategory } from "@/types/dashboard";

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

function formatLastUpdated(value: string | null): string {
  if (!value) return "Awaiting first refresh";

  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recently";
  }
}

interface HerLensPageClientProps {
  articles: NewsArticle[];
  lastUpdated: string | null;
  error?: string | null;
}

export function HerLensPageClient({
  articles,
  lastUpdated,
  error = null,
}: HerLensPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("all");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

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
              {formatLastUpdated(lastUpdated)}
            </span>
          </span>
        </div>
        <span
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Automatically refreshed every 12 hrs
        </span>
      </motion.div>

      {error && (
        <div
          className="rounded-2xl px-4 py-3 text-sm"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-puce-red)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

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
