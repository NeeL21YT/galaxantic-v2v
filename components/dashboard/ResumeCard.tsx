/**
 * components/dashboard/ResumeCard.tsx
 *
 * Displays a single uploaded resume with score and quick actions.
 */

"use client";

import { FileText, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ResumeItem } from "@/types/dashboard";

interface ResumeCardProps {
  resume: ResumeItem;
  index?: number;
}

function ScoreRing({ score }: { score: number }) {
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;
  const scoreColor = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={scoreColor}
          strokeWidth="4"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color: scoreColor }}
        aria-label={`Score: ${score} out of 100`}
      >
        {score}
      </span>
    </div>
  );
}

export function ResumeCard({ resume, index = 0 }: ResumeCardProps) {
  const isProcessing = resume.status === "processing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="rounded-2xl p-4 flex items-start gap-4"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* File Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(94,123,155,0.10)", color: "var(--color-rackley)" }}
      >
        <FileText className="w-5 h-5" aria-hidden="true" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold leading-tight truncate"
          style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
        >
          {resume.filename}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Uploaded {new Date(resume.uploadedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        {resume.status === "analyzed" && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {resume.suggestions.slice(0, 2).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full text-[10px]"
                style={{ background: "rgba(245,158,11,0.10)", color: "#d97706" }}
              >
                {s.length > 32 ? s.slice(0, 32) + "…" : s}
              </span>
            ))}
            {resume.suggestions.length > 2 && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px]"
                style={{ background: "var(--color-surface-hover)", color: "var(--color-text-muted)" }}
              >
                +{resume.suggestions.length - 2} more
              </span>
            )}
          </div>
        )}
        {isProcessing && (
          <p className="text-xs mt-1.5" style={{ color: "var(--color-rackley)" }}>
            Analysing…
          </p>
        )}
      </div>

      {/* Score + actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {resume.status === "analyzed" && <ScoreRing score={resume.score} />}
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Set as primary resume"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "var(--color-surface-hover)", color: "var(--color-text-muted)" }}
          >
            <Star className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Delete resume"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}
            onClick={() => {
              // TODO Stage 2: implement delete
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
