/**
 * app/dashboard/career-break/page.tsx
 *
 * Career Break Companion - gap analysis, skill gaps, readiness, next steps.
 */

import {
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_USER, PLACEHOLDER_SKILL_GAPS } from "@/lib/data/placeholder";

export const metadata = {
  title: "Career Break Companion - Herizon",
  description: "Analyse your career gap and plan your confident comeback.",
};

const NEXT_STEPS = [
  { icon: "📝", title: "Update your resume", description: "Add career break framing", href: "/dashboard/resume", done: true },
  { icon: "🎯", title: "Complete skill assessment", description: "Identify your top gaps", href: "/dashboard/ai-coach", done: false },
  { icon: "🌐", title: "Reconnect with network", description: "Reach out to 10 contacts", href: "#", done: false },
  { icon: "🔍", title: "Apply to opportunities", description: "3 new matches await", href: "/dashboard/opportunities", done: false },
];

const priorityColor = {
  high: { bg: "rgba(239,68,68,0.10)", text: "#dc2626" },
  medium: { bg: "rgba(245,158,11,0.10)", text: "#d97706" },
  low: { bg: "rgba(34,197,94,0.10)", text: "#16a34a" },
};

export default function CareerBreakPage() {
  return (
    <>
      <PageHeader
        title="Career Break Companion"
        subtitle="Your personalised return-to-work analysis and action plan."
        action={
          <Button href="/dashboard/ai-coach" variant="primary" size="sm">
            Chat with AI Coach →
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<TrendingUp />} label="Career Readiness" value={`${PLACEHOLDER_USER.careerReadiness}%`} trend="up" trendLabel="+8% this week" accent="rose" index={0} />
        <StatCard icon={<Clock />} label="Break Duration" value="24 mo" description="Jan 2023 - Jan 2025" accent="blue" index={1} />
        <StatCard icon={<Briefcase />} label="Skills to Upskill" value="5" description="Identified by AI" accent="amber" index={2} />
        <StatCard icon={<CheckCircle2 />} label="Steps Completed" value="1 / 4" description="Resume refresh done" accent="green" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Gap Analysis */}
        <DashboardCard title="Career Gap Analysis" subtitle="AI assessment of your career history">
          <div className="mt-3 space-y-3">
            {[
              { label: "Experience level", value: "Mid-Senior", status: "good" },
              { label: "Career break framing", value: "Needs improvement", status: "warn" },
              { label: "Skills relevance", value: "Partially updated", status: "warn" },
              { label: "LinkedIn profile", value: "Not optimised", status: "bad" },
              { label: "Portfolio / projects", value: "Not provided", status: "bad" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1.5 border-b last:border-0"
                style={{ borderColor: "var(--color-border-light)" }}>
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{row.label}</span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: row.status === "good" ? "rgba(34,197,94,0.10)" : row.status === "warn" ? "rgba(245,158,11,0.10)" : "rgba(239,68,68,0.10)",
                    color: row.status === "good" ? "#16a34a" : row.status === "warn" ? "#d97706" : "#dc2626",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Skill Gaps */}
        <DashboardCard title="Skill Gap Analysis" subtitle="Skills to bridge for your target roles">
          <div className="mt-3 space-y-4">
            {PLACEHOLDER_SKILL_GAPS.map((sg) => {
              const pColor = priorityColor[sg.priority];
              return (
                <div key={sg.skill}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {sg.skill}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {sg.current}% → {sg.target}%
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase"
                        style={{ background: pColor.bg, color: pColor.text }}>
                        {sg.priority}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${sg.target}%`, background: "rgba(180,108,114,0.25)" }} />
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${sg.current}%`, background: "var(--color-rose-gold)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardCard>
      </div>

      {/* Career Readiness + Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Readiness gauge */}
        <DashboardCard title="Career Readiness Score" subtitle="Based on resume, skills, and activity">
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="relative w-32 h-32">
              <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
                <circle cx="64" cy="64" r="54" fill="none" stroke="var(--color-border)" strokeWidth="10" />
                <circle
                  cx="64" cy="64" r="54"
                  fill="none"
                  stroke="var(--color-rose-gold)"
                  strokeWidth="10"
                  strokeDasharray={`${(PLACEHOLDER_USER.careerReadiness / 100) * (2 * Math.PI * 54)} ${2 * Math.PI * 54}`}
                  strokeLinecap="round"
                  transform="rotate(-90 64 64)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}>
                  {PLACEHOLDER_USER.careerReadiness}
                </span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>out of 100</span>
              </div>
            </div>
            <p className="text-sm text-center" style={{ color: "var(--color-text-secondary)" }}>
              You&apos;re in good shape! Complete the skill assessment to unlock your personalised learning path.
            </p>
            <Button href="/dashboard/ai-coach" variant="outline" size="sm">
              Improve My Score
            </Button>
          </div>
        </DashboardCard>

        {/* Recommended Next Steps */}
        <DashboardCard title="Recommended Next Steps" subtitle="Your personalised action plan">
          <ul className="mt-3 flex flex-col gap-3" role="list">
            {NEXT_STEPS.map((step, i) => (
              <li key={i}>
                <a
                  href={step.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-150 group"
                  style={{
                    background: step.done ? "rgba(34,197,94,0.06)" : "var(--color-surface-hover)",
                    border: "1px solid var(--color-border-light)",
                    opacity: step.done ? 0.7 : 1,
                  }}
                >
                  <span className="text-xl flex-shrink-0" aria-hidden="true">{step.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: step.done ? "#16a34a" : "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
                      {step.done && <span aria-hidden="true">✓ </span>}{step.title}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{step.description}</p>
                  </div>
                  {!step.done && (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 group-hover:text-rose-gold" style={{ color: "var(--color-text-muted)" }} aria-hidden="true" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </>
  );
}
