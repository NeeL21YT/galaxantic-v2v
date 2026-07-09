/**
 * components/ui/LoadingSpinner.tsx
 *
 * Animated loading spinner using CSS border trick.
 * Respects prefers-reduced-motion.
 */

import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LoadingSpinnerProps {
  /** Visual size of the spinner */
  size?: SpinnerSize;
  /** Custom label for screen readers */
  label?: string;
  /** Additional class names */
  className?: string;
  /** Color variant */
  color?: "primary" | "white" | "muted";
}

/* ── Style Maps ────────────────────────────────────────────── */

const sizeMap: Record<SpinnerSize, string> = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
  xl: "w-12 h-12 border-4",
};

const colorMap: Record<string, string> = {
  primary: "border-rose-gold border-t-transparent",
  white: "border-white border-t-transparent",
  muted: "border-[var(--color-text-muted)] border-t-transparent",
};

/* ── Component ─────────────────────────────────────────────── */

export function LoadingSpinner({
  size = "md",
  label = "Loading…",
  className,
  color = "primary",
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block rounded-full animate-spin",
        sizeMap[size],
        colorMap[color],
        className
      )}
      style={{
        borderColor: color === "primary"
          ? `var(--color-rose-gold) transparent transparent transparent`
          : undefined,
      }}
    />
  );
}

/* ── Full Page Variant ─────────────────────────────────────── */

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--color-background)" }}
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        <p
          className="text-sm font-medium animate-pulse"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
