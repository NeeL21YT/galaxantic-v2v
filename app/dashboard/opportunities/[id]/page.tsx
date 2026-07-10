/* eslint-disable react-hooks/purity -- Server Component: all calls happen at server request time, never during client re-render */
/**
 * app/dashboard/opportunities/[id]/page.tsx
 *
 * Opportunity detail page - Server Component.
 * Shows the full opportunity + AI ranking (from cache or bookmarked notes).
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Wifi,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Zap,
} from "lucide-react";
import { MatchScoreRing } from "@/components/opportunities/MatchScoreRing";
import { getOpportunityWithRank } from "../actions";
import type { OpportunityCategory } from "@/lib/opportunities/types";

/* ── Metadata ────────────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { opportunity } = await getOpportunityWithRank(id);
  if (!opportunity) return { title: "Opportunity Not Found - Herizon" };
  return {
    title: `${opportunity.title} at ${opportunity.organization} - Herizon`,
    description: opportunity.description.slice(0, 160),
  };
}

/* ── Category colours ────────────────────────────────────────── */

const CATEGORY_COLOR: Record<OpportunityCategory, { bg: string; text: string }> = {
  job:         { bg: "rgba(94,123,155,0.12)",  text: "var(--color-rackley)"   },
  internship:  { bg: "rgba(34,197,94,0.10)",   text: "#16a34a"                },
  scholarship: { bg: "rgba(245,158,11,0.10)",  text: "#d97706"                },
  fellowship:  { bg: "rgba(180,108,114,0.10)", text: "var(--color-rose-gold)" },
  hackathon:   { bg: "rgba(168,85,247,0.10)",  text: "#9333ea"                },
  competition: { bg: "rgba(239,68,68,0.10)",   text: "#dc2626"                },
};

