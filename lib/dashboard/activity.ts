/**
 * Builds the dashboard activity feed from real user-owned database rows.
 */

import { createClient } from "@/lib/supabase/server";

export interface DashboardActivity {
  id: string;
  type:
    | "resume_upload"
    | "resume_analysis"
    | "roadmap_generated"
    | "financial_plan"
    | "opportunity_bookmarked"
    | "coach_session"
    | "profile_updated";
  title: string;
  description: string;
  createdAt: string;
}

interface ActivityRow {
  id: string;
  [key: string]: unknown;
}

function asDate(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function sortNewestFirst(items: DashboardActivity[]): DashboardActivity[] {
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function loadDashboardActivity(userId: string, limit = 5): Promise<DashboardActivity[]> {
  const supabase = await createClient();

  const [
    resumesResult,
    roadmapsResult,
    bookmarksResult,
    financialPlansResult,
    conversationsResult,
    profileResult,
  ] = await Promise.all([
    supabase
      .from("resumes")
      .select("id, file_name, analysis_status, resume_score, uploaded_at, analyzed_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("career_roadmaps")
      .select("id, goal, updated_at, created_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("saved_opportunities")
      .select("id, title, organization, saved_at")
      .eq("user_id", userId)
      .order("saved_at", { ascending: false })
      .limit(5),
    supabase
      .from("financial_plans")
      .select("id, goal, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("chat_conversations")
      .select("id, title, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("id, created_at, updated_at")
      .eq("auth_user_id", userId)
      .maybeSingle(),
  ]);

  const activities: DashboardActivity[] = [];

  if (!resumesResult.error) {
    for (const row of (resumesResult.data ?? []) as ActivityRow[]) {
      const fileName = typeof row.file_name === "string" && row.file_name ? row.file_name : "Resume";
      const uploadedAt = asDate(row.uploaded_at) ?? asDate(row.created_at);
      const analyzedAt = asDate(row.analyzed_at);

      if (uploadedAt) {
        activities.push({
          id: `resume-upload-${row.id}`,
          type: "resume_upload",
          title: "Resume Uploaded",
          description: fileName,
          createdAt: uploadedAt,
        });
      }

      if (analyzedAt && row.analysis_status === "completed") {
        const score = typeof row.resume_score === "number" ? ` with score ${row.resume_score}` : "";
        activities.push({
          id: `resume-analysis-${row.id}`,
          type: "resume_analysis",
          title: "Resume Analysis Completed",
          description: `${fileName}${score}`,
          createdAt: analyzedAt,
        });
      }
    }
  }

  if (!roadmapsResult.error) {
    for (const row of (roadmapsResult.data ?? []) as ActivityRow[]) {
      const createdAt = asDate(row.updated_at) ?? asDate(row.created_at);
      if (!createdAt) continue;
      activities.push({
        id: `roadmap-${row.id}`,
        type: "roadmap_generated",
        title: "Roadmap Generated",
        description: typeof row.goal === "string" && row.goal ? row.goal : "AI career roadmap",
        createdAt,
      });
    }
  }

  if (!bookmarksResult.error) {
    for (const row of (bookmarksResult.data ?? []) as ActivityRow[]) {
      const createdAt = asDate(row.saved_at);
      if (!createdAt) continue;
      const title = typeof row.title === "string" && row.title ? row.title : "Opportunity";
      const org = typeof row.organization === "string" && row.organization ? ` at ${row.organization}` : "";
      activities.push({
        id: `bookmark-${row.id}`,
        type: "opportunity_bookmarked",
        title: "Opportunity Bookmarked",
        description: `${title}${org}`,
        createdAt,
      });
    }
  }

  if (!financialPlansResult.error) {
    for (const row of (financialPlansResult.data ?? []) as ActivityRow[]) {
      const createdAt = asDate(row.updated_at);
      if (!createdAt) continue;
      activities.push({
        id: `financial-plan-${row.id}`,
        type: "financial_plan",
        title: "Financial Plan Generated",
        description: typeof row.goal === "string" && row.goal ? row.goal : "Financial Compass plan",
        createdAt,
      });
    }
  }

  if (!conversationsResult.error) {
    for (const row of (conversationsResult.data ?? []) as ActivityRow[]) {
      const createdAt = asDate(row.updated_at);
      if (!createdAt) continue;
      activities.push({
        id: `coach-${row.id}`,
        type: "coach_session",
        title: "AI Coach Session",
        description: typeof row.title === "string" && row.title ? row.title : "Career coaching conversation",
        createdAt,
      });
    }
  }

  if (!profileResult.error && profileResult.data) {
    const row = profileResult.data as ActivityRow;
    const updatedAt = asDate(row.updated_at);
    const createdAt = asDate(row.created_at);
    if (updatedAt && createdAt && updatedAt !== createdAt) {
      activities.push({
        id: `profile-${row.id}`,
        type: "profile_updated",
        title: "Profile Updated",
        description: "Your profile details were updated",
        createdAt: updatedAt,
      });
    }
  }

  return sortNewestFirst(activities).slice(0, limit);
}
