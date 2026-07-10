/**
 * app/dashboard/roadmap/page.tsx
 *
 * Roadmap - 30/60/90-day milestone timeline.
 */

import { Map, CheckCircle2, Clock, Circle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { TimelineCard } from "@/components/dashboard/TimelineCard";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_MILESTONES } from "@/lib/data/placeholder";

export const metadata = {
  title: "Roadmap - Herizon",
  description: "Your 30/60/90-day personalised career return roadmap.",
};

const PHASES = [
  { label: "30 Days", description: "Foundation & refresh", phase: 30 as const },
  { label: "60 Days", description: "Applications & interviews", phase: 60 as const },
  { label: "90 Days", description: "Offer & onboarding", phase: 90 as const },
];

export default function RoadmapPage() {
  const completed = PLACEHOLDER_MILESTONES.filter((m) => m.status === "completed").length;
  const total = PLACEHOLDER_MILESTONES.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <>
      <PageHeader
        title="Career Roadmap"
        subtitle="Your personalised 90-day return-to-work plan."
        action={
          <Button 
            href="/dashboard/ai-coach" 
            variant="primary" 
            size="sm"
            leftIcon={<Map className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Update with AI
          </Button>
        }
      />

      {/* Progress summary */}
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center gap-4">
          {[
            { icon: <CheckCircle2 className="w-4 h-4" />, label: "Completed", value: PLACEHOLDER_MILESTONES.filter(m => m.status === "completed").length, color: "#16a34a" },
            { icon: <Clock className="w-4 h-4" />, label: "In Progress", value: PLACEHOLDER_MILESTONES.filter(m => m.status === "in-progress").length, color: "var(--color-rackley)" },
            { icon: <Circle className="w-4 h-4" />, label: "Upcoming", value: PLACEHOLDER_MILESTONES.filter(m => m.status === "upcoming").length, color: "var(--color-text-muted)" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span style={{ color: s.color }}>{s.icon}</span>
              <div>
                <p className="text-lg font-bold leading-none" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
                  {s.value}
                </p>
                <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <div className="flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
            <span>Overall Progress</span>
            <span style={{ color: "var(--color-rose-gold)" }}>{progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--color-rose-gold)" }}
            />
          </div>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            {completed} of {total} milestones complete
          </p>
        </div>
      </div>

      {/* Phase tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PHASES.map(({ label, description, phase }) => {
          const milestones = PLACEHOLDER_MILESTONES.filter((m) => m.phase === phase);
          return (
            <DashboardCard
              key={phase}
              title={label}
              subtitle={description}
              headerAction={
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "var(--color-surface-hover)", color: "var(--color-text-muted)" }}>
                  {milestones.length} tasks
                </span>
              }
            >
              <div className="mt-4">
                {milestones.map((m, i) => (
                  <TimelineCard
                    key={m.id}
                    milestone={m}
                    index={i}
                    isLast={i === milestones.length - 1}
                  />
                ))}
              </div>
            </DashboardCard>
          );
        })}
      </div>
    </>
  );
}
