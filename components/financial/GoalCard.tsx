/**
 * components/financial/GoalCard.tsx
 *
 * Selectable goal card for Step 2 of Financial Compass.
 */

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GoalCardProps {
  id: string;
  icon: ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  index?: number;
}

export function GoalCard({
  id,
  icon,
  label,
  description,
  selected,
  onClick,
  index = 0,
}: GoalCardProps) {
  return (
    <motion.button
      type="button"
      id={`goal-card-${id}`}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-center gap-3 p-5 rounded-2xl text-center cursor-pointer",
        "transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 w-full"
      )}
      style={{
        background: selected ? "var(--color-champagne)" : "var(--color-surface)",
        border: selected
          ? "2px solid var(--color-rose-gold)"
          : "1.5px solid var(--color-border)",
        boxShadow: selected ? "var(--shadow-card-hover)" : "var(--shadow-card)",
      }}
    >
      {/* Selected badge */}
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "var(--color-rose-gold)" }}
        >
          <Check className="w-3 h-3 text-white" aria-hidden="true" />
        </motion.span>
      )}

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{
          background: selected ? "rgba(180,108,114,0.15)" : "var(--color-surface-hover)",
          color: selected ? "var(--color-rose-gold)" : "var(--color-text-muted)",
          border: selected ? "1px solid rgba(180,108,114,0.25)" : "1px solid var(--color-border-light)",
        }}
        aria-label={label}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className="text-sm font-bold leading-tight"
        style={{ color: "var(--color-puce-red)" }}
      >
        {label}
      </span>

      {/* Description */}
      <span
        className="text-xs leading-snug"
        style={{ color: "var(--color-text-muted)" }}
      >
        {description}
      </span>
    </motion.button>
  );
}
