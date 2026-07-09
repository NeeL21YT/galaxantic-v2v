/**
 * components/shared/NewsletterInput.tsx
 *
 * Email subscription input with inline submit button.
 * Ready for Stage 2 backend integration.
 */

"use client";

import { useState } from "react";
import { isValidEmail } from "@/lib/utils";
import { Send } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */

interface NewsletterInputProps {
  /** Input placeholder text */
  placeholder?: string;
  /** Submit button label */
  buttonLabel?: string;
  /** Called with the email on valid submission */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Light variant for dark backgrounds */
  light?: boolean;
}

/* ── Component ─────────────────────────────────────────────── */

export function NewsletterInput({
  placeholder = "Enter your email address",
  buttonLabel = "Get Early Access",
  onSubmit,
  light = false,
}: NewsletterInputProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit?.(email);
      setSuccess(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium"
        style={{
          background: light ? "rgba(255,255,255,0.2)" : "var(--color-champagne)",
          color: light ? "#fff" : "var(--color-puce-red)",
        }}
        role="status"
      >
        <span>🎉</span>
        <span>You&apos;re on the list! We&apos;ll be in touch.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col gap-2"
      noValidate
    >
      <div
        className="flex items-center gap-2 p-2 rounded-full"
        style={{
          background: light ? "rgba(255,255,255,0.15)" : "var(--color-surface)",
          border: light
            ? "1.5px solid rgba(255,255,255,0.3)"
            : "1.5px solid var(--color-border)",
          backdropFilter: light ? "blur(8px)" : undefined,
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none px-3 py-1 text-sm min-w-0"
          style={{
            color: light ? "#fff" : "var(--color-text-primary)",
            fontFamily: "var(--font-body)",
          }}
          aria-label="Email address"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-base px-5 py-2 text-sm flex-shrink-0 gap-1.5"
          style={{
            background: light ? "rgba(255,255,255,0.9)" : "var(--color-rose-gold)",
            color: light ? "var(--color-puce-red)" : "#fff",
          }}
          aria-label={buttonLabel}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          {buttonLabel}
        </button>
      </div>

      {error && (
        <p className="text-xs font-medium px-4" style={{ color: light ? "#fecaca" : "#dc2626" }} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
