/**
 * app/dashboard/page.tsx
 *
 * Dashboard home - metrics, quick actions, recent activity.
 */

import {
  Bookmark,
  Bot,
  Compass,
  FileText,
  LayoutDashboard,
  Map,
  TrendingUp,
  Wallet,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getProfile } from "@/lib/db/profiles";
import { getUser } from "@/lib/supabase/server";
import { getLatestAnalyzedResume } from "@/lib/db/resumes";
import { getMatchedCount } from "@/app/dashboard/opportunities/actions";
import { getLatestRoadmap, roadmapJsonToMilestones } from "@/lib/db/roadmaps";
import { loadDashboardActivity, type DashboardActivity } from "@/lib/dashboard/activity";

export const metadata = {
  title: "Dashboard - Herizon",
  description: "Your career hub. Track readiness, opportunities, and milestones.",
};

const activityIcon: Record<DashboardActivity["type"], ReactNode> = {
  resume_upload: <FileText className="w-4 h-4" style={{ color: "var(--color-rackley)" }} />,
  resume_analysis: <FileText className="w-4 h-4" style={{ color: "var(--color-rackley)" }} />,
  roadmap_generated: <Map className="w-4 h-4" style={{ color: "#16a34a" }} />,
  financial_plan: <Wallet className="w-4 h-4" style={{ color: "#d97706" }} />,
  opportunity_bookmarked: <Bookmark className="w-4 h-4" style={{ color: "var(--color-rose-gold)" }} />,
  coach_session: <Bot className="w-4 h-4" style={{ color: "var(--color-rose-gold)" }} />,
  profile_updated: <UserRound className="w-4 h-4" style={{ color: "var(--color-rackley)" }} />,
};

function formatActivityTime(value: string): string {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "recently";

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60_000));

  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default async function DashboardPage() {
  // Fetch real name, profile, latest resume analysis, and opportunity count in parallel
  const [profile, user, latestResume, matchedCount] = await Promise.all([
    getProfile(),
    getUser(),
    getLatestAnalyzedResume(),
    getMatchedCount(),
  ]);
  const [latestRoadmap, recentActivity] = user
    ? await Promise.all([
        getLatestRoadmap(user.id),
        loadDashboardActivity(user.id, 5),
      ])
    : [null, []];

  const milestones = roadmapJsonToMilestones(latestRoadmap?.roadmap_json ?? null);
  const activeMilestone = milestones.find((m) => m.status === "in-progress") ?? milestones[0] ?? null;
  const completedCount = milestones.filter((m) => m.status === "completed").length;

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
          description={careerReadiness !== null ? undefined : "Upload your resume to generate your readiness score."}
          accent="rose"
          index={0}
        />
        <StatCard
          icon={<Compass />}
          label="Matched Opportunities"
          value={String(matchedCount)}
          description={matchedCount === 0 ? "Complete your profile to receive AI matches." : undefined}
          accent="blue"
          index={1}
        />
        <StatCard
          icon={<Map />}
          label="Milestones Done"
          value={`${completedCount} / ${milestones.length}`}
          description={milestones.length === 0 ? "Generate your AI roadmap." : undefined}
          accent="green"
          index={2}
        />
        <StatCard
          icon={<FileText />}
          label="Resume Score"
          value={resumeScore !== null ? String(resumeScore) : "—"}
          description={resumeScore !== null ? undefined : "Upload your resume to receive an AI score."}
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
              description={matchedCount > 0 ? `Browse ${matchedCount} matches` : "Discover AI matches"}
              href="/dashboard/opportunities"
              accent="rose"
              index={1}
            />
            <QuickActionCard
              icon={<Map />}
              label="Continue Roadmap"
              description={activeMilestone ? `Next: ${activeMilestone.title}` : "Generate your AI roadmap"}
              href="/dashboard/roadmap"
              accent="green"
              index={2}
            />
            <QuickActionCard
              icon={<Bot />}
              label={recentActivity.some((activity) => activity.type === "coach_session") ? "Continue AI Coach" : "Ask AI Coach"}
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
          {recentActivity.length === 0 ? (
            <EmptyState
              compact
              icon={<LayoutDashboard className="w-6 h-6" />}
              title="No recent activity yet."
              description="Begin your journey by uploading a resume."
              action={<Button href="/dashboard/resume" variant="primary" size="sm">Upload Resume</Button>}
            />
          ) : (
            <ul className="flex flex-col gap-3 mt-3" role="list" aria-label="Recent activity">
              {recentActivity.map((item) => (
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
                    {activityIcon[item.type]}
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
                    {formatActivityTime(item.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
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
                {activeMilestone.status === "in-progress" ? "In Progress" : "Next"}: {activeMilestone.title}
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
