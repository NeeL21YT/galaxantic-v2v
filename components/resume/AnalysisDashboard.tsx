/**
 * components/resume/AnalysisDashboard.tsx
 *
 * Full AI analysis display - renders all 12 sections returned by Gemini.
 * This component only receives already-analyzed data; no fetching here.
 */

"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Lightbulb,
  BookOpen,
  Code2,
  Heart,
  AlertCircle,
  Award,
  Briefcase,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { ScoreRing } from "@/components/resume/ScoreRing";
import { RoadmapTimeline } from "@/components/resume/RoadmapTimeline";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import type { ResumeAnalysis } from "@/types/resume-analysis";

/* ── Helpers ──────────────────────────────────────────────── */

function sectionVariant(index: number) {
  return {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.45 } },
  };
}

/* ── Sub-components ──────────────────────────────────────── */

function SkillChip({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "missing";
}) {
  const styles =
    variant === "missing"
      ? {
          background: "rgba(220,38,38,0.08)",
          color: "#dc2626",
          border: "1px solid rgba(220,38,38,0.2)",
        }
      : {
          background: "rgba(94,123,155,0.10)",
          color: "var(--color-rackley)",
          border: "1px solid rgba(94,123,155,0.20)",
        };

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      style={styles}
    >
      {label}
    </span>
  );
}

function ChecklistItem({ text, accent = "var(--color-rackley)" }: { text: string; accent?: string }) {
  return (
    <li className="flex items-start gap-2 text-xs py-1.5 border-b last:border-0"
      style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-secondary)" }}>
      <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: accent }} aria-hidden="true" />
      <span>{text}</span>
    </li>
  );
}

