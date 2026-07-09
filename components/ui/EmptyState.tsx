/**
 * components/ui/EmptyState.tsx
 *
 * Empty state component for zero-result views, onboarding, and errors.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────────── */

interface EmptyStateProps {
  /** Icon or illustration */
  icon?: ReactNode;
  /** Main heading */
  title: string;
  /** Supporting description */
  description?: string;
  /** Primary action button/element */
  action?: ReactNode;
  /** Secondary action */
  secondaryAction?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Compact variant for inline usage */
  compact?: boolean;
}

/* ── Component ─────────────────────────────────────────────── */

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4 gap-3" : "py-16 px-6 gap-5",
        className
      )}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl",
            compact ? "w-12 h-12" : "w-16 h-16"
          )}
          style={{
            background: "var(--color-champagne)",
            color: "var(--color-rose-gold)",
          }}
        >
          <span className={compact ? "w-6 h-6" : "w-8 h-8"}>{icon}</span>
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-sm">
        <h3
          className={cn(
            "font-semibold",
            compact ? "text-base" : "text-xl"
          )}
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-puce-red)",
          }}
        >
          {title}
        </h3>

        {description && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
