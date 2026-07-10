/**
 * components/resume/ResumePageClient.tsx
 *
 * Client shell for the resume page.
 * Orchestrates the upload flow, shows progress,
 * and renders the AI analysis dashboard on success.
 *
 * Receives existing resume data from the server component as props.
 */

"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Target,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { ResumeDropzone } from "@/components/resume/ResumeDropzone";
import { UploadProgress, type ProgressStep } from "@/components/resume/UploadProgress";
import { AnalysisDashboard } from "@/components/resume/AnalysisDashboard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { processResume, reanalyzeResume, clearResumesAction } from "@/app/dashboard/resume/actions";
import type { Resume } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-analysis";

/* ── Types ──────────────────────────────────────────────── */

interface ActiveAnalysis {
  resumeId: string;
  analysis: ResumeAnalysis;
  fileName: string;
  analyzedAt: string;
  durationMs: number;
}

/* ── Status badge ───────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    completed: { label: "Analysed", color: "#16a34a", bg: "rgba(22,163,74,0.10)", icon: <CheckCircle2 className="w-3 h-3" /> },
    analyzed: { label: "Analysed", color: "#16a34a", bg: "rgba(22,163,74,0.10)", icon: <CheckCircle2 className="w-3 h-3" /> },
    failed: { label: "Failed", color: "#dc2626", bg: "rgba(220,38,38,0.10)", icon: <XCircle className="w-3 h-3" /> },
    uploading: { label: "Uploading", color: "var(--color-rackley)", bg: "rgba(94,123,155,0.10)", icon: <Clock className="w-3 h-3" /> },
    uploaded: { label: "Uploaded", color: "var(--color-rackley)", bg: "rgba(94,123,155,0.10)", icon: <Clock className="w-3 h-3" /> },
    extracting: { label: "Extracting", color: "var(--color-rose-gold)", bg: "rgba(180,108,114,0.10)", icon: <Clock className="w-3 h-3" /> },
    analyzing: { label: "Analysing", color: "var(--color-rose-gold)", bg: "rgba(180,108,114,0.10)", icon: <Sparkles className="w-3 h-3" /> },
  };
  const cfg = map[status] ?? { label: status, color: "var(--color-text-muted)", bg: "var(--color-border-light)", icon: null };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

/* ── Resume list item ───────────────────────────────────── */

