/**
 * lib/coach/context-loader.ts
 *
 * Loads the authenticated user's career context for a single AI Coach request.
 * Keep this helper server-only: it contains private profile, resume, and saved
 * opportunity data that should never be fetched directly from the client.
 */

import { createClient } from "@/lib/supabase/server";
import type { Profile, Resume } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-analysis";

export interface CoachRoadmapContext {
  id: string;
  goal: string | null;
  current_stage: string | null;
  roadmap_json: Record<string, unknown> | null;
  updated_at: string;
}

export interface CoachSavedOpportunity {
  id: string;
  opportunity_id: string | null;
  title: string | null;
  organization: string | null;
  category: string | null;
  deadline: string | null;
  url: string | null;
  ai_notes: Record<string, unknown> | null;
  saved_at: string;
}

export interface CoachUserContext {
  userId: string;
  profile: Profile | null;
  resume: Resume | null;
  resumeAnalysis: ResumeAnalysis | null;
  roadmap: CoachRoadmapContext | null;
  savedOpportunities: CoachSavedOpportunity[];
}

function parseResumeAnalysis(resume: Resume | null): ResumeAnalysis | null {
  if (!resume?.analysis_json) return null;
  return resume.analysis_json as unknown as ResumeAnalysis;
}

export async function loadCoachContext(userId: string): Promise<CoachUserContext> {
  const supabase = await createClient();

  const [profileResult, resumeResult, roadmapResult, savedResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", userId)
      .maybeSingle(),
    supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .eq("analysis_status", "completed")
      .order("analyzed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("career_roadmaps")
      .select("id, goal, current_stage, roadmap_json, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("saved_opportunities")
      .select("id, opportunity_id, title, organization, category, deadline, url, ai_notes, saved_at")
      .eq("user_id", userId)
      .order("saved_at", { ascending: false })
      .limit(12),
  ]);

  if (profileResult.error) {
    console.error("[coach/context-loader] profile:", profileResult.error.message);
  }
  if (resumeResult.error) {
    console.error("[coach/context-loader] resume:", resumeResult.error.message);
  }
  if (roadmapResult.error) {
    console.error("[coach/context-loader] roadmap:", roadmapResult.error.message);
  }
  if (savedResult.error) {
    console.error("[coach/context-loader] saved opportunities:", savedResult.error.message);
  }

  const resume = (resumeResult.data as Resume | null) ?? null;

  return {
    userId,
    profile: (profileResult.data as Profile | null) ?? null,
    resume,
    resumeAnalysis: parseResumeAnalysis(resume),
    roadmap: (roadmapResult.data as CoachRoadmapContext | null) ?? null,
    savedOpportunities: ((savedResult.data ?? []) as CoachSavedOpportunity[]),
  };
}
