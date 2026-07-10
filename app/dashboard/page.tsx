/**
 * app/dashboard/page.tsx
 *
 * Dashboard home — metrics, quick actions, recent activity.
 */

import { LayoutDashboard, FileText, Bot, Compass, Map, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Button } from "@/components/ui/Button";
import { getProfile } from "@/lib/db/profiles";
import { getUser } from "@/lib/supabase/server";
import { getLatestAnalyzedResume } from "@/lib/db/resumes";
import {
  PLACEHOLDER_ACTIVITY,
  PLACEHOLDER_MILESTONES,
} from "@/lib/data/placeholder";

export const metadata = {
  title: "Dashboard — Herizon",
  description: "Your career hub. Track readiness, opportunities, and milestones.",
};

export default async function DashboardPage() {
  const activeMilestone = PLACEHOLDER_MILESTONES.find((m) => m.status === "in-progress");
  const completedCount = PLACEHOLDER_MILESTONES.filter((m) => m.status === "completed").length;

  // Fetch real name, profile and latest resume analysis in parallel
  const [profile, user, latestResume] = await Promise.all([
    getProfile(),
    getUser(),
    getLatestAnalyzedResume(),
  ]);
  const firstName =
    profile?.full_name?.trim().split(" ")[0] ||
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  const resumeScore = latestResume?.resume_score ?? null;
  const careerReadiness = latestResume?.career_readiness ?? null;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Here's your career snapshot for today."
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<TrendingUp />}
          label="Career Readiness"
          value={careerReadiness !== null ? `${careerReadiness}%` : "—"}
          description={careerReadiness !== null ? undefined : "Upload a resume to track"}
          accent="rose"
          index={0}
        />
        <StatCard
          icon={<Compass />}
          label="Matched Opportunities"
          value="6"
          trend="up"
          trendLabel="3 new today"
          accent="blue"
          index={1}
        />
        <StatCard
          icon={<Map />}
          label="Milestones Done"
          value={`${completedCount} / ${PLACEHOLDER_MILESTONES.length}`}
          description="On track for 90-day goal"
          accent="green"
          index={2}
        />
        <StatCard
          icon={<FileText />}
          label="Resume Score"
          value={resumeScore !== null ? String(resumeScore) : "—"}
          description={resumeScore !== null ? "4 AI suggestions pending" : "Upload a resume to score"}
          accent="amber"
          index={3}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Quick Actions */}
        <DashboardCard
          title="Quick Actions"
          subtitle="Jump right in"
          className="lg:col-span-1"
          headerAction={
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              4 actions
            </span>
          }
        >
          <div className="grid grid-cols-2 gap-3 mt-3">
            <QuickActionCard
              icon={<FileText />}
              label="Upload Resume"
              description="Get AI feedback"
              href="/dashboard/resume"
              accent="blue"
              index={0}
            />
            <QuickActionCard
              icon={<Compass />}
              label="Find Opportunities"
              description="Browse 6 matches"
              href="/dashboard/opportunities"
              accent="rose"
              index={1}
            />
            <QuickActionCard
              icon={<Map />}
              label="Continue Roadmap"
              description="Next: Skill Assessment"
              href="/dashboard/roadmap"
              accent="green"
              index={2}
            />
            <QuickActionCard
              icon={<Bot />}
              label="Ask AI Coach"
              description="Get personalised advice"
              href="/dashboard/ai-coach"
              accent="amber"
              index={3}
            />
          </div>
        </DashboardCard>

        {/* Recent Activity */}
        <DashboardCard
          title="Recent Activity"
          subtitle="Your latest actions"
          className="lg:col-span-2"
          headerAction={
            <Button href="/dashboard" variant="ghost" size="sm">
              View all
            </Button>
          }
        >
          <ul className="flex flex-col gap-3 mt-3" role="list" aria-label="Recent activity">
            {PLACEHOLDER_ACTIVITY.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 py-2 border-b last:border-0"
                style={{ borderColor: "var(--color-border-light)" }}
              >
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                  style={{ background: "var(--color-surface-hover)" }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold leading-tight"
                    style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                    {item.description}
                  </p>
                </div>
                <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>

      {/* Active Milestone Banner */}
      {activeMilestone && (
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(180,108,114,0.10) 0%, rgba(94,123,155,0.10) 100%)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(94,123,155,0.15)", color: "var(--color-rackley)" }}
            >
              <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
              >
                In Progress: {activeMilestone.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                {activeMilestone.description}
              </p>
            </div>
          </div>
          <Button href="/dashboard/roadmap" variant="secondary" size="sm">
            View Roadmap →
          </Button>
        </div>
      )}
    </>
  );
}
