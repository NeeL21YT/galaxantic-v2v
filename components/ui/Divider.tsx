/**
 * components/ui/Divider.tsx
 *
 * A simple horizontal or vertical rule for visual separation.
 */

import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

interface DividerProps {
  /** Orientation of the divider */
  orientation?: "horizontal" | "vertical";
  /** Optional label centered on the divider */
  label?: string;
  /** Additional class names */
  className?: string;
}

/* ── Component ─────────────────────────────────────────────── */

export function Divider({
  orientation = "horizontal",
  label,
  className,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-px self-stretch", className)}
        style={{ background: "var(--color-border)" }}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn("flex items-center gap-4", className)}
      >
        <div
          className="flex-1 h-px"
          style={{ background: "var(--color-border)" }}
        />
        <span
          className="text-xs font-medium whitespace-nowrap px-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "var(--color-border)" }}
        />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={cn("divider", className)}
    />
  );
}
