/**
 * components/dashboard/OpportunityCard.tsx
 *
 * Card for a single opportunity in the opportunities grid.
 */

"use client";

import { useState } from "react";
import { Bookmark, MapPin, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Opportunity, OpportunityType } from "@/types/dashboard";

const typeColor: Record<OpportunityType, { bg: string; text: string }> = {
  job: { bg: "rgba(94,123,155,0.12)", text: "var(--color-rackley)" },
  internship: { bg: "rgba(34,197,94,0.10)", text: "#16a34a" },
  scholarship: { bg: "rgba(245,158,11,0.10)", text: "#d97706" },
  fellowship: { bg: "rgba(180,108,114,0.10)", text: "var(--color-rose-gold)" },
  hackathon: { bg: "rgba(168,85,247,0.10)", text: "#9333ea" },
  grant: { bg: "rgba(239,68,68,0.10)", text: "#dc2626" },
};

interface OpportunityCardProps {
  opportunity: Opportunity;
  index?: number;
}

export function OpportunityCard({ opportunity, index = 0 }: OpportunityCardProps) {
  const [bookmarked, setBookmarked] = useState(opportunity.isBookmarked);
  const typeStyle = typeColor[opportunity.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)" }}
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Logo placeholder */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "var(--color-surface-hover)", border: "1px solid var(--color-border-light)" }}
          >
            {opportunity.logoPlaceholder}
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold leading-tight truncate"
              style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
            >
              {opportunity.title}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {opportunity.company}
            </p>
          </div>
        </div>

        {/* Bookmark */}
        <button
          type="button"
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark opportunity"}
          onClick={() => setBookmarked((b) => !b)}
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
          style={{
            background: bookmarked ? "rgba(180,108,114,0.12)" : "var(--color-surface-hover)",
            color: bookmarked ? "var(--color-rose-gold)" : "var(--color-text-muted)",
          }}
        >
          <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Type badge + Match */}
      <div className="flex items-center justify-between">
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: typeStyle.bg, color: typeStyle.text }}
        >
          {opportunity.type}
        </span>
        <div className="flex items-center gap-1">
          <div
            className="h-1.5 w-16 rounded-full overflow-hidden"
            style={{ background: "var(--color-border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${opportunity.matchPercent}%`,
                background: "var(--color-rose-gold)",
              }}
            />
          </div>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-rose-gold)" }}
          >
            {opportunity.matchPercent}%
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" aria-hidden="true" />
          {opportunity.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          {new Date(opportunity.deadline).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {opportunity.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: "var(--color-surface-hover)", color: "var(--color-text-secondary)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Apply button */}
      <button
        type="button"
        className={cn("btn-base w-full py-2 text-xs gap-1.5")}
        style={{
          background: "var(--color-rose-gold)",
          color: "#fff",
          borderRadius: "var(--radius-full)",
        }}
        onClick={() => {
          // TODO Stage 2: implement application flow
        }}
      >
        <span>Apply Now</span>
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
