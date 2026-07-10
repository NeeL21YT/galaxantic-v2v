/**
 * app/dashboard/resume/actions.ts
 *
 * Server Actions for the resume intelligence pipeline.
 *
 * processResume()      - single orchestration: Upload → Extract → Analyze → Save
 * reanalyzeResume()    - re-run Gemini on stored extracted_text (no re-upload)
 * fetchUserResumes()   - return all resume rows for the current user
 * fetchLatestAnalysis() - return the most recently completed analysis
 */

"use server";

import { createHash } from "crypto";
import { getUser } from "@/lib/supabase/server";
import { validateFile, uploadResumeToStorage } from "@/lib/resume/upload-helper";
import { extractTextFromPDF } from "@/lib/resume/pdf-helper";
import { extractTextFromDOCX } from "@/lib/resume/docx-helper";
import { analyzeResumeWithGemini } from "@/lib/resume/gemini-helper";
import {
  insertResume,
  updateResumeStatus,
  saveExtractedText,
  saveAnalysis,
  markResumeFailed,
  getUserResumes,
  getLatestAnalyzedResume,
  getResumeById,
  findResumeByHash,
  clearAllUserResumes,
} from "@/lib/db/resumes";
import { saveRoadmapFromResumeAnalysis } from "@/lib/db/roadmaps";
import { revalidatePath } from "next/cache";
import type { Resume } from "@/types/database";
import type { ProcessResumeResult } from "@/types/resume-analysis";

/* ── Types ──────────────────────────────────────────────────── */

export type ResumeActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/* ── Helpers ─────────────────────────────────────────────────── */

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

async function extractText(
  buffer: ArrayBuffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(buffer);
  }
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractTextFromDOCX(buffer);
  }
  throw new Error(`Unsupported MIME type for extraction: ${mimeType}`);
}

/* ── processResume ───────────────────────────────────────────── */

/**
 * Single orchestration action for the full resume pipeline:
 *   1. Validate file (type + size)
 *   2. Upload to Supabase Storage
 *   3. Insert DB row (status: uploading → uploaded)
 *   4. Extract text  (status: extracting)
 *   5. Check hash for deduplication (skip Gemini if duplicate found)
 *   6. Call Gemini   (status: analyzing)
 *   7. Save analysis (status: completed)
 *   8. Return result directly - no page re-fetch needed
 *
 * Returns analysis data directly in the response so the UI can update
 * immediately without a server re-render round-trip.
 */
export async function processResume(
  formData: FormData
): Promise<ResumeActionResult<ProcessResumeResult>> {
  /* ── Auth ── */
  const user = await getUser();
  if (!user) {
    return { success: false, error: "You must be signed in to upload a resume.", code: "UNAUTHENTICATED" };
  }

  /* ── Extract file from FormData ── */
  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "No file was provided.", code: "NO_FILE" };
  }

  const mimeType = file.type;
  const fileName = file.name;
  const fileSize = file.size;

  /* ── Validate ── */
  const validationError = validateFile(mimeType, fileSize);
  if (validationError) {
    return { success: false, error: validationError.message, code: validationError.code };
  }

  const buffer = await file.arrayBuffer();

  /* ── Upload to Storage ── */
  let filePath: string;
  try {
    const uploadResult = await uploadResumeToStorage(user.id, fileName, mimeType, buffer);
    filePath = uploadResult.filePath;
  } catch {
    return {
      success: false,
      error: "Failed to upload file to storage. Please try again.",
      code: "STORAGE_UPLOAD_FAILED",
    };
  }

  /* ── Insert DB row ── */
  const inserted = await insertResume({
    user_id: user.id,
    file_name: fileName,
    file_path: filePath,
    file_size: fileSize,
    file_type: mimeType,
    analysis_status: "uploaded",
    uploaded_at: new Date().toISOString(),
  });

  if (!inserted) {
    return { success: false, error: "Failed to create resume record.", code: "DB_INSERT_FAILED" };
  }

  const resumeId = inserted.id;

  /* ── Extract text ── */
  await updateResumeStatus(resumeId, "extracting");

  let extractedText: string;
  try {
    extractedText = await extractText(buffer, mimeType);
  } catch (err) {
    await markResumeFailed(resumeId, `Extraction failed: ${err instanceof Error ? err.message : String(err)}`);
    return {
      success: false,
      error: "Could not extract text from the file. Make sure the file is not password-protected or corrupted.",
      code: "EXTRACTION_FAILED",
    };
  }

  if (!extractedText.trim()) {
    await markResumeFailed(resumeId, "Extracted text is empty.");
    return {
      success: false,
      error: "No text could be extracted from the file. The file may be image-based or empty.",
      code: "EMPTY_EXTRACTION",
    };
  }

  const textHash = sha256(extractedText);

  /* ── Deduplication check ── */
  const existing = await findResumeByHash(textHash, user.id);
  if (existing?.analysis_json) {
    // Copy analysis from existing duplicate without calling Gemini again
    const dupAnalysis = existing.analysis_json as unknown as import("@/types/resume-analysis").ResumeAnalysis;
    await saveAnalysis({
      id: resumeId,
      analysis: dupAnalysis,
      modelUsed: existing.model_used ?? "gemini-2.5-flash",
      analysisVersion: existing.analysis_version ?? "1.0",
      analysisDurationMs: 0, // instant - reused from cache
    });
    await saveExtractedText(resumeId, extractedText, textHash);
    await saveRoadmapFromResumeAnalysis(user.id, resumeId, dupAnalysis);

    revalidatePath("/dashboard/resume");
    revalidatePath("/dashboard/roadmap");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        resumeId,
        analysis: dupAnalysis,
        meta: {
          modelUsed: existing.model_used ?? "gemini-2.5-flash",
          analysisVersion: existing.analysis_version ?? "1.0",
          analysisDurationMs: 0,
          analyzedAt: new Date().toISOString(),
        },
      },
    };
  }

  /* ── Save extracted text + move to analyzing ── */
  await saveExtractedText(resumeId, extractedText, textHash);

  /* ── Gemini analysis ── */
  let geminiResult: Awaited<ReturnType<typeof analyzeResumeWithGemini>>;
  try {
    geminiResult = await analyzeResumeWithGemini(extractedText);
  } catch (err) {
    await markResumeFailed(
      resumeId,
      `Gemini analysis failed: ${err instanceof Error ? err.message : String(err)}`
    );

    const msg = err instanceof Error ? err.message : "Unknown error";
    const isBusy = msg === "HERIZON_AI_BUSY" || msg.includes("503") || msg.toLowerCase().includes("unavailable") || msg.toLowerCase().includes("high demand");
    const isQuota = msg.includes("429") || msg.toLowerCase().includes("quota");
    const isTimeout = msg.toLowerCase().includes("timeout") || msg.toLowerCase().includes("deadline");

    return {
      success: false,
      error: isBusy
        ? "Herizon AI is temporarily busy, try again later!"
        : isQuota
        ? "AI analysis quota exceeded. Please try again later."
        : isTimeout
        ? "AI analysis timed out. Please try again."
        : "AI analysis failed. Please try again.",
      code: isBusy ? "HERIZON_AI_BUSY" : isQuota ? "GEMINI_QUOTA" : isTimeout ? "GEMINI_TIMEOUT" : "GEMINI_FAILED",
    };
  }

  /* ── Save analysis ── */
  try {
    await saveAnalysis({
      id: resumeId,
      analysis: geminiResult.analysis,
      modelUsed: geminiResult.modelUsed,
      analysisVersion: geminiResult.analysisVersion,
      analysisDurationMs: geminiResult.analysisDurationMs,
    });
    await saveRoadmapFromResumeAnalysis(user.id, resumeId, geminiResult.analysis);
  } catch {
    return { success: false, error: "Analysis completed but failed to save. Please try again.", code: "SAVE_FAILED" };
  }

  /* ── Revalidate cache ── */
  revalidatePath("/dashboard/resume");
  revalidatePath("/dashboard/roadmap");
  revalidatePath("/dashboard");

  return {
    success: true,
    data: {
      resumeId,
      analysis: geminiResult.analysis,
      meta: {
        modelUsed: geminiResult.modelUsed,
        analysisVersion: geminiResult.analysisVersion,
        analysisDurationMs: geminiResult.analysisDurationMs,
        analyzedAt: new Date().toISOString(),
      },
    },
  };
}

