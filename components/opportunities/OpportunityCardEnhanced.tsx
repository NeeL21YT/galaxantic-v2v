"use client";

/**
 * components/opportunities/OpportunityCardEnhanced.tsx
 *
 * AI-enhanced opportunity card for the Opportunity Navigator.
 * Displays: org, title, category, location, remote badge, deadline,
 * match score ring, priority badge, why-matched teaser, missing skills,
 * apply button, and bookmark button.
 *
 * Uses the existing design system - no new CSS variables.
 * Does NOT modify the existing OpportunityCard component.
 */

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  MapPin,
  Calendar,
  ArrowRight,
  Wifi,
  Zap,
  Clock,
  TrendingDown,
} from "lucide-react";
import { MatchScoreRing } from "./MatchScoreRing";
import type { RankedOpportunity, OpportunityCategory } from "@/lib/opportunities/types";

/* ── Category colours ────────────────────────────────────────── */

const CATEGORY_COLOR: Record<OpportunityCategory, { bg: string; text: string }> = {
  job:           { bg: "rgba(94,123,155,0.12)",  text: "var(--color-rackley)"  },
  internship:    { bg: "rgba(34,197,94,0.10)",   text: "#16a34a"               },
  scholarship:   { bg: "rgba(245,158,11,0.10)",  text: "#d97706"               },
  fellowship:    { bg: "rgba(180,108,114,0.10)", text: "var(--color-rose-gold)" },
  hackathon:     { bg: "rgba(168,85,247,0.10)",  text: "#9333ea"               },
  competition:   { bg: "rgba(239,68,68,0.10)",   text: "#dc2626"               },
};

const PRIORITY_COLOR = {
  high:   { bg: "rgba(239,68,68,0.10)",   text: "#dc2626", icon: Zap    },
  medium: { bg: "rgba(245,158,11,0.10)",  text: "#d97706", icon: Clock  },
  low:    { bg: "rgba(94,123,155,0.10)",  text: "var(--color-rackley)", icon: TrendingDown },
};

/* ── Props ───────────────────────────────────────────────────── */

interface OpportunityCardEnhancedProps {
  item: RankedOpportunity;
  index?: number;
  onBookmarkToggle: (opportunityId: string, isBookmarked: boolean) => Promise<void>;
  onApply?: (opportunityId: string) => void;
}

/* ── Component ───────────────────────────────────────────────── */

export function OpportunityCardEnhanced({
  item,
  index = 0,
  onBookmarkToggle,
  onApply,
}: OpportunityCardEnhancedProps) {
  const { opportunity, rank, isBookmarked: initialBookmarked } = item;
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [mountTime] = useState<number>(() => Date.now());
  const [isExpanded, setIsExpanded] = useState(false);

  const catStyle = CATEGORY_COLOR[opportunity.category] ?? CATEGORY_COLOR.job;
  const priStyle = PRIORITY_COLOR[rank.priority] ?? PRIORITY_COLOR.medium;
  const PriorityIcon = priStyle.icon;

  const daysLeft = Math.ceil(
    (new Date(opportunity.deadline).getTime() - mountTime) / (1000 * 60 * 60 * 24)
  );
  const deadlineLabel =
    daysLeft <= 0
      ? "Expired"
      : daysLeft === 1
      ? "1 day left"
      : daysLeft <= 7
      ? `${daysLeft} days left`
      : new Date(opportunity.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  const deadlineUrgent = daysLeft > 0 && daysLeft <= 7;

  function handleBookmark() {
    const next = !bookmarked;
    setBookmarked(next);
    startTransition(async () => {
      try {
        await onBookmarkToggle(opportunity.id, next);
      } catch {
        setBookmarked(!next); // rollback on error
      }
    });
  }

  function handleApply() {
    // TODO: log analytics event: opportunity_opened
    if (onApply) onApply(opportunity.id);
    window.open(opportunity.applyUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)" }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {/* Category badge */}
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide flex-shrink-0"
              style={{ background: catStyle.bg, color: catStyle.text }}
            >
              {opportunity.category}
            </span>
            {/* Remote badge */}
            {opportunity.remote && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 flex-shrink-0"
                style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a" }}
              >
                <Wifi className="w-2.5 h-2.5" aria-hidden="true" />
                Remote
              </span>
            )}
            {/* Priority badge */}
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 flex-shrink-0 ml-auto"
              style={{ background: priStyle.bg, color: priStyle.text }}
            >
              <PriorityIcon className="w-2.5 h-2.5" aria-hidden="true" />
              {rank.priority.charAt(0).toUpperCase() + rank.priority.slice(1)} priority
            </span>
          </div>

          <Link
            href={`/dashboard/opportunities/${opportunity.id}`}
            className="text-sm font-semibold leading-tight line-clamp-2 hover:underline focus:outline-none"
            style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
          >
            {opportunity.title}
          </Link>
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>
            {opportunity.organization}
          </p>
        </div>

        {/* Match score ring + bookmark */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <MatchScoreRing score={rank.matchScore} size={44} />
          <button
            type="button"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark opportunity"}
            onClick={handleBookmark}
            disabled={isPending}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{
              background: bookmarked ? "rgba(180,108,114,0.12)" : "var(--color-surface-hover)",
              color: bookmarked ? "var(--color-rose-gold)" : "var(--color-text-muted)",
            }}
          >
            <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* ── Meta ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" aria-hidden="true" />
          {opportunity.location}
        </span>
        <span
          className="flex items-center gap-1"
          style={{ color: deadlineUrgent ? "#dc2626" : "inherit" }}
        >
          <Calendar className="w-3 h-3" aria-hidden="true" />
          {deadlineLabel}
        </span>
      </div>

      {/* ── Why matched ──────────────────────────────────────── */}
      {rank.whyMatched && !rank.whyMatched.includes("temporarily unavailable") && (
        <div
          className="rounded-xl px-3 py-2"
          style={{ background: "rgba(180,108,114,0.05)", border: "1px solid var(--color-border-light)" }}
        >
          <p className={`text-[11px] leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`} style={{ color: "var(--color-text-secondary)" }}>
            <span className="font-semibold" style={{ color: "var(--color-rose-gold)" }}>✦ Why matched: </span>
            {rank.whyMatched}
          </p>
          {rank.whyMatched.length > 90 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] font-medium mt-1 hover:underline focus:outline-none"
              style={{ color: "var(--color-rose-gold)" }}
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {/* ── Missing skills ────────────────────────────────────── */}
      {rank.missingSkills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {rank.missingSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ background: "rgba(239,68,68,0.07)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              + {skill}
            </span>
          ))}
          {rank.missingSkills.length > 3 && (
            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              +{rank.missingSkills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* ── Apply button ─────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleApply}
        className="btn-base w-full py-2 text-xs gap-1.5 mt-auto"
        style={{
          background: "var(--color-rose-gold)",
          color: "#fff",
          borderRadius: "var(--radius-full)",
        }}
        aria-label={`Apply to ${opportunity.title} at ${opportunity.organization}`}
      >
        <span>Apply Now</span>
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