function CardItem({
  text,
  icon,
  accentColor,
}: {
  text: string;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{ background: "var(--color-surface-hover)", border: "1px solid var(--color-border-light)" }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accentColor}18`, color: accentColor }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <p className="text-xs leading-relaxed pt-0.5" style={{ color: "var(--color-text-secondary)" }}>
        {text}
      </p>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */

interface AnalysisDashboardProps {
  analysis: ResumeAnalysis;
  fileName?: string;
  analyzedAt?: string;
  durationMs?: number;
}

export function AnalysisDashboard({
  analysis,
  fileName,
  analyzedAt,
  durationMs,
}: AnalysisDashboardProps) {
  const analyzedDate = analyzedAt
    ? new Date(analyzedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
    >
      {/* ── Header: 3 Score Rings ───────────────────────── */}
      <motion.div variants={sectionVariant(0)}>
        <DashboardCard
          title="AI Analysis Results"
          subtitle={
            fileName
              ? `${fileName}${analyzedDate ? ` · Analysed ${analyzedDate}` : ""}${durationMs ? ` · ${(durationMs / 1000).toFixed(1)}s` : ""}`
              : undefined
          }
          headerAction={
            <span
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Herizon AI
            </span>
          }
        >
          <div className="flex flex-wrap justify-center gap-8 py-4">
            <ScoreRing score={analysis.resumeScore} label="Resume Score" size={108} />
            <ScoreRing score={analysis.atsScore} label="ATS Score" size={108} />
            <ScoreRing score={analysis.careerReadiness} label="Career Readiness" size={108} />
          </div>
        </DashboardCard>
      </motion.div>

      {/* ── Summary ────────────────────────────────────── */}
      <motion.div variants={sectionVariant(1)}>
        <DashboardCard title="Summary" subtitle="AI overview of your resume">
          <p
            className="text-sm leading-relaxed mt-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {analysis.summary}
          </p>
        </DashboardCard>
      </motion.div>

      {/* ── Career Gap ─────────────────────────────────── */}
      <motion.div variants={sectionVariant(2)}>
        <DashboardCard title="Career Gap">
          <div className="flex items-start gap-3 mt-2">
            {analysis.careerGapDetected ? (
              <AlertTriangle
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#d97706" }}
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#16a34a" }}
                aria-hidden="true"
              />
            )}
            <div>
              <p
                className="text-sm font-semibold"
                style={{
                  color: analysis.careerGapDetected ? "#d97706" : "#16a34a",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {analysis.careerGapDetected ? "Gap Detected" : "No Significant Gap Detected"}
              </p>
              {analysis.careerGapDetected && analysis.careerGapExplanation && (
                <p
                  className="text-xs mt-1 leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {analysis.careerGapExplanation}
                </p>
              )}
            </div>
          </div>
        </DashboardCard>
      </motion.div>

      {/* ── Strengths + Weaknesses ──────────────────────── */}
      <motion.div variants={sectionVariant(3)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DashboardCard title="Strengths" subtitle={`${analysis.strengths.length} identified`}>
          <div className="flex flex-col gap-2 mt-3">
            {analysis.strengths.map((s, i) => (
              <CardItem
                key={i}
                text={s}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                accentColor="#16a34a"
              />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Weaknesses" subtitle={`${analysis.weaknesses.length} identified`}>
          <div className="flex flex-col gap-2 mt-3">
            {analysis.weaknesses.map((w, i) => (
              <CardItem
                key={i}
                text={w}
                icon={<XCircle className="w-3.5 h-3.5" />}
                accentColor="#d97706"
              />
            ))}
          </div>
        </DashboardCard>
      </motion.div>

      {/* ── Skills ─────────────────────────────────────── */}
      <motion.div variants={sectionVariant(4)}>
        <DashboardCard title="Skills">
          <div className="flex flex-col gap-4 mt-3">
            {analysis.technicalSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Code2 className="w-3.5 h-3.5" style={{ color: "var(--color-rackley)" }} aria-hidden="true" />
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                    Technical Skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.technicalSkills.map((s, i) => (
                    <SkillChip key={i} label={s} />
                  ))}
                </div>
              </div>
            )}

            {analysis.softSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Heart className="w-3.5 h-3.5" style={{ color: "var(--color-rose-gold)" }} aria-hidden="true" />
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                    Soft Skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.softSkills.map((s, i) => (
                    <SkillChip key={i} label={s} />
                  ))}
                </div>
              </div>
            )}

            {analysis.missingSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-3.5 h-3.5" style={{ color: "#dc2626" }} aria-hidden="true" />
                  <span className="text-xs font-semibold" style={{ color: "#dc2626" }}>
                    Missing / Gaps
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((s, i) => (
                    <SkillChip key={i} label={s} variant="missing" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DashboardCard>
      </motion.div>

      {/* ── Certifications + Projects ───────────────────── */}
      <motion.div variants={sectionVariant(5)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {analysis.certifications.length > 0 && (
          <DashboardCard title="Recommended Certifications" subtitle={`${analysis.certifications.length} suggestions`}>
            <div className="flex flex-col gap-2 mt-3">
              {analysis.certifications.map((c, i) => (
                <CardItem
                  key={i}
                  text={c}
                  icon={<Award className="w-3.5 h-3.5" />}
                  accentColor="var(--color-rackley)"
                />
              ))}
            </div>
          </DashboardCard>
        )}

        {analysis.recommendedProjects.length > 0 && (
          <DashboardCard title="Recommended Projects" subtitle={`${analysis.recommendedProjects.length} suggestions`}>
            <div className="flex flex-col gap-2 mt-3">
              {analysis.recommendedProjects.map((p, i) => (
                <CardItem
                  key={i}
                  text={p}
                  icon={<Briefcase className="w-3.5 h-3.5" />}
                  accentColor="var(--color-rose-gold)"
                />
              ))}
            </div>
          </DashboardCard>
        )}
      </motion.div>

      {/* ── Interview Tips + Resume Improvements ────────── */}
      <motion.div variants={sectionVariant(6)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DashboardCard
          title="Interview Tips"
          subtitle={`${analysis.interviewTips.length} tips`}
          headerAction={
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(94,123,155,0.10)", color: "var(--color-rackley)" }}>
              <Lightbulb className="w-3 h-3 inline mr-1" aria-hidden="true" />
              Prep
            </span>
          }
        >
          <ul className="mt-2 flex flex-col" role="list" aria-label="Interview tips">
            {analysis.interviewTips.map((tip, i) => (
              <ChecklistItem key={i} text={tip} accent="var(--color-rackley)" />
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard
          title="Resume Improvements"
          subtitle={`${analysis.resumeImprovements.length} suggestions`}
          headerAction={
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}>
              <Sparkles className="w-3 h-3 inline mr-1" aria-hidden="true" />
              AI
            </span>
          }
        >
          <ul className="mt-2 flex flex-col" role="list" aria-label="Resume improvement suggestions">
            {analysis.resumeImprovements.map((tip, i) => (
              <ChecklistItem key={i} text={tip} accent="var(--color-rose-gold)" />
            ))}
          </ul>
        </DashboardCard>
      </motion.div>

      {/* ── Personalised Roadmap ────────────────────────── */}
      <motion.div variants={sectionVariant(7)}>
        <DashboardCard
          title="Personalised Career Roadmap"
          subtitle="Your 90-day action plan"
          headerAction={
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              90-day plan
            </span>
          }
        >
          <div className="mt-4">
            <RoadmapTimeline roadmap={analysis.roadmap} />
          </div>
        </DashboardCard>
      </motion.div>
    </motion.div>
  );
}
