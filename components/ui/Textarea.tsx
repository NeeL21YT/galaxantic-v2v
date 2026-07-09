/**
 * components/ui/Textarea.tsx
 *
 * Accessible multiline textarea with label, helper text, and error state.
 */

"use client";

import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

/* ── Types ─────────────────────────────────────────────────── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label above the textarea */
  label?: string;
  /** Helper text shown below */
  helperText?: string;
  /** Error message (overrides helperText) */
  error?: string;
  /** Number of visible rows */
  rows?: number;
  /** Show character count */
  maxLength?: number;
  /** Current value length for character count display */
  currentLength?: number;
  /** Additional class names for wrapper */
  wrapperClassName?: string;
}

/* ── Component ─────────────────────────────────────────────── */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      helperText,
      error,
      rows = 4,
      maxLength,
      currentLength,
      wrapperClassName,
      className,
      id,
      ...rest
    },
    ref
  ) {
    const textareaId =
      id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "input-base resize-y min-h-[120px]",
            error && "border-[#dc2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          {...rest}
        />

        <div className="flex items-center justify-between">
          {error ? (
            <p
              id={`${textareaId}-error`}
              className="text-xs font-medium"
              style={{ color: "#dc2626" }}
              role="alert"
            >
              {error}
            </p>
          ) : helperText ? (
            <p
              id={`${textareaId}-helper`}
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {helperText}
            </p>
          ) : (
            <span />
          )}

          {maxLength !== undefined && currentLength !== undefined && (
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