/* ── Page ────────────────────────────────────────────────────── */

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { opportunity, rank } = await getOpportunityWithRank(id);

  if (!opportunity) notFound();

  const catStyle = CATEGORY_COLOR[opportunity.category] ?? CATEGORY_COLOR.job;
  const daysLeft = Math.ceil(
    (new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      {/* Back nav */}
      <div className="mb-4">
        <Link
          href="/dashboard/opportunities"
          className="inline-flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="Back to opportunities"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Opportunities
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main content ───────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Header card */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                    style={{ background: catStyle.bg, color: catStyle.text }}
                  >
                    {opportunity.category}
                  </span>
                  {opportunity.remote && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1"
                      style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a" }}
                    >
                      <Wifi className="w-3 h-3" aria-hidden="true" />
                      Remote
                    </span>
                  )}
                  {opportunity.hybrid && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "rgba(94,123,155,0.08)", color: "var(--color-rackley)" }}
                    >
                      Hybrid
                    </span>
                  )}
                  {opportunity.womenFocused && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}
                    >
                      ♀ Women-focused
                    </span>
                  )}
                  {opportunity.careerBreakFriendly && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "rgba(245,158,11,0.08)", color: "#d97706" }}
                    >
                      Career-break friendly
                    </span>
                  )}
                </div>
                <h1
                  className="text-xl font-bold leading-tight"
                  style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
                >
                  {opportunity.title}
                </h1>
                <p className="text-base mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  {opportunity.organization}
                </p>
              </div>
              {rank && <MatchScoreRing score={rank.matchScore} size={56} />}
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: MapPin,   label: "Location", value: opportunity.location              },
                { icon: Calendar, label: "Deadline",  value: daysLeft > 0 ? `${daysLeft} days left` : "Expired" },
                ...(opportunity.duration ? [{ icon: Clock, label: "Duration", value: opportunity.duration }] : []),
                ...(opportunity.stipend  ? [{ icon: DollarSign, label: "Stipend", value: opportunity.stipend }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-3"
                  style={{ background: "var(--color-surface-hover)", border: "1px solid var(--color-border-light)" }}
                >
                  <p className="text-[10px] uppercase tracking-wide font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                    {label}
                  </p>
                  <p className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--color-puce-red)" }}>
                    <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <Section title="About this Opportunity">
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--color-text-secondary)" }}>
              {opportunity.description}
            </p>
          </Section>

          {/* Eligibility */}
          {opportunity.eligibility.length > 0 && (
            <Section title="Eligibility">
              <ul className="flex flex-col gap-2">
                {opportunity.eligibility.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-rackley)" }} aria-hidden="true" />
                    {e}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Requirements */}
          {opportunity.requirements.length > 0 && (
            <Section title="Requirements">
              <ul className="flex flex-col gap-2">
                {opportunity.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--color-rose-gold)" }} aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Skills */}
          {(opportunity.skills.length > 0 || opportunity.preferredSkills.length > 0) && (
            <Section title="Skills">
              <div className="flex flex-col gap-3">
                {opportunity.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>Required</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(94,123,155,0.10)", color: "var(--color-rackley)" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {opportunity.preferredSkills.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-muted)" }}>Preferred</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.preferredSkills.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "var(--color-surface-hover)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-light)" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}
        </div>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Apply card */}
          <div
            className="rounded-2xl p-5 sticky top-6"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
          >
            <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
              Ready to apply?
            </p>
            <a
              href={opportunity.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base w-full py-2.5 text-sm gap-2 mb-3"
              style={{ background: "var(--color-rose-gold)", color: "#fff", borderRadius: "var(--radius-full)" }}
              onClick={() => {
                // TODO: log analytics event: opportunity_opened
              }}
              aria-label={`Apply to ${opportunity.title} at ${opportunity.organization}`}
            >
              Apply Now
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>

            {daysLeft > 0 && daysLeft <= 30 && (
              <p
                className="text-xs text-center font-medium"
                style={{ color: daysLeft <= 7 ? "#dc2626" : "#d97706" }}
              >
                ⚠ {daysLeft} day{daysLeft !== 1 ? "s" : ""} left to apply
              </p>
            )}
            {daysLeft <= 0 && (
              <p className="text-xs text-center font-medium" style={{ color: "#dc2626" }}>
                This opportunity has closed.
              </p>
            )}

            {/* Tags */}
            {opportunity.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: "1px solid var(--color-border-light)" }}>
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "var(--color-surface-hover)", color: "var(--color-text-secondary)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI Analysis card */}
          {rank && (
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, rgba(180,108,114,0.06) 0%, rgba(94,123,155,0.06) 100%)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" style={{ color: "var(--color-rose-gold)" }} aria-hidden="true" />
                <p className="text-sm font-semibold" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
                  Herizon AI Analysis
                </p>
              </div>

              {/* Match score */}
              <div className="flex items-center gap-3 mb-4">
                <MatchScoreRing score={rank.matchScore} size={52} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--color-puce-red)" }}>
                    {rank.matchScore}% Match Score
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                    {rank.priority.charAt(0).toUpperCase() + rank.priority.slice(1)} priority
                  </p>
                </div>
              </div>

              {/* Why matched */}
              {rank.whyMatched && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    Why this matches you
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {rank.whyMatched}
                  </p>
                </div>
              )}

              {/* Next action */}
              {rank.nextAction && (
                <div
                  className="rounded-xl p-3 mb-4"
                  style={{ background: "rgba(180,108,114,0.08)", border: "1px solid rgba(180,108,114,0.15)" }}
                >
                  <p className="text-[11px] font-semibold mb-1 flex items-center gap-1" style={{ color: "var(--color-rose-gold)" }}>
                    <Zap className="w-3 h-3" aria-hidden="true" />
                    Next Action
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {rank.nextAction}
                  </p>
                </div>
              )}

              {/* Missing skills */}
              {rank.missingSkills.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                    <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                    Skills to develop
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {rank.missingSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "rgba(239,68,68,0.07)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.15)" }}>
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended learning */}
              {rank.recommendedLearning.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                    <BookOpen className="w-3 h-3" aria-hidden="true" />
                    Recommended learning
                  </p>
                  <ul className="flex flex-col gap-1">
                    {rank.recommendedLearning.map((item, i) => (
                      <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "var(--color-text-secondary)" }}>
                        <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--color-rackley)" }} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* No AI analysis - prompt to go back and rank */}
          {!rank && (
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: "rgba(180,108,114,0.04)",
                border: "1px dashed var(--color-border)",
              }}
            >
              <Sparkles className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--color-rose-gold)" }} aria-hidden="true" />
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-puce-red)" }}>
                AI Analysis Not Available
              </p>
              <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                Visit the Opportunities page to get your personalised match score for this role.
              </p>
              <Link
                href="/dashboard/opportunities"
                className="inline-block mt-3 text-xs font-semibold"
                style={{ color: "var(--color-rose-gold)" }}
              >
                Get AI Analysis →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Section wrapper ─────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }}
    >
      <h2
        className="text-sm font-bold mb-4"
        style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