/* ── reanalyzeResume ─────────────────────────────────────────── */

/**
 * Re-analyzes an existing resume using its stored extracted text.
 * Skips the upload and extraction steps.
 */
export async function reanalyzeResume(
  resumeId: string
): Promise<ResumeActionResult<ProcessResumeResult>> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: "You must be signed in.", code: "UNAUTHENTICATED" };
  }

  const resume = await getResumeById(resumeId);
  if (!resume) {
    return { success: false, error: "Resume not found.", code: "NOT_FOUND" };
  }

  if (!resume.extracted_text) {
    return {
      success: false,
      error: "No extracted text found. Please upload the file again.",
      code: "NO_TEXT",
    };
  }

  await updateResumeStatus(resumeId, "analyzing");

  let geminiResult: Awaited<ReturnType<typeof analyzeResumeWithGemini>>;
  try {
    geminiResult = await analyzeResumeWithGemini(resume.extracted_text);
  } catch (err) {
    await markResumeFailed(
      resumeId,
      `Re-analysis failed: ${err instanceof Error ? err.message : String(err)}`
    );
    return {
      success: false,
      error: "AI re-analysis failed. Please try again.",
      code: "GEMINI_FAILED",
    };
  }

  await saveAnalysis({
    id: resumeId,
    analysis: geminiResult.analysis,
    modelUsed: geminiResult.modelUsed,
    analysisVersion: geminiResult.analysisVersion,
    analysisDurationMs: geminiResult.analysisDurationMs,
  });
  await saveRoadmapFromResumeAnalysis(user.id, resumeId, geminiResult.analysis);

  revalidatePath("/dashboard/resume");
  revalidatePath("/dashboard/roadmap");
  revalidatePath("/dashboard");

  return {
    success: true,
    data: {
      resumeId,
      analysis: geminiResult.analysis,
      meta: {
        modelUsed: geminiResult.modelUsed,
        analysisVersion: geminiResult.analysisVersion,
        analysisDurationMs: geminiResult.analysisDurationMs,
        analyzedAt: new Date().toISOString(),
      },
    },
  };
}

/* ── fetchUserResumes ────────────────────────────────────────── */

export async function fetchUserResumes(): Promise<ResumeActionResult<Resume[]>> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const resumes = await getUserResumes();
  return { success: true, data: resumes };
}

/* ── fetchLatestAnalysis ─────────────────────────────────────── */

export async function fetchLatestAnalysis(): Promise<
  ResumeActionResult<Resume | null>
> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const resume = await getLatestAnalyzedResume();
  return { success: true, data: resume };
}

/**
 * Clear all resumes for the current user.
 */
export async function clearResumesAction(): Promise<ResumeActionResult> {
  const user = await getUser();
  if (!user) return { success: false, error: "Not authenticated." };

  const cleared = await clearAllUserResumes(user.id);
  if (!cleared) {
    return { success: false, error: "Failed to clear resumes." };
  }

  revalidatePath("/dashboard/resume");
  return { success: true, data: undefined };
}