function ResumeListItem({
  resume,
  onReanalyze,
  isReanalyzing,
}: {
  resume: Resume;
  onReanalyze?: (id: string) => void;
  isReanalyzing?: boolean;
}) {
  const isAnalyzed = resume.analysis_status === "completed" || resume.analysis_status === "analyzed";
  const uploadedDate = resume.uploaded_at
    ? new Date(resume.uploaded_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <div
      className="flex items-center justify-between gap-3 py-3 border-b last:border-0"
      style={{ borderColor: "var(--color-border-light)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p
            className="text-xs font-semibold truncate"
            style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
          >
            {resume.file_name ?? "Untitled"}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              {uploadedDate}
            </span>
            {resume.resume_score !== null && (
              <span className="text-[10px] font-semibold" style={{ color: "var(--color-rose-gold)" }}>
                Score: {resume.resume_score}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* If we have a score the analysis completed - show Analysed regardless of DB status */}
        <StatusBadge status={resume.resume_score !== null ? "completed" : resume.analysis_status} />
        {(resume.resume_score !== null || isAnalyzed) && onReanalyze && (
          <button
            type="button"
            onClick={() => onReanalyze(resume.id)}
            disabled={isReanalyzing}
            className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-lg transition-colors hover:bg-surface-hover"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={`Re-analyse ${resume.file_name}`}
          >
            <RefreshCw className={`w-3 h-3 ${isReanalyzing ? "animate-spin" : ""}`} />
            Re-analyse
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Error banner ────────────────────────────────────────── */

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl p-4 flex items-start justify-between gap-3"
      style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.20)" }}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#dc2626" }} />
        <p className="text-xs leading-relaxed" style={{ color: "#dc2626" }}>
          {message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-xs font-medium flex-shrink-0"
        style={{ color: "#dc2626" }}
        aria-label="Dismiss error"
      >
        Dismiss
      </button>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────── */

interface ResumePageClientProps {
  initialResumes: Resume[];
  initialAnalysis: ActiveAnalysis | null;
}

/** Simulated progress steps fired while the server action runs */
const PROGRESS_TIMELINE: { step: ProgressStep; delayMs: number }[] = [
  { step: "uploading", delayMs: 0 },
  { step: "extracting", delayMs: 3000 },
  { step: "analyzing", delayMs: 8000 },
];

export function ResumePageClient({
  initialResumes,
  initialAnalysis,
}: ResumePageClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isClearing, startClearing] = useTransition();
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [activeAnalysis, setActiveAnalysis] = useState<ActiveAnalysis | null>(initialAnalysis);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progressStep, setProgressStep] = useState<ProgressStep>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ── Progress simulation ── */
  function startProgressSimulation() {
    PROGRESS_TIMELINE.forEach(({ step, delayMs }) => {
      setTimeout(() => setProgressStep(step), delayMs);
    });
  }

  /* ── Handle file chosen ── */
  function handleFile(file: File) {
    setSelectedFile(file);
    setErrorMsg(null);
  }

  /* ── Submit for processing ── */
  function handleSubmit() {
    if (!selectedFile) return;
    setErrorMsg(null);
    startProgressSimulation();

    const formData = new FormData();
    formData.append("file", selectedFile);

    startTransition(async () => {
      const result = await processResume(formData);

      if (!result.success) {
        setProgressStep("idle");
        setSelectedFile(null);
        setErrorMsg(result.error);
        return;
      }

      setProgressStep("completed");

      const newAnalysis: ActiveAnalysis = {
        resumeId: result.data.resumeId,
        analysis: result.data.analysis,
        fileName: selectedFile.name,
        analyzedAt: result.data.meta.analyzedAt,
        durationMs: result.data.meta.analysisDurationMs,
      };

      setActiveAnalysis(newAnalysis);

      // Prepend and keep only the 5 most recent
      setResumes((prev) =>
        [
          {
            id: result.data.resumeId,
            user_id: "",
            file_name: selectedFile.name,
            file_path: null,
            file_size: selectedFile.size,
            file_type: selectedFile.type,
            analysis_status: "completed" as import("@/types/database").AnalysisStatus,
            resume_score: result.data.analysis.resumeScore,
            ats_score: result.data.analysis.atsScore,
            career_readiness: result.data.analysis.careerReadiness,
            extracted_text: null,
            text_hash: null,
            analysis_json: null,
            model_used: result.data.meta.modelUsed,
            analysis_version: result.data.meta.analysisVersion,
            analysis_duration_ms: result.data.meta.analysisDurationMs,
            analyzed_at: result.data.meta.analyzedAt,
            uploaded_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 5)
      );

      // Reset upload UI after a beat
      setTimeout(() => {
        setSelectedFile(null);
        setProgressStep("idle");
      }, 1500);
    });
  }

  /* ── Clear all resumes ── */
  function confirmClearAll() {
    setIsConfirmOpen(true);
  }

  function handleClearAll() {
    setIsConfirmOpen(false);
    startClearing(async () => {
      const result = await clearResumesAction();
      if (result.success) {
        setResumes([]);
        setActiveAnalysis(null);
      } else {
        setErrorMsg(result.error || "Failed to clear resumes.");
      }
    });
  }

  /* ── Re-analyse existing ── */
  async function handleReanalyze(resumeId: string) {
    const resume = resumes.find((r) => r.id === resumeId);
    if (!resume) return;

    setIsReanalyzing(true);
    setErrorMsg(null);
    setProgressStep("analyzing");

    const result = await reanalyzeResume(resumeId);
    setIsReanalyzing(false);
    setProgressStep("idle");

    if (!result.success) {
      setErrorMsg(result.error);
      return;
    }

    setActiveAnalysis({
      resumeId,
      analysis: result.data.analysis,
      fileName: resume.file_name ?? "Resume",
      analyzedAt: result.data.meta.analyzedAt,
      durationMs: result.data.meta.analysisDurationMs,
    });

    setResumes((prev) =>
      prev.map((r) =>
        r.id === resumeId
          ? { ...r, resume_score: result.data.analysis.resumeScore, analysis_status: "completed" }
          : r
      )
    );
  }

  const isProcessing = isPending || progressStep !== "idle";

  return (
    <>
      <PageHeader
        title="Resume"
        subtitle="Upload your resume for instant AI scoring and personalised insights."
        action={
          !isProcessing && selectedFile ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              loading={isPending}
              leftIcon={<Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Analyse with AI
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-5">
        {/* ── Error banner ── */}
        <AnimatePresence>
          {errorMsg && (
            <ErrorBanner message={errorMsg} onDismiss={() => setErrorMsg(null)} />
          )}
        </AnimatePresence>

        {/* ── Upload + list ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Progress (shown while processing) */}
            <AnimatePresence>
              {isProcessing && progressStep !== "idle" && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <UploadProgress currentStep={progressStep} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dropzone (hidden while processing) */}
            {!isProcessing && (
              <ResumeDropzone
                onFile={handleFile}
                onError={(_, msg) => setErrorMsg(msg)}
                disabled={isProcessing}
                selectedFile={selectedFile}
                onClear={() => setSelectedFile(null)}
              />
            )}

            {/* Analyse button (mobile/tablet - below dropzone) */}
            {!isProcessing && selectedFile && (
              <div className="lg:hidden">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSubmit}
                  loading={isPending}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  Analyse with AI
                </Button>
              </div>
            )}

            {/* Resume history */}
            <DashboardCard
              title="Your Resumes"
              subtitle="Recent 5 Uploads"
              headerAction={
                resumes.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={confirmClearAll}
                    disabled={isClearing}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    leftIcon={<Trash2 className={`w-4 h-4 ${isClearing ? "animate-pulse" : ""}`} />}
                  >
                    {isClearing ? "Clearing..." : "Clear all"}
                  </Button>
                )
              }
            >
              {resumes.length === 0 ? (
                <p className="text-xs py-4 text-center" style={{ color: "var(--color-text-muted)" }}>
                  No resumes uploaded yet. Drop a file above to get started.
                </p>
              ) : (
                <div className="mt-2">
                  {resumes.map((r) => (
                    <ResumeListItem
                      key={r.id}
                      resume={r}
                      onReanalyze={handleReanalyze}
                      isReanalyzing={isReanalyzing}
                    />
                  ))}
                </div>
              )}
            </DashboardCard>
          </div>

          {/* ── Score summary sidebar ── */}
          <div className="flex flex-col gap-5">
            {activeAnalysis ? (
              <DashboardCard
                title="Latest Scores"
                subtitle={activeAnalysis.fileName}
              >
                <div className="flex flex-col items-center gap-5 py-4">
                  {(
                    [
                      { score: activeAnalysis.analysis.resumeScore,   label: "Resume Score",     Icon: FileText   },
                      { score: activeAnalysis.analysis.atsScore,       label: "ATS Score",         Icon: Target     },
                      { score: activeAnalysis.analysis.careerReadiness,label: "Career Readiness", Icon: TrendingUp },
                    ] as const
                  ).map(({ score, label, Icon }) => {
                    const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
                    const circumference = 2 * Math.PI * 22;
                    return (
                      <div key={label} className="flex items-center gap-3 w-full">
                        {/* Ring + centered icon */}
                        <div className="relative flex-shrink-0" style={{ width: 56, height: 56 }}>
                          <svg width="56" height="56" viewBox="0 0 56 56" aria-label={`${label}: ${score}`}>
                            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-border)" strokeWidth="5" />
                            <circle
                              cx="28" cy="28" r="22"
                              fill="none"
                              stroke={color}
                              strokeWidth="5"
                              strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
                              strokeLinecap="round"
                              transform="rotate(-90 28 28)"
                            />
                          </svg>
                          {/* Icon centered inside the ring */}
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-bold leading-none" style={{ fontFamily: "var(--font-heading)", color }}>
                            {score}
                            <span className="text-xs font-normal ml-0.5" style={{ color: "var(--color-text-muted)" }}>/100</span>
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DashboardCard>
            ) : (
              <DashboardCard title="Resume Score" subtitle="Upload a resume to see your score">
                <div className="flex flex-col items-center py-8 gap-2">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(180,108,114,0.08)", color: "var(--color-rose-gold)" }}
                  >
                    <Sparkles className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-center mt-2" style={{ color: "var(--color-text-muted)" }}>
                    Upload your resume to get an AI score, ATS rating, and personalised roadmap.
                  </p>
                </div>
              </DashboardCard>
            )}
          </div>
        </div>

        {/* ── Full AI Analysis Dashboard ── */}
        <AnimatePresence>
          {activeAnalysis && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnalysisDashboard
                analysis={activeAnalysis.analysis}
                fileName={activeAnalysis.fileName}
                analyzedAt={activeAnalysis.analyzedAt}
                durationMs={activeAnalysis.durationMs}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Custom Confirmation Modal ── */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full border border-red-100"
            >
              <h3 className="text-lg font-semibold text-red-600 mb-2">Clear all resumes?</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to clear all your uploaded resumes and analyses? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                  onClick={handleClearAll}
                >
                  Yes, Clear All
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
