/**
 * app/dashboard/roadmap/page.tsx
 *
 * Roadmap - database-backed 30/60/90-day milestone timeline.
 */

import { Map, CheckCircle2, Clock, Circle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { TimelineCard } from "@/components/dashboard/TimelineCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getUser } from "@/lib/supabase/server";
import { getLatestRoadmap, roadmapJsonToMilestones } from "@/lib/db/roadmaps";

export const metadata = {
  title: "Roadmap - Herizon",
  description: "Your 30/60/90-day personalised career return roadmap.",
};

const PHASES = [
  { label: "30 Days", description: "Foundation & refresh", phase: 30 as const },
  { label: "60 Days", description: "Applications & interviews", phase: 60 as const },
  { label: "90 Days", description: "Offer & onboarding", phase: 90 as const },
];

export default async function RoadmapPage() {
  const user = await getUser();
  const latestRoadmap = user ? await getLatestRoadmap(user.id) : null;
  const milestones = roadmapJsonToMilestones(latestRoadmap?.roadmap_json ?? null);

  if (milestones.length === 0) {
    return (
      <>
        <PageHeader
          title="Career Roadmap"
          subtitle="Generate your personalized roadmap from your own Herizon analysis."
        />
        <DashboardCard title="Generate Your AI Career Roadmap" subtitle="No stored roadmap found for your account.">
          <EmptyState
            icon={<Map className="w-8 h-8" />}
            title="Generate your personalized roadmap."
            description="Your roadmap will be generated after completing Career Break Analysis and Resume Analysis."
            action={<Button href="/dashboard/resume" variant="primary">Upload Resume</Button>}
            secondaryAction={<Button href="/dashboard/career-break" variant="outline">View Career Break</Button>}
          />
        </DashboardCard>
      </>
    );
  }

  const completed = milestones.filter((m) => m.status === "completed").length;
  const inProgress = milestones.filter((m) => m.status === "in-progress").length;
  const upcoming = milestones.filter((m) => m.status === "upcoming").length;
  const total = milestones.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Career Roadmap"
        subtitle="Your stored 90-day return-to-work plan."
        action={
          <Button
            href="/dashboard/resume"
            variant="primary"
            size="sm"
            leftIcon={<Map className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Update with Resume
          </Button>
        }
      />

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
            { icon: <CheckCircle2 className="w-4 h-4" />, label: "Completed", value: completed, color: "#16a34a" },
            { icon: <Clock className="w-4 h-4" />, label: "In Progress", value: inProgress, color: "var(--color-rackley)" },
            { icon: <Circle className="w-4 h-4" />, label: "Upcoming", value: upcoming, color: "var(--color-text-muted)" },
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PHASES.map(({ label, description, phase }) => {
          const phaseMilestones = milestones.filter((m) => m.phase === phase);
          return (
            <DashboardCard
              key={phase}
              title={label}
              subtitle={description}
              headerAction={
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "var(--color-surface-hover)", color: "var(--color-text-muted)" }}
                >
                  {phaseMilestones.length} tasks
                </span>
              }
            >
              {phaseMilestones.length === 0 ? (
                <EmptyState
                  compact
                  icon={<Circle className="w-6 h-6" />}
                  title="No tasks in this phase."
                  description="This stored roadmap has no milestones for this phase."
                />
              ) : (
                <div className="mt-4">
                  {phaseMilestones.map((milestone, index) => (
                    <TimelineCard
                      key={milestone.id}
                      roadmapId={latestRoadmap?.id ?? ""}
                      milestone={milestone}
                      index={index}
                      isLast={index === phaseMilestones.length - 1}
                    />
                  ))}
                </div>
              )}
            </DashboardCard>
          );
        })}
      </div>
    </>
  );
}
