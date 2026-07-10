/**
 * app/login/page.tsx
 *
 * Login page — email/password form with social login options.
 * TODO Stage 2: wire to Supabase Auth.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isValidEmail } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    // TODO Stage 2: const { error } = await supabase.auth.signInWithPassword({ email, password })
    await new Promise((r) => setTimeout(r, 1200)); // Simulate loading
    setLoading(false);
    // TODO Stage 2: redirect to /dashboard on success
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Herizon account to continue your journey."
      illustration={<Sparkles className="w-16 h-16" />}
      tagline="Every great comeback starts with a single step forward."
    >
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

        <div className="relative">
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
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-[38px]"
            style={{ color: "var(--color-text-muted)" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

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
          loading={loading}
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
    </AuthLayout>
  );
}
