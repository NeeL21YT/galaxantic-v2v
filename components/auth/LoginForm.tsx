/**
 * components/auth/LoginForm.tsx
 *
 * Client Component containing the login form logic.
 * Extracted from app/login/page.tsx so that useSearchParams() can be
 * wrapped in a <Suspense> boundary at the page level (required by
 * Next.js 16 for static prerendering).
 */

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { isValidEmail } from "@/lib/utils";
import { signIn } from "@/lib/supabase/actions";

export function LoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(
    // Show errors passed from /auth/callback (e.g. expired verification link)
    searchParams.get("error") ?? null
  );
  const [authMessage, setAuthMessage] = useState<string | null>(
    // Show success messages passed from /auth/callback
    searchParams.get("message") ?? null
  );

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setAuthError(null);

    startTransition(async () => {
      const result = await signIn(email, password);
      // If signIn succeeds it redirects server-side - this code only
      // runs when it returns an error.
      if (!result.success) {
        setAuthError(result.error);
      }
    });
  }

  return (
    <>
      {/* Auth error toast */}
      {authError && (
        <Toast
          message={authError}
          variant="error"
          onDismiss={() => setAuthError(null)}
        />
      )}
      
      {/* Auth success toast */}
      {authMessage && (
        <Toast
          message={authMessage}
          variant="success"
          onDismiss={() => setAuthMessage(null)}
        />
      )}

      <SocialLoginButtons action="login" />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          required
          aria-required="true"
        />

        <Input
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
          required
          aria-required="true"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{ color: "var(--color-text-muted)" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <Link
            href="/forgot-password"
            className="text-xs"
            style={{ color: "var(--color-rose-gold)" }}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isPending}
          rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
        >
          Sign In
        </Button>
      </form>

      {/* Register link */}
      <p className="text-center text-xs mt-6" style={{ color: "var(--color-text-muted)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" style={{ color: "var(--color-rose-gold)", fontWeight: 600 }}>
          Create one free
        </Link>
      </p>
    </>
  );
}
