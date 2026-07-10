/**
 * components/financial/BudgetCard.tsx
 *
 * Card displaying a budget category with progress circle and amounts.
 */

import { ProgressCircle } from "./ProgressCircle";
import type { BudgetAllocation } from "@/types/dashboard";

interface BudgetCardProps {
  allocation: BudgetAllocation;
  monthlyIncome?: number;
}

export function BudgetCard({ allocation }: BudgetCardProps) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Progress circle */}
      <ProgressCircle
        percent={allocation.percent}
        color={allocation.color}
        size={72}
        strokeWidth={7}
        label={`${allocation.label}: ${allocation.percent}%`}
      />

      {/* Info */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p
          className="text-sm font-bold"
          style={{ color: "var(--color-puce-red)" }}
        >
          {allocation.label}
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {allocation.description}
        </p>
        <p
          className="text-base font-bold mt-1"
          style={{ color: allocation.color }}
        >
          {allocation.amount}
          <span
            className="text-xs font-normal ml-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            / month
          </span>
        </p>
      </div>
    </div>
  );
}
