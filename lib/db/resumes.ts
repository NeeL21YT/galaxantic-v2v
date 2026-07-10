/**
 * lib/db/resumes.ts
 *
 * Data-access helpers for the `resumes` table.
 * All functions run server-side only.
 */

import { createClient } from "@/lib/supabase/server";
import type { Resume, ResumeInsert, AnalysisStatus } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-analysis";

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/* ── Read ──────────────────────────────────────────────────── */

/**
 * Returns all resumes for the current user, ordered newest-first.
 */
export async function getUserResumes(): Promise<Resume[]> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("[db/resumes] getUserResumes:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Deletes all resumes for the current user from the database.
 * (Note: Storage files are left orphaned for hackathon scope)
 */
export async function clearAllUserResumes(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("[db/resumes] clearAllUserResumes:", error.message);
    return false;
  }
  return true;
}

/**
 * Returns the most recently analyzed resume for the current user,
 * or null if no analysis exists yet.
 */
export async function getLatestAnalyzedResume(): Promise<Resume | null> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .eq("analysis_status", "completed")
    .order("analyzed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[db/resumes] getLatestAnalyzedResume:", error.message);
    return null;
  }
  return data;
}

/**
 * Returns a resume by ID, validating ownership via RLS.
 */
export async function getResumeById(id: string): Promise<Resume | null> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[db/resumes] getResumeById:", error.message);
    return null;
  }
  return data;
}

/**
 * Looks up an existing completed analysis by text hash.
 * Used for deduplication - avoids re-running Gemini on identical text.
 */
export async function findResumeByHash(
  textHash: string,
  userId: string
): Promise<Resume | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("text_hash", textHash)
    .eq("user_id", userId)
    .eq("analysis_status", "completed")
    .order("analyzed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[db/resumes] findResumeByHash:", error.message);
    return null;
  }
  return data;
}

/* ── Write ─────────────────────────────────────────────────── */

/**
 * Inserts a new resume row and returns the generated ID.
 */
export async function insertResume(
  row: ResumeInsert
): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resumes")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("[db/resumes] insertResume:", error.message);
    return null;
  }
  return data;
}

/**
 * Updates analysis_status for a resume row.
 */
export async function updateResumeStatus(
  id: string,
  status: AnalysisStatus
): Promise<void> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return;

  const { error } = await supabase
    .from("resumes")
    .update({ analysis_status: status })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("[db/resumes] updateResumeStatus:", error.message);
  }
}

/**
 * Saves extracted text and its hash after the extraction stage.
 */
export async function saveExtractedText(
  id: string,
  extractedText: string,
  textHash: string
): Promise<void> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return;

  const { error } = await supabase
    .from("resumes")
    .update({
      extracted_text: extractedText,
      text_hash: textHash,
      analysis_status: "analyzing",
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("[db/resumes] saveExtractedText:", error.message);
  }
}

interface SaveAnalysisParams {
  id: string;
  analysis: ResumeAnalysis;
  modelUsed: string;
  analysisVersion: string;
  analysisDurationMs: number;
}

/**
 * Persists the completed Gemini analysis to the database.
 */
export async function saveAnalysis({
  id,
  analysis,
  modelUsed,
  analysisVersion,
  analysisDurationMs,
}: SaveAnalysisParams): Promise<void> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) throw new Error("Not authenticated.");

  const { error } = await supabase
    .from("resumes")
    .update({
      analysis_json: analysis as unknown as Record<string, unknown>,
      resume_score: analysis.resumeScore,
      ats_score: analysis.atsScore,
      career_readiness: analysis.careerReadiness,
      model_used: modelUsed,
      analysis_version: analysisVersion,
      analysis_duration_ms: analysisDurationMs,
      analyzed_at: new Date().toISOString(),
      analysis_status: "completed",
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("[db/resumes] saveAnalysis:", error.message);
    throw new Error("Failed to save analysis to database.");
  }
}

/**
 * Marks a resume as failed with an optional error note in the JSON.
 */
export async function markResumeFailed(
  id: string,
  reason: string
): Promise<void> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return;

  await supabase
    .from("resumes")
    .update({
      analysis_status: "failed",
      analysis_json: { error: reason } as Record<string, unknown>,
    })
    .eq("id", id)
    .eq("user_id", userId);
}
