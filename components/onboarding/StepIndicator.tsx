/**
 * components/onboarding/StepIndicator.tsx
 *
 * Visual step progress indicator for the onboarding wizard.
 * Shows step number, label, and completion state.
 */

"use client";

import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 1-indexed
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center justify-start sm:justify-center gap-0 min-w-max mx-auto" aria-label="Onboarding progress">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-300 flex-shrink-0"
                  style={{
                    background: isCompleted
                      ? "var(--color-rose-gold)"
                      : isCurrent
                      ? "var(--color-puce-red)"
                      : "var(--color-champagne)",
                    color: isCompleted || isCurrent ? "#fff" : "var(--color-text-muted)",
                    border: isCurrent
                      ? "2px solid var(--color-puce-red)"
                      : isCompleted
                      ? "none"
                      : "1.5px solid var(--color-border)",
                    boxShadow: isCurrent ? "0 0 0 3px rgba(110,46,52,0.12)" : "none",
                  }}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                  ) : (
                    step.number
                  )}
                </div>
                {/* Label - hidden on small screens */}
                <span
                  className="hidden sm:block text-[10px] font-medium whitespace-nowrap"
                  style={{
                    color: isCurrent
                      ? "var(--color-puce-red)"
                      : isCompleted
                      ? "var(--color-rose-gold)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className="h-0.5 w-4 sm:w-12 mx-1 sm:mx-1 transition-all duration-300 flex-shrink-0 sm:mb-4"
                  style={{
                    background:
                      step.number < currentStep
                        ? "var(--color-rose-gold)"
                        : "var(--color-border)",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
