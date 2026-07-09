/**
 * components/dashboard/SettingsCard.tsx
 *
 * A settings section card with a title, description, and content slot.
 */

import type { ReactNode } from "react";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** Danger zone styling */
  danger?: boolean;
}

export function SettingsCard({ title, description, children, danger = false }: SettingsCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--color-surface)",
        border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : "var(--color-border)"}`,
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{
          borderBottom: "1px solid var(--color-border-light)",
          background: danger ? "rgba(239,68,68,0.03)" : "transparent",
        }}
      >
        <h3
          className="text-sm font-semibold"
          style={{
            fontFamily: "var(--font-heading)",
            color: danger ? "#dc2626" : "var(--color-puce-red)",
          }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
