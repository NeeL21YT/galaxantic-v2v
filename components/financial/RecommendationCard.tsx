/**
 * components/financial/RecommendationCard.tsx
 *
 * Card for Step 6 recommendations.
 */

import type { FinancialRecommendation } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface RecommendationCardProps {
  recommendation: FinancialRecommendation;
}

const priorityStyles = {
  high: { color: "#dc2626", bg: "rgba(220,38,38,0.08)", label: "High Priority" },
  medium: { color: "#d97706", bg: "rgba(217,119,6,0.08)", label: "Medium Priority" },
  low: { color: "#16a34a", bg: "rgba(22,163,74,0.08)", label: "Low Priority" },
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const style = priorityStyles[recommendation.priority];

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-2xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: style.bg, color: style.color }}
        aria-hidden="true"
      >
        {recommendation.icon as ReactNode}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p
            className="text-sm font-bold"
            style={{ color: "var(--color-puce-red)" }}
          >
            {recommendation.title}
          </p>
          <span
            className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0")}
            style={{ background: style.bg, color: style.color }}
          >
            {style.label}
          </span>
        </div>
        <p
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {recommendation.description}
        </p>
      </div>
    </div>
  );
}
