/**
 * components/layout/Footer.tsx
 *
 * Minimal, elegant footer with brand, navigation, social links, and copyright.
 */

import { Logo } from "@/components/shared/Logo";
import { Divider } from "@/components/ui/Divider";
import { X, Globe, AtSign, GitBranch } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Data ──────────────────────────────────────────────────── */

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: X, label: "X (Twitter)", href: "#" },
  { icon: Globe, label: "LinkedIn", href: "#" },
  { icon: AtSign, label: "Instagram", href: "#" },
  { icon: GitBranch, label: "GitHub", href: "https://github.com/NeeL21YT/galaxantic-v2v" },
];

/* ── Component ─────────────────────────────────────────────── */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="pt-16 pb-8"
      style={{
        background: "linear-gradient(180deg, #fffdf9 0%, var(--color-champagne) 100%)",
        borderTop: "1px solid var(--color-border)",
      }}
      aria-label="Site footer"
    >
      <div className="container-app max-w-6xl">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12">
          {/* Brand column */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <Logo size="md" noLink />
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Empowering women to grow, restart and lead — with AI-powered
              career guidance designed for every stage of your journey.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-1" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200",
                    "hover:border-rose-gold hover:bg-champagne"
                  )}
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>

            {/* Hackathon badge */}
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
              style={{
                background: "var(--color-champagne)",
                color: "var(--color-puce-red)",
                border: "1px solid rgba(110,46,52,0.15)",
              }}
            >
              🏆 Built for Vibe2Vision Hackathon
            </span>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--color-puce-red)" }}
              >
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5" role="list">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            &copy; {year} Herizon. Built with ❤️ by{" "}
            <a
              href="https://github.com/NeeL21YT/galaxantic-v2v"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
              style={{ color: "var(--color-rose-gold)" }}
            >
              Team Galaxantic
            </a>{" "}
            for the Vibe2Vision Hackathon.
          </p>

          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Track 3 — ElevateHer: Education, FinTech &amp; Career Empowerment
          </p>
        </div>
      </div>
    </footer>
  );
}
