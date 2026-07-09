/**
 * components/dashboard/DashboardCard.tsx
 *
 * Generic content card — used for sections on the dashboard home
 * and as a wrapper in feature pages.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Optional header action (e.g. "View all" link) */
  headerAction?: ReactNode;
  /** Remove default padding */
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  subtitle,
  children,
  className,
  headerAction,
  noPadding = false,
}: DashboardCardProps) {
  return (
    <div
      className={cn("rounded-2xl overflow-hidden", className)}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {(title || headerAction) && (
        <div
          className="flex items-start justify-between px-5 pt-5 pb-0"
          style={{ borderBottom: subtitle ? "none" : "none" }}
        >
          <div>
            {title && (
              <h3
                className="text-sm font-semibold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-puce-red)",
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5 pt-4"}>{children}</div>
    </div>
  );
}
