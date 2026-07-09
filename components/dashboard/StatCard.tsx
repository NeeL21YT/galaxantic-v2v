/**
 * components/dashboard/StatCard.tsx
 *
 * A metric card with icon, label, value, and optional trend indicator.
 */

"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  description?: string;
  trend?: Trend;
  trendLabel?: string;
  /** Accent colour variant */
  accent?: "rose" | "blue" | "green" | "amber";
  index?: number;
}

const accentMap = {
  rose: {
    bg: "rgba(180,108,114,0.08)",
    icon: "var(--color-rose-gold)",
    border: "var(--color-border)",
  },
  blue: {
    bg: "rgba(94,123,155,0.08)",
    icon: "var(--color-rackley)",
    border: "rgba(94,123,155,0.2)",
  },
  green: {
    bg: "rgba(34,197,94,0.08)",
    icon: "#16a34a",
    border: "rgba(34,197,94,0.2)",
  },
  amber: {
    bg: "rgba(245,158,11,0.08)",
    icon: "#d97706",
    border: "rgba(245,158,11,0.2)",
  },
};

const trendIcon: Record<Trend, ReactNode> = {
  up: <TrendingUp className="w-3.5 h-3.5" />,
  down: <TrendingDown className="w-3.5 h-3.5" />,
  neutral: <Minus className="w-3.5 h-3.5" />,
};

const trendColor: Record<Trend, string> = {
  up: "#16a34a",
  down: "#dc2626",
  neutral: "var(--color-text-muted)",
};

export function StatCard({
  icon,
  label,
  value,
  description,
  trend,
  trendLabel,
  accent = "rose",
  index = 0,
}: StatCardProps) {
  const colors = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)" }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--color-surface)",
        border: `1px solid ${colors.border}`,
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5"
        style={{ background: colors.bg, color: colors.icon }}
      >
        {icon}
      </div>

      {/* Value */}
      <div>
        <p
          className="text-2xl font-bold leading-none mb-1"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-puce-red)",
          }}
        >
          {value}
        </p>
        <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </p>
      </div>

      {/* Trend */}
      {trend && trendLabel && (
        <div
          className={cn("flex items-center gap-1 text-xs font-medium")}
          style={{ color: trendColor[trend] }}
        >
          {trendIcon[trend]}
          <span>{trendLabel}</span>
        </div>
      )}

      {/* Description */}
      {description && !trend && (
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
