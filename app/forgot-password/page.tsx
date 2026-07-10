/**
 * app/forgot-password/page.tsx
 *
 * Forgot password - wired to Supabase Auth via resetPassword server action.
 * Sends a reset email with a link to /auth/callback?next=/dashboard/settings.
 */

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, KeyRound } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { isValidEmail } from "@/lib/utils";
import { resetPassword } from "@/lib/supabase/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    if (!isValidEmail(email)) { setError("Enter a valid email address"); return; }
    setError(undefined);

    startTransition(async () => {
      const result = await resetPassword(email);
      if (result.success) {
        setSent(true);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      illustration={<KeyRound className="w-16 h-16" />}
      tagline="A fresh start is always one step away."
    >
      {sent ? (
        /* Success state */
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a" }}
            aria-hidden="true"
          >
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2
              className="text-lg font-bold mb-1"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
            >
              Check your inbox
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              We sent a reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
            </p>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              style={{ color: "var(--color-rose-gold)", fontWeight: 600 }}
            >
              Resend
            </button>
          </p>
          <Button href="/login" variant="secondary" fullWidth leftIcon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}>
            Back to Sign In
          </Button>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Auth error toast */}
          {error && (
            <Toast
              message={error}
              variant="error"
              onDismiss={() => setError(undefined)}
            />
          )}

          <Input
            id="reset-email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            aria-required="true"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isPending}
            rightIcon={<Send className="w-4 h-4" aria-hidden="true" />}
          >
            Send Reset Link
          </Button>

          <div className="flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: "var(--color-text-muted)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
