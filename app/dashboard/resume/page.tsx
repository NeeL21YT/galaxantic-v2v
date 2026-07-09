/**
 * app/dashboard/resume/page.tsx
 *
 * Resume page — drag & drop upload, score display, AI suggestions.
 */

"use client";

import { useState } from "react";
import { Upload, FileText, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_RESUMES } from "@/lib/data/placeholder";

const AI_TIPS = [
  "Add numbers and metrics to every bullet point",
  "Frame your career break as a period of intentional growth",
  "Lead with a strong professional summary targeting PM roles",
  "Remove skills older than 5 years unless still relevant",
];

export default function ResumePage() {
  const [dragging, setDragging] = useState(false);
  const primaryResume = PLACEHOLDER_RESUMES[0];

  return (
    <>
      <PageHeader
        title="Resume"
        subtitle="Upload your resume for instant AI scoring and suggestions."
        action={
          <Button variant="primary" size="sm">
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            Upload New
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upload zone + past uploads */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Drag & Drop zone */}
          <div
            className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 py-14 px-6 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: dragging ? "var(--color-rose-gold)" : "var(--color-border)",
              background: dragging ? "rgba(180,108,114,0.05)" : "var(--color-surface)",
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              // TODO Stage 2: handle file upload to Supabase storage
            }}
            role="region"
            aria-label="Resume drop zone"
          >
            <motion.div
              animate={{ scale: dragging ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}
              aria-hidden="true"
            >
              <Upload className="w-7 h-7" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
                Drag & drop your resume here
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                PDF, DOCX or TXT · Max 5MB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO Stage 2: trigger file input
              }}
            >
              Browse Files
            </Button>
          </div>

          {/* Previous uploads */}
          <DashboardCard title="Your Resumes" subtitle={`${PLACEHOLDER_RESUMES.length} uploads`}>
            <div className="flex flex-col gap-3 mt-3">
              {PLACEHOLDER_RESUMES.map((r, i) => (
                <ResumeCard key={r.id} resume={r} index={i} />
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Score + suggestions sidebar */}
        <div className="flex flex-col gap-5">
          {/* Score card */}
          <DashboardCard title="Resume Score" subtitle="AI analysis of your top resume">
            <div className="flex flex-col items-center py-4 gap-3">
              <div className="relative w-28 h-28">
                <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
                  <circle cx="56" cy="56" r="44" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                  <circle
                    cx="56" cy="56" r="44"
                    fill="none"
                    stroke={primaryResume.score >= 75 ? "#16a34a" : primaryResume.score >= 50 ? "#d97706" : "#dc2626"}
                    strokeWidth="8"
                    strokeDasharray={`${(primaryResume.score / 100) * (2 * Math.PI * 44)} ${2 * Math.PI * 44}`}
                    strokeLinecap="round"
                    transform="rotate(-90 56 56)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}>
                    {primaryResume.score}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>/ 100</span>
                </div>
              </div>
              <div
                className="w-full text-center px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: primaryResume.score >= 75 ? "rgba(34,197,94,0.10)" : "rgba(245,158,11,0.10)",
                  color: primaryResume.score >= 75 ? "#16a34a" : "#d97706",
                }}
              >
                {primaryResume.score >= 75 ? "Strong Resume" : "Needs Improvement"}
              </div>
            </div>
          </DashboardCard>

          {/* AI Suggestions */}
          <DashboardCard
            title="AI Suggestions"
            subtitle={`${primaryResume.suggestions.length} improvements found`}
            headerAction={
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}>
                <Sparkles className="w-3 h-3 inline mr-1" aria-hidden="true" />
                AI
              </span>
            }
          >
            <ul className="mt-3 flex flex-col gap-2" role="list" aria-label="AI resume suggestions">
              {primaryResume.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 py-2 border-b last:border-0 text-xs"
                  style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-secondary)" }}
                >
                  <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--color-rose-gold)" }} aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </DashboardCard>

          {/* Tips */}
          <DashboardCard title="Pro Tips" subtitle="General best practices">
            <ul className="mt-3 flex flex-col gap-2">
              {AI_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  <FileText className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--color-rackley)" }} aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
          </DashboardCard>
        </div>
      </div>
    </>
  );
}
