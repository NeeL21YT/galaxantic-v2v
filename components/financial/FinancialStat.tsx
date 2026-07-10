/**
 * components/financial/FinancialStat.tsx
 *
 * Small stat card for AI Analysis step (Step 4).
 * Displays a label, value, and optional visual rating bar.
 */

import type { ReactNode } from "react";

interface FinancialStatProps {
  label: string;
  value: string;
  rating?: number; // 0-100, shows a bar
  color?: string;
  icon?: ReactNode;
}

export function FinancialStat({
  label,
  value,
  rating,
  color = "var(--color-rose-gold)",
  icon,
}: FinancialStatProps) {
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, color }}
          >
            {icon}
          </div>
        )}
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
      </div>

      <p
        className="text-2xl font-bold"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-puce-red)",
        }}
      >
        {value}
      </p>

      {rating !== undefined && (
        <div className="flex flex-col gap-1.5">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "var(--color-border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${rating}%`, background: color }}
            />
          </div>
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {rating}/100
          </span>
        </div>
      )}
    </div>
  );
}
