/**
 * components/shared/Logo.tsx
 *
 * Herizon brand logo - wordmark only, no external assets required.
 * Uses SVG text with brand colors.
 */

import { cn } from "@/lib/utils";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────── */

type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  /** Size preset */
  size?: LogoSize;
  /** Light version for dark/colored backgrounds */
  light?: boolean;
  /** Suppress link wrapping */
  noLink?: boolean;
  /** Additional class names */
  className?: string;
}

/* ── Size Map ──────────────────────────────────────────────── */

const sizeMap: Record<LogoSize, { text: string; dot: string }> = {
  sm: { text: "text-lg", dot: "w-1.5 h-1.5" },
  md: { text: "text-2xl", dot: "w-2 h-2" },
  lg: { text: "text-3xl", dot: "w-2.5 h-2.5" },
  xl: { text: "text-4xl", dot: "w-3 h-3" },
};

/* ── Component ─────────────────────────────────────────────── */

function LogoMark({ size = "md", light = false, className }: LogoProps) {
  const styles = sizeMap[size];

  return (
    <span
      className={cn("inline-flex items-center gap-1 select-none", className)}
      aria-label="Herizon"
    >
      {/* Wordmark */}
      <span
        className={cn("font-bold tracking-tight leading-none", styles.text)}
        style={{
          fontFamily: "var(--font-heading)",
          color: light ? "#ffffff" : "var(--color-puce-red)",
        }}
      >
        Her
      </span>
      <span
        className={cn("font-bold tracking-tight leading-none", styles.text)}
        style={{
          fontFamily: "var(--font-heading)",
          color: light ? "rgba(255,255,255,0.75)" : "var(--color-rose-gold)",
        }}
      >
        izon
      </span>

      {/* Accent dot */}
      <span
        className={cn("rounded-full flex-shrink-0 mb-0.5", styles.dot)}
        style={{
          background: light
            ? "rgba(255,255,255,0.8)"
            : "var(--color-rose-gold)",
        }}
        aria-hidden="true"
      />
    </span>
  );
}

export function Logo({ size = "md", light = false, noLink = false, className }: LogoProps) {
  if (noLink) {
    return <LogoMark size={size} light={light} className={className} />;
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-1 no-underline transition-opacity hover:opacity-80",
        className
      )}
      aria-label="Go to Herizon homepage"
    >
      <LogoMark size={size} light={light} />
    </Link>
  );
}
