/**
 * components/resume/UploadProgress.tsx
 *
 * Animated 4-step progress indicator shown during resume processing.
 * Steps: Upload → Extract → Analyze → Complete
 *
 * The progress simulation advances automatically while the server action runs.
 */

"use client";

import { motion } from "framer-motion";
import { Upload, FileSearch, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export type ProgressStep = "idle" | "uploading" | "extracting" | "analyzing" | "completed";

interface Step {
  id: ProgressStep;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    id: "uploading",
    label: "Uploading",
    description: "Storing your resume securely",
    icon: <Upload className="w-4 h-4" />,
  },
  {
    id: "extracting",
    label: "Extracting",
    description: "Reading text from your file",
    icon: <FileSearch className="w-4 h-4" />,
  },
  {
    id: "analyzing",
    label: "Analysing",
    description: "AI reviewing your resume",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: "completed",
    label: "Complete",
    description: "Your analysis is ready",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
];

const STEP_ORDER: ProgressStep[] = ["uploading", "extracting", "analyzing", "completed"];

function stepIndex(step: ProgressStep): number {
  return STEP_ORDER.indexOf(step);
}

interface UploadProgressProps {
  currentStep: ProgressStep;
}

export function UploadProgress({ currentStep }: UploadProgressProps) {
  const currentIndex = stepIndex(currentStep);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-2 mb-6">
        <motion.div
          animate={{ rotate: currentStep === "completed" ? 0 : 360 }}
          transition={
            currentStep === "completed"
              ? { duration: 0 }
              : { duration: 1.5, repeat: Infinity, ease: "linear" }
          }
        >
          {currentStep === "completed" ? (
            <CheckCircle2 className="w-5 h-5" style={{ color: "#16a34a" }} />
          ) : (
            <Loader2 className="w-5 h-5" style={{ color: "var(--color-rose-gold)" }} />
          )}
        </motion.div>
        <h3
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
        >
          {currentStep === "completed" ? "Analysis Complete!" : "Processing your resume…"}
        </h3>
      </div>

      {/* Steps */}
      <div className="flex items-start gap-0">
        {STEPS.map((step, idx) => {
          const isCompleted = stepIndex(step.id) < currentIndex;
          const isActive = step.id === currentStep;
          const isPending = stepIndex(step.id) > currentIndex;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              {/* Connector line */}
              <div className="w-full flex items-center">
                {idx > 0 && (
                  <div
                    className="flex-1 h-0.5 transition-all duration-500"
                    style={{
                      background: isCompleted || isActive
                        ? "var(--color-rose-gold)"
                        : "var(--color-border)",
                    }}
                  />
                )}

                {/* Circle */}
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isCompleted
                      ? "#16a34a"
                      : isActive
                      ? "var(--color-rose-gold)"
                      : "var(--color-border-light)",
                    color: isCompleted || isActive ? "#fff" : "var(--color-text-muted)",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(180,108,114,0.25)"
                      : "none",
                  }}
                  animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={isActive ? { duration: 1, repeat: Infinity } : {}}
                >
                  {step.icon}
                </motion.div>

                {idx < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-0.5 transition-all duration-500"
                    style={{
                      background:
                        stepIndex(step.id) < currentIndex - 1
                          ? "var(--color-rose-gold)"
                          : "var(--color-border)",
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center px-1">
                <p
                  className="text-xs font-semibold"
                  style={{
                    color: isCompleted || isActive
                      ? "var(--color-puce-red)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {step.label}
                </p>
                {isActive && (
                  <motion.p
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--color-text-muted)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {step.description}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI notice */}
      {currentStep === "analyzing" && (
        <motion.p
          className="mt-5 text-center text-xs"
          style={{ color: "var(--color-text-muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Herizon AI is reviewing your resume — this usually takes 10–30 seconds.
        </motion.p>
      )}
    </div>
  );
}
