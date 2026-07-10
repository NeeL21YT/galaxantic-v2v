/**
 * Data-access helpers for user-scoped AI career roadmaps.
 */

import { createClient } from "@/lib/supabase/server";
import type { CareerRoadmap } from "@/types/database";
import type { Milestone } from "@/types/dashboard";
import type { ResumeAnalysis, ResumeRoadmap } from "@/types/resume-analysis";

interface StoredRoadmapJson {
  source: "resume_analysis";
  resumeId: string;
  generatedAt: string;
  milestones: Milestone[];
  phases: {
    "30Days": string[];
    "60Days": string[];
    "90Days": string[];
  };
}

function addDays(date: Date, days: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

function titleFromTask(task: string): string {
  const normalized = task.replace(/\s+/g, " ").trim();
  if (normalized.length <= 80) return normalized;
  return `${normalized.slice(0, 77)}...`;
}

function buildMilestones(roadmap: ResumeRoadmap, generatedAt: Date): Milestone[] {
  const phaseConfig = [
    { key: "30Days" as const, phase: 30 as const, offset: 30 },
    { key: "60Days" as const, phase: 60 as const, offset: 60 },
    { key: "90Days" as const, phase: 90 as const, offset: 90 },
  ];

  return phaseConfig.flatMap(({ key, phase, offset }) =>
    (roadmap[key] ?? []).map((task, index) => ({
      id: `${key}-${index + 1}`,
      phase,
      title: titleFromTask(task),
      description: task,
      dueDate: addDays(generatedAt, offset),
      status: "upcoming" as const,
      tasks: [task],
    }))
  );
}

export function roadmapJsonToMilestones(value: Record<string, unknown> | null): Milestone[] {
  if (!value) return [];
  const rawMilestones = value.milestones;
  if (!Array.isArray(rawMilestones)) return [];

  return rawMilestones.filter((item): item is Milestone => {
    if (!item || typeof item !== "object") return false;
    const row = item as Partial<Milestone>;
    return (
      typeof row.id === "string" &&
      typeof row.title === "string" &&
      typeof row.description === "string" &&
      typeof row.dueDate === "string" &&
      (row.phase === 30 || row.phase === 60 || row.phase === 90) &&
      (row.status === "completed" || row.status === "in-progress" || row.status === "upcoming") &&
      Array.isArray(row.tasks)
    );
  });
}

export async function getLatestRoadmap(userId: string): Promise<CareerRoadmap | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("career_roadmaps")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[db/roadmaps] getLatestRoadmap:", error.message);
    return null;
  }

  return data as CareerRoadmap | null;
}

export async function saveRoadmapFromResumeAnalysis(
  userId: string,
  resumeId: string,
  analysis: ResumeAnalysis
): Promise<void> {
  const supabase = await createClient();
  const generatedAt = new Date();
  const roadmapJson: StoredRoadmapJson = {
    source: "resume_analysis",
    resumeId,
    generatedAt: generatedAt.toISOString(),
    milestones: buildMilestones(analysis.roadmap, generatedAt),
    phases: analysis.roadmap,
  };

  const { error } = await supabase
    .from("career_roadmaps")
    .insert({
      user_id: userId,
      goal: "Resume-based career roadmap",
      current_stage: "resume_analysis",
      roadmap_json: roadmapJson as unknown as Record<string, unknown>,
    });

  if (error) {
    console.error("[db/roadmaps] saveRoadmapFromResumeAnalysis:", error.message);
  }
}
