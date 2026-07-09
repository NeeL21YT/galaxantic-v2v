/**
 * components/layout/Navbar.tsx
 *
 * Sticky top navigation bar with:
 * - Logo
 * - Desktop nav links
 * - Login + Get Started CTAs
 * - Mobile hamburger menu
 * - Scroll shadow transition
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/* ── Nav Links ─────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
] as const;

/* ── Component ─────────────────────────────────────────────── */

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Scroll shadow */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Close mobile menu on resize */
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function handleNavClick(href: string) {
    setMobileOpen(false);
    // Smooth scroll for same-page anchors
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "py-3 backdrop-blur-md"
            : "py-5"
        )}
        style={{
          background: scrolled
            ? "rgba(255,253,249,0.88)"
            : "transparent",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-border-light)" : "none",
        }}
      >
        <div className="container-app max-w-6xl flex items-center justify-between gap-6">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => handleNavClick(href)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-[rgba(180,108,114,0.08)] cursor-pointer border-none bg-transparent"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:bg-[rgba(180,108,114,0.08)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Login
            </Link>
            <Button href="/register" size="sm" variant="primary">
              Get Started
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border-none bg-transparent cursor-pointer transition-colors hover:bg-[rgba(180,108,114,0.08)]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" style={{ color: "var(--color-puce-red)" }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: "var(--color-puce-red)" }} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(45,26,28,0.3)", backdropFilter: "blur(4px)" }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              key="panel"
              id="mobile-menu"
              role="dialog"
              aria-label="Mobile navigation"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col md:hidden"
              style={{
                background: "var(--color-surface)",
                borderLeft: "1px solid var(--color-border)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-5 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Logo size="sm" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full border-none bg-transparent cursor-pointer"
                  style={{ background: "var(--color-champagne)" }}
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" style={{ color: "var(--color-puce-red)" }} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-1 p-4 flex-1">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.button
                    key={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06 }}
                    onClick={() => handleNavClick(href)}
                    className="text-left px-4 py-3 rounded-xl text-base font-medium transition-colors cursor-pointer border-none bg-transparent w-full"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {label}
                  </motion.button>
                ))}
              </nav>

              {/* Bottom CTAs */}
              <div
                className="flex flex-col gap-3 p-6 border-t"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Button href="/login" variant="ghost" fullWidth>
                  Login
                </Button>
                <Button href="/register" variant="primary" fullWidth>
                  Get Started
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
