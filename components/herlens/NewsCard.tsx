/**
 * components/herlens/NewsCard.tsx
 *
 * Expandable news card for HerLens.
 * Clicking "Expand Summary" expands the card in-place with
 * detailed summary, key takeaways, source, and a collapse button.
 * Does NOT navigate to another page.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, Clock } from "lucide-react";
import type { NewsArticle } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
  index?: number;
}

export function NewsCard({ article, index = 0 }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
      aria-label={article.headline}
    >
      {/* Card Header - always visible */}
      <div className="p-5 flex flex-col gap-3">
        {/* Meta */}
        <div className="flex items-center gap-2">
          <Clock
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{ color: "var(--color-text-muted)" }}
            aria-hidden="true"
          />
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            {article.publishedTime}
          </span>
        </div>

        {/* Headline */}
        <h3
          className="text-base font-bold leading-snug line-clamp-3"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-puce-red)",
          }}
        >
          {article.headline}
        </h3>

        {/* Short summary */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {article.summary}
        </p>

        {/* Expand button */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={cn(
            "flex items-center gap-1.5 text-sm font-semibold self-start",
            "transition-colors duration-150 rounded-lg px-3 py-1.5 -ml-3",
            "hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2"
          )}
          style={{ color: "var(--color-rose-gold)" }}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
              Read More
            </>
          )}
        </button>
      </div>

      {/* Expandable section */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-5 pb-5 flex flex-col gap-4 border-t pt-4"
              style={{ borderColor: "var(--color-border-light)" }}
            >


              {/* Key Takeaways */}
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--color-rose-gold)" }}
                >
                  Key Takeaways
                </p>
                <ul className="flex flex-col gap-2">
                  {article.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: "var(--color-rose-gold)" }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Source placeholder */}
              <div
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{
                  background: "var(--color-champagne)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Original Source
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-puce-red)" }}
                  >
                    {article.sourceName}
                  </span>
                </div>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-medium rounded-lg px-3 py-1.5"
                  style={{
                    background: "var(--color-border)",
                    color: "var(--color-text-muted)",
                  }}
                  aria-label={`Read original article from ${article.sourceName}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  Source
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
