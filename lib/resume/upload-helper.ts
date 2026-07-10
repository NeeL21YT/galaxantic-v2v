/**
 * lib/resume/upload-helper.ts
 *
 * Handles uploading resume files to the Supabase `resumes` Storage bucket.
 * Storage path convention: {userId}/{timestamp}_{sanitizedFilename}
 *
 * Server-side only.
 */

import { createClient } from "@/lib/supabase/server";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export interface UploadValidationError {
  code: "UNSUPPORTED_TYPE" | "FILE_TOO_LARGE";
  message: string;
}

/**
 * Validates a file before upload.
 * Returns an error object if invalid, null if valid.
 */
export function validateFile(
  mimeType: string,
  sizeBytes: number
): UploadValidationError | null {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      code: "UNSUPPORTED_TYPE",
      message: "Only PDF and DOCX files are supported.",
    };
  }
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      code: "FILE_TOO_LARGE",
      message: `File exceeds the 4 MB limit (received ${(sizeBytes / 1024 / 1024).toFixed(1)} MB).`,
    };
  }
  return null;
}

/**
 * Sanitizes a filename so it is safe to use as a Storage path segment.
 * Replaces spaces and special chars with underscores; preserves extension.
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .replace(/_+/g, "_");
}

export interface UploadResult {
  filePath: string;
  publicUrl: string | null;
}

/**
 * Uploads a file buffer to Supabase Storage and returns the storage path.
 *
 * @param userId      Authenticated user's UID (used as the first folder segment)
 * @param fileName    Original file name (sanitized internally)
 * @param mimeType    MIME type of the file
 * @param buffer      Raw file bytes
 */
export async function uploadResumeToStorage(
  userId: string,
  fileName: string,
  mimeType: string,
  buffer: ArrayBuffer
): Promise<UploadResult> {
  const supabase = await createClient();

  const sanitized = sanitizeFilename(fileName);
  const filePath = `${userId}/${Date.now()}_${sanitized}`;

  const { error } = await supabase.storage
    .from("resumes")
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    console.error("[upload-helper] Storage upload failed:", error.message);
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return { filePath, publicUrl: null }; // bucket is private; no public URL
}
