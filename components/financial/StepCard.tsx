/**
 * components/financial/StepCard.tsx
 *
 * Card shell wrapping each wizard step's content.
 */

import type { ReactNode } from "react";

interface StepCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function StepCard({ title, subtitle, icon, children }: StepCardProps) {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 flex flex-col gap-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex flex-col gap-1">
        <h2
          className="text-xl font-bold flex items-center gap-2"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-puce-red)",
          }}
        >
          {icon && (
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(180,108,114,0.12)", color: "var(--color-rose-gold)" }}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
