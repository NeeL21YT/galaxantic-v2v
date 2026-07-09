/**
 * components/shared/GradientBackground.tsx
 *
 * Decorative background wrapper with gradient presets.
 * Supports polymorphic `as` prop (div, section, article, etc.).
 */

import { cn } from "@/lib/utils";
import type { ReactNode, ElementType, HTMLAttributes } from "react";

/* ── Types ─────────────────────────────────────────────────── */

type GradientVariant = "brand" | "hero" | "cta" | "subtle" | "none";

interface GradientBackgroundProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Gradient preset */
  variant?: GradientVariant;
  /** Render as a different HTML element */
  as?: ElementType;
  /** Additional class names */
  className?: string;
}

/* ── Style Map ─────────────────────────────────────────────── */

const variantClass: Record<GradientVariant, string> = {
  brand: "gradient-brand",
  hero: "gradient-hero",
  cta: "gradient-cta",
  subtle: "",
  none: "",
};

const variantInlineStyle: Partial<Record<GradientVariant, React.CSSProperties>> = {
  subtle: {
    background:
      "linear-gradient(180deg, var(--color-champagne) 0%, #fffdf9 100%)",
  },
};

/* ── Component ─────────────────────────────────────────────── */

export function GradientBackground({
  children,
  variant = "brand",
  as: Tag = "div",
  className,
  style,
  ...rest
}: GradientBackgroundProps) {
  return (
    <Tag
      className={cn("relative", variantClass[variant], className)}
      style={{ ...variantInlineStyle[variant], ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
