/**
 * components/layout/Container.tsx
 *
 * Centered max-width wrapper used throughout the app.
 * Keeps all content within the 1200px design grid.
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

/* ── Types ─────────────────────────────────────────────────── */

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Max width variant */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Additional class names */
  className?: string;
}

/* ── Size Map ──────────────────────────────────────────────── */

const sizeMap: Record<string, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-full",
};

/* ── Component ─────────────────────────────────────────────── */

export function Container({
  children,
  size = "xl",
  className,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn("container-app", sizeMap[size], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
