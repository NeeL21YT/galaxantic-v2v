/**
 * components/ui/Card.tsx
 *
 * Reusable surface container with optional hover lift effect.
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

/* ── Types ─────────────────────────────────────────────────── */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content inside the card */
  children: ReactNode;
  /** Enable hover lift + shadow transition */
  hover?: boolean;
  /** Use a subtle champagne-tinted background instead of pure white */
  tinted?: boolean;
  /** Remove default padding */
  noPadding?: boolean;
  /** Additional class names */
  className?: string;
}

/* ── Component ─────────────────────────────────────────────── */

export function Card({
  children,
  hover = false,
  tinted = false,
  noPadding = false,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "card-base",
        !noPadding && "p-6",
        tinted && "bg-[#fffcf8]",
        hover && "cursor-pointer",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
