/**
 * app/dashboard/career-break/page.tsx
 *
 * Career Break Companion - renders only stored user analysis.
 */

import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getLatestAnalyzedResume } from "@/lib/db/resumes";
import type { ResumeAnalysis } from "@/types/resume-analysis";

export const metadata = {
  title: "Career Break Companion - Herizon",
  description: "Analyse your career gap and plan your confident comeback.",
};

function getAnalysis(value: Record<string, unknown> | null): ResumeAnalysis | null {
  if (!value) return null;
  const analysis = value as unknown as ResumeAnalysis;
  if (
    typeof analysis.careerReadiness !== "number" ||
    typeof analysis.careerGapDetected !== "boolean" ||
    !Array.isArray(analysis.missingSkills) ||
    !Array.isArray(analysis.resumeImprovements) ||
    !Array.isArray(analysis.recommendedProjects)
  ) {
    return null;
  }
  return analysis;
}

function statusColor(status: "good" | "warn" | "bad") {
  if (status === "good") return { bg: "rgba(34,197,94,0.10)", text: "#16a34a" };
  if (status === "warn") return { bg: "rgba(245,158,11,0.10)", text: "#d97706" };
  return { bg: "rgba(239,68,68,0.10)", text: "#dc2626" };
}

export default async function CareerBreakPage() {
  const latestResume = await getLatestAnalyzedResume();
  const analysis = getAnalysis(latestResume?.analysis_json ?? null);

  if (!analysis) {
    return (
      <>
        <PageHeader
          title="Career Break Companion"
          subtitle="Start with a resume analysis so Herizon can assess your return-to-work context."
        />
        <DashboardCard title="Start Your Career Break Analysis" subtitle="No stored analysis found for your account.">
          <EmptyState
            icon={<Briefcase className="w-8 h-8" />}
            title="Start your AI career break analysis."
            description="Upload your first resume to generate career gap insights, readiness scoring, and next steps from your own data."
            action={<Button href="/dashboard/resume" variant="primary">Upload Resume</Button>}
            secondaryAction={<Button href="/dashboard/ai-coach" variant="outline">Chat with AI Coach</Button>}
          />
        </DashboardCard>
      </>
    );
  }

  const gapRows = [
    {
      label: "Experience level",
      value: analysis.summary ? "Available from resume analysis" : "Not captured",
      status: analysis.summary ? "good" : "bad",
    },
    {
      label: "Career framing",
      value: analysis.careerGapDetected ? "Gap detected" : "No significant gap detected",
      status: analysis.careerGapDetected ? "warn" : "good",
    },
    {
      label: "Skill relevance",
      value: analysis.missingSkills.length > 0 ? `${analysis.missingSkills.length} gaps identified` : "No missing skills identified",
      status: analysis.missingSkills.length > 0 ? "warn" : "good",
    },
    {
      label: "Portfolio status",
      value: analysis.recommendedProjects.length > 0 ? `${analysis.recommendedProjects.length} project recommendations` : "No project recommendations",
      status: analysis.recommendedProjects.length > 0 ? "warn" : "good",
    },
    {
      label: "LinkedIn status",
      value: "Not captured in stored analysis",
      status: "bad",
    },
  ] as const;

  const actionItems = [
    ...analysis.resumeImprovements,
    ...analysis.certifications,
    ...analysis.recommendedProjects,
  ].slice(0, 6);

  return (
    <>
      <PageHeader
        title="Career Break Companion"
        subtitle="Your stored return-to-work analysis from your latest resume."
        action={
          <Button href="/dashboard/ai-coach" variant="primary" size="sm">
            Chat with AI Coach
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<TrendingUp />} label="Career Readiness" value={`${analysis.careerReadiness}%`} accent="rose" index={0} />
        <StatCard icon={<Clock />} label="Break Duration" value="—" description="Not captured in stored analysis" accent="blue" index={1} />
        <StatCard icon={<Briefcase />} label="Skills to Upskill" value={String(analysis.missingSkills.length)} description="From latest analysis" accent="amber" index={2} />
        <StatCard icon={<CheckCircle2 />} label="Action Items" value={String(actionItems.length)} description="Database-backed recommendations" accent="green" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <DashboardCard title="Career Gap Analysis" subtitle="Stored AI assessment for this account">
          <div className="mt-3 space-y-3">
            {gapRows.map((row) => {
              const colors = statusColor(row.status);
              return (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0"
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{row.label}</span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-right"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>
        </DashboardCard>

        <DashboardCard title="Skill Gap Analysis" subtitle="Missing skills from the latest stored analysis">
          {analysis.missingSkills.length === 0 ? (
            <EmptyState
              compact
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="No skill gaps identified."
              description="Your latest resume analysis did not return missing skills."
            />
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: "rgba(245,158,11,0.10)",
                    color: "#d97706",
                    border: "1px solid rgba(245,158,11,0.20)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardCard title="Career Framing" subtitle="Resume-derived career break context">
          <div className="flex items-start gap-3 mt-2">
            {analysis.careerGapDetected ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#16a34a" }} aria-hidden="true" />
            )}
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {analysis.careerGapExplanation || analysis.summary}
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Recommendations" subtitle="Action items from your stored AI analysis">
          {actionItems.length === 0 ? (
            <EmptyState
              compact
              icon={<FileText className="w-6 h-6" />}
              title="No recommendations yet."
              description="Re-run resume analysis to generate updated recommendations."
            />
          ) : (
            <ul className="mt-3 flex flex-col gap-3" role="list">
              {actionItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "var(--color-surface-hover)", border: "1px solid var(--color-border-light)" }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--color-rose-gold)" }} aria-hidden="true" />
                  <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>
    </>
  );
}
