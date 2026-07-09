/**
 * app/register/page.tsx
 *
 * Register page — full name, email, password + social signup.
 * TODO Stage 2: wire to Supabase Auth.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { isValidEmail } from "@/lib/utils";

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    // TODO Stage 2: const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    // TODO Stage 2: redirect to /dashboard on success
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of women building their next chapter with Herizon."
      illustration="🌱"
      tagline="Your next chapter starts here. Let's build it together."
    >
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

        <div className="relative">
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
          loading={loading}
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
    </AuthLayout>
  );
}
