/**
 * components/ui/Input.tsx
 *
 * Accessible text input field with label, helper text, and error state.
 */

"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

/* ── Types ─────────────────────────────────────────────────── */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label above the input */
  label?: string;
  /** Helper text shown below the input */
  helperText?: string;
  /** Error message (replaces helperText when present) */
  error?: string;
  /** Optional leading icon inside the input */
  leftIcon?: React.ReactNode;
  /** Optional trailing element (e.g. clear button) */
  rightElement?: React.ReactNode;
  /** Additional class names for the wrapper */
  wrapperClassName?: string;
}

/* ── Component ─────────────────────────────────────────────── */

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    leftIcon,
    rightElement,
    wrapperClassName,
    className,
    id,
    ...rest
  },
  ref
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-primary"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className="absolute left-3 flex items-center pointer-events-none"
            style={{ color: "var(--color-text-muted)" }}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "input-base",
            rightElement ? "pr-10" : "",
            error ? "border-[#dc2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]" : "",
            className
          )}
          style={leftIcon ? { paddingLeft: "2.25rem" } : undefined}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...rest}
        />

        {rightElement && (
          <span className="absolute right-3 flex items-center">
            {rightElement}
          </span>
        )}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          className="text-xs font-medium"
          style={{ color: "#dc2626" }}
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={`${inputId}-helper`}
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
