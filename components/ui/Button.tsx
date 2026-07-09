/**
 * components/ui/Button.tsx
 *
 * Primary reusable Button component.
 * Renders as <button> by default, or as <a> when `href` is provided.
 */

"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface BaseProps {
  /** Visual style of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Content inside the button */
  children: ReactNode;
  /** Additional class names */
  className?: string;
  /** Disables the button */
  disabled?: boolean;
  /** Icon rendered before children */
  leftIcon?: ReactNode;
  /** Icon rendered after children */
  rightIcon?: ReactNode;
  /** Shows a loading spinner */
  loading?: boolean;
  /** Full width */
  fullWidth?: boolean;
}

interface ButtonProps extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

interface LinkProps extends BaseProps {
  /** If provided, renders as a Next.js Link */
  href: string;
  /** Open in new tab */
  external?: boolean;
  onClick?: () => void;
  type?: never;
}

type Props = ButtonProps | LinkProps;

/* ── Style Maps ────────────────────────────────────────────── */

const variantStyles: Record<ButtonVariant, string> = {
  primary: "shadow-sm hover:shadow-md active:scale-[0.98]",
  secondary: "active:scale-[0.98]",
  ghost: "active:scale-[0.98]",
  outline: "active:scale-[0.98]",
  danger: "active:scale-[0.98]",
};

interface VariantStyleObj {
  background: string;
  color: string;
  border?: string;
}

const variantCSS: Record<ButtonVariant, VariantStyleObj> = {
  primary: { background: "var(--color-rose-gold)", color: "#ffffff" },
  secondary: { background: "var(--color-champagne)", color: "var(--color-puce-red)" },
  ghost: { background: "transparent", color: "var(--color-rose-gold)" },
  outline: {
    background: "transparent",
    color: "var(--color-rose-gold)",
    border: "2px solid var(--color-rose-gold)",
  },
  danger: { background: "#dc2626", color: "#ffffff" },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-2.5 text-sm gap-2",
  lg: "px-8 py-3 text-base gap-2",
  xl: "px-10 py-4 text-lg gap-2.5",
};

/* ── Component ─────────────────────────────────────────────── */

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled,
  leftIcon,
  rightIcon,
  loading,
  fullWidth,
  ...props
}: Props) {
  const baseClass = cn(
    "btn-base",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    (disabled || loading) ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    "transition-all duration-200",
    className
  );

  const baseStyle: React.CSSProperties = {
    ...variantCSS[variant],
  };

  const content = (
    <>
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external, onClick } = props as LinkProps;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClass}
          style={baseStyle}
          onClick={onClick}
          aria-disabled={disabled}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClass} style={baseStyle} onClick={onClick} aria-disabled={disabled}>
        {content}
      </Link>
    );
  }

  const { onClick, type = "button" } = props as ButtonProps;
  return (
    <button
      type={type}
      className={baseClass}
      style={baseStyle}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

