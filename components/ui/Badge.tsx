/**
 * components/ui/Badge.tsx
 *
 * Small label/tag component for status indicators and categories.
 */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────────── */

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "info"
  | "muted";

interface BadgeProps {
  /** Text label or content */
  label?: string;
  /** Alternative to label for JSX content */
  children?: ReactNode;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Optional leading icon */
  icon?: ReactNode;
  /** Additional class names */
  className?: string;
}

/* ── Style Maps ────────────────────────────────────────────── */

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-champagne text-puce-red border border-[rgba(110,46,52,0.15)]",
  primary:
    "bg-rose-gold text-white",
  secondary:
    "bg-rackley text-white",
  success:
    "bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]",
  warning:
    "bg-[#fef9c3] text-[#854d0e] border border-[#fde68a]",
  info:
    "bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]",
  muted:
    "bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb]",
};

/* ── Component ─────────────────────────────────────────────── */

export function Badge({
  label,
  children,
  variant = "default",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge-base",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="w-3.5 h-3.5 flex-shrink-0">{icon}</span>}
      {label ?? children}
    </span>
  );
}
