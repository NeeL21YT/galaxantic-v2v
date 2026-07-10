/**
 * components/auth/AuthLayout.tsx
 *
 * Shared wrapper for all auth pages (login, register, forgot-password).
 * Split-screen: illustration left, form right.
 */

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  /** Title shown above the form */
  title: string;
  subtitle: string;
  /** Tagline shown on the illustration panel */
  tagline?: string;
  /** Lucide icon shown on the left panel */
  illustration?: ReactNode;
}

const TRUST_BADGES = [
  "✦ 50,000+ Women Supported",
  "✦ AI-Powered Guidance",
  "✦ Free to Get Started",
];

export function AuthLayout({
  children,
  title,
  subtitle,
  tagline = "Empowering women to grow, restart and lead.",
  illustration = <Sparkles className="w-16 h-16" />,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-background)" }}>
      {/* Left panel — illustration (hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col justify-between p-12 relative overflow-hidden flex-shrink-0"
        style={{ background: "var(--color-puce-red-dark)" }}
      >
        {/* Background orbs */}
        <div
          className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--color-light-red)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-60 h-60 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--color-champagne)" }}
          aria-hidden="true"
        />

        {/* Logo */}
        <Link href="/" aria-label="Go to Herizon home">
          <Logo light={true} noLink={true} />
        </Link>

        {/* Illustration + Quote */}
        <div className="flex flex-col items-center gap-8 text-center relative z-10">
          <div
            className="w-40 h-40 rounded-3xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.85)",
            }}
            aria-hidden="true"
          >
            {illustration}
          </div>
          <blockquote>
            <p
              className="text-2xl font-bold leading-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#fff",
              }}
            >
              &ldquo;{tagline}&rdquo;
            </p>
            <footer className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              — Herizon
            </footer>
          </blockquote>
        </div>

        {/* Trust badges */}
        <div className="flex flex-col gap-2">
          {TRUST_BADGES.map((badge) => (
            <p key={badge} className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              {badge}
            </p>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile logo */}
        <div
          className="lg:hidden flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Link href="/" aria-label="Go to Herizon home">
            <Logo noLink={true} />
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
              >
                {title}
              </h1>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {subtitle}
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
