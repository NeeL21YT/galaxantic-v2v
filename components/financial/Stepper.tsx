/**
 * components/financial/Stepper.tsx
 *
 * Multi-step progress indicator for Financial Compass.
 * Shows steps as dots with connecting lines.
 * Horizontal on desktop, vertical on mobile.
 */

"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-indexed
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div
      className="w-full"
      role="navigation"
      aria-label="Financial Compass steps"
    >
      {/* Progress bar */}
      <div
        className="relative h-1.5 rounded-full mb-6 overflow-hidden"
        style={{ background: "var(--color-border)" }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            background:
              "linear-gradient(90deg, var(--color-puce-red), var(--color-rose-gold))",
          }}
        />
      </div>

      {/* Step indicators - horizontal scroll on mobile */}
      <div
        className="flex items-start gap-0 overflow-x-auto pb-2 md:pb-0"
        style={{ scrollbarWidth: "none" }}
      >
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isUpcoming = stepNum > currentStep;

          return (
            <div
              key={label}
              className="flex-1 flex flex-col items-center gap-2 min-w-[70px]"
              aria-current={isActive ? "step" : undefined}
            >
              {/* Connector + circle row */}
              <div className="flex items-center w-full">
                {/* Left connector */}
                {i !== 0 && (
                  <div
                    className="flex-1 h-px transition-colors duration-300"
                    style={{
                      background: isCompleted
                        ? "var(--color-rose-gold)"
                        : "var(--color-border)",
                    }}
                  />
                )}

                {/* Step circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300",
                    "border-2"
                  )}
                  style={{
                    background: isCompleted
                      ? "var(--color-rose-gold)"
                      : isActive
                      ? "var(--color-puce-red)"
                      : "var(--color-surface)",
                    borderColor: isCompleted
                      ? "var(--color-rose-gold)"
                      : isActive
                      ? "var(--color-puce-red)"
                      : "var(--color-border)",
                    color: isCompleted || isActive ? "#ffffff" : "var(--color-text-muted)",
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    stepNum
                  )}
                </div>

                {/* Right connector */}
                {i !== steps.length - 1 && (
                  <div
                    className="flex-1 h-px transition-colors duration-300"
                    style={{
                      background:
                        stepNum < currentStep
                          ? "var(--color-rose-gold)"
                          : "var(--color-border)",
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium text-center leading-tight px-1 hidden sm:block"
                )}
                style={{
                  color: isActive
                    ? "var(--color-puce-red)"
                    : isCompleted
                    ? "var(--color-rose-gold)"
                    : "var(--color-text-muted)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
