/**
 * components/herlens/CategoryPill.tsx
 *
 * Animated category filter pill for the HerLens news hub.
 */

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function CategoryPill({ label, active, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2",
        "whitespace-nowrap cursor-pointer"
      )}
      style={{
        color: active ? "#ffffff" : "var(--color-text-secondary)",
        border: active
          ? "1.5px solid var(--color-rose-gold)"
          : "1.5px solid var(--color-border)",
      }}
    >
      {/* Active background pill */}
      {active && (
        <motion.span
          layoutId="category-pill-bg"
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--color-puce-red)" }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          aria-hidden="true"
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
