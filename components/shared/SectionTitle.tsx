/**
 * components/shared/SectionTitle.tsx
 *
 * Reusable section heading with optional eyebrow text and subtitle.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────────── */

interface SectionTitleProps {
  /** Small text above the main heading */
  eyebrow?: string;
  /** Main heading text */
  title: string | ReactNode;
  /** Supporting subtitle below the heading */
  subtitle?: string;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Semantic heading level */
  as?: "h1" | "h2" | "h3";
  /** Additional class names for the wrapper */
  className?: string;
  /** Decorative underline accent */
  accent?: boolean;
}

/* ── Component ─────────────────────────────────────────────── */

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  className,
  accent = false,
}: SectionTitleProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  return (
    <div className={cn("flex flex-col gap-3", alignClass, className)}>
      {eyebrow && (
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-rackley)" }}
        >
          <span
            className="w-5 h-px flex-shrink-0"
            style={{ background: "var(--color-rackley)" }}
            aria-hidden="true"
          />
          {eyebrow}
          <span
            className="w-5 h-px flex-shrink-0"
            style={{ background: "var(--color-rackley)" }}
            aria-hidden="true"
          />
        </span>
      )}

      <Tag
        className={cn(
          "font-bold",
          accent && "relative pb-3"
        )}
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-puce-red)",
        }}
      >
        {title}
        {accent && (
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 rounded-full"
            style={{ background: "var(--color-rose-gold)" }}
            aria-hidden="true"
          />
        )}
      </Tag>

      {subtitle && (
        <p
          className="text-base leading-relaxed max-w-2xl"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
