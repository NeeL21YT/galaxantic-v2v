/**
 * app/register/page.tsx
 *
 * Register page - wired to Supabase Auth via signUp server action.
 * On success, shows an email verification prompt instead of redirecting
 * (Supabase requires email confirmation by default).
 */

"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, CheckCircle2, Sprout, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { isValidEmail } from "@/lib/utils";
import { signUp, signIn, checkVerificationStatus } from "@/lib/supabase/actions";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setAuthError(null);

    startTransition(async () => {
      const result = await signUp(email, password, name.trim());
      if (result.success) {
        setSuccessMessage(
          result.message ??
            "Please wait till we verify you!"
        );
      } else {
        setAuthError(result.error);
      }
    });
  }

  // Auto-refresh after 2 seconds so the middleware picks up the session
  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      window.location.reload();
    }, 2000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of women building their next chapter with Herizon."
      illustration={<Sprout className="w-16 h-16" />}
      tagline="Your next chapter starts here. Let's build it together."
    >
      {/* Email verification success state */}
      {successMessage ? (
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a" }}
            aria-hidden="true"
          >
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h2
              className="text-lg font-bold mb-1"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
            >
              Waiting for verification...
            </h2>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {successMessage}
            </p>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Already verified?{" "}
            <Link href="/login" style={{ color: "var(--color-rose-gold)", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      ) : (
        <>
          {/* Auth error toast */}
          {authError && (
            <Toast
              message={authError}
              variant="error"
              onDismiss={() => setAuthError(null)}
            />
          )}

          <SocialLoginButtons action="register" />
          <AuthDivider label="or register with email" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              id="full-name"
              label="Full Name"
              placeholder="Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              autoComplete="name"
              required
              aria-required="true"
            />
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
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
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

            {/* Password strength indicators */}
            {password.length > 0 && (
              <ul className="flex flex-col gap-1.5 -mt-2" aria-label="Password requirements">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(password);
                  return (
                    <li
                      key={rule.label}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: met ? "#16a34a" : "var(--color-text-muted)" }}
                      aria-label={`${rule.label}: ${met ? "met" : "not met"}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Terms */}
            <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
              By creating an account you agree to our{" "}
              <Link href="#" style={{ color: "var(--color-rose-gold)" }}>Terms of Service</Link>{" "}
              and{" "}
              <Link href="#" style={{ color: "var(--color-rose-gold)" }}>Privacy Policy</Link>.
            </p>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isPending}
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "var(--color-text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-rose-gold)", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
