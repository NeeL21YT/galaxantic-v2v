/**
 * components/resume/ResumeDropzone.tsx
 *
 * Drag-and-drop file upload zone using react-dropzone.
 * Validates file type (PDF/DOCX) and size (max 10MB) on the client
 * before the file is submitted to the server action.
 */

"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export type DropzoneError =
  | "UNSUPPORTED_TYPE"
  | "FILE_TOO_LARGE"
  | "MULTIPLE_FILES";

interface ResumeDropzoneProps {
  onFile: (file: File) => void;
  onError: (error: DropzoneError, message: string) => void;
  disabled?: boolean;
  selectedFile?: File | null;
  onClear?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ResumeDropzone({
  onFile,
  onError,
  disabled = false,
  selectedFile,
  onClear,
}: ResumeDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[], rejected: import("react-dropzone").FileRejection[]) => {
      if (rejected.length > 0) {
        const err = rejected[0].errors[0];
        if (err.code === "file-too-large") {
          onError("FILE_TOO_LARGE", `File exceeds the 4 MB limit (${formatBytes(rejected[0].file.size)}).`);
        } else if (err.code === "file-invalid-type") {
          onError("UNSUPPORTED_TYPE", "Only PDF and DOCX files are supported.");
        } else if (err.code === "too-many-files") {
          onError("MULTIPLE_FILES", "Please upload one file at a time.");
        }
        return;
      }
      if (accepted.length > 0) {
        onFile(accepted[0]);
      }
    },
    [onFile, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    maxFiles: 1,
    disabled,
    noClick: !!selectedFile, // disable click when file is selected
  });

  return (
    <div>
      <AnimatePresence mode="wait">
        {selectedFile ? (
          /* ── File preview ─── */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="rounded-2xl border-2 flex items-center justify-between gap-4 p-5"
            style={{
              borderColor: "var(--color-rose-gold)",
              background: "rgba(180,108,114,0.04)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
                >
                  {selectedFile.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {formatBytes(selectedFile.size)} ·{" "}
                  {selectedFile.type === "application/pdf" ? "PDF" : "DOCX"}
                </p>
              </div>
            </div>

            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                aria-label="Remove file"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ) : (
          /* ── Drop zone ─── */
        <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 py-14 px-6 cursor-pointer transition-all duration-200"
              style={{
                borderColor: isDragReject
                  ? "#dc2626"
                  : isDragActive
                  ? "var(--color-rose-gold)"
                  : "var(--color-border)",
                background: isDragReject
                  ? "rgba(220,38,38,0.03)"
                  : isDragActive
                  ? "rgba(180,108,114,0.05)"
                  : "var(--color-surface)",
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? "none" : "auto",
              }}
              role="region"
              aria-label="Resume file drop zone"
            >
              <input {...getInputProps()} />

              <motion.div
                animate={{ scale: isDragActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: isDragReject
                    ? "rgba(220,38,38,0.10)"
                    : "rgba(180,108,114,0.10)",
                  color: isDragReject ? "#dc2626" : "var(--color-rose-gold)",
                }}
                aria-hidden="true"
              >
                <Upload className="w-7 h-7" />
              </motion.div>

              <div className="text-center">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
                >
                  {isDragReject
                    ? "Unsupported file type"
                    : isDragActive
                    ? "Drop to upload"
                    : "Drag & drop your resume here"}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                  PDF or DOCX · Max 4 MB
                </p>
              </div>

              <Button variant="outline" size="sm" disabled={disabled}>
                Browse Files
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
