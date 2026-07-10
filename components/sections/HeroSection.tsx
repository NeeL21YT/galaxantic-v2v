/**
 * components/sections/HeroSection.tsx
 *
 * Full-bleed hero with animated headline, CTAs, trust badge,
 * and an abstract illustration placeholder on the right.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Bot } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";

/* ── Animation Variants ────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

/* ── Stats ─────────────────────────────────────────────────── */

const STATS = [
  { value: "50K+", label: "Women Supported" },
  { value: "3 Core", label: "Career Modules" },
  { value: "AI-Powered", label: "Career Guidance" },
];

/* ── Component ─────────────────────────────────────────────── */

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 60% -10%, rgba(245,230,209,0.8) 0%, rgba(255,200,203,0.2) 50%, transparent 80%)",
        }}
      />

      {/* Decorative blobs */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,203,0.35) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 -left-16 w-72 h-72 rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(245,230,209,0.5) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Text content ── */}
          <div className="flex flex-col gap-6">
            {/* Trust badge */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <Badge
                variant="default"
                icon={<Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
                label="Built for Vibe2Vision Hackathon"
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-puce-red)",
                lineHeight: 1.15,
              }}
            >
              Empowering Every{" "}
              <span
                className="relative inline-block"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-puce-red), var(--color-rose-gold))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Woman&apos;s
              </span>{" "}
              Career Journey
            </motion.h1>

            {/* Tagline */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-lg leading-relaxed max-w-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Herizon empowers women with AI-powered career guidance, opportunity
              discovery, personalized learning and career restart support - all in
              one elegant platform.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-3"
            >
              <Button
                href="/register"
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              >
                Get Started
              </Button>
              <Button
                href="#features"
                size="lg"
                variant="ghost"
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-6 pt-2"
            >
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-puce-red)",
                    }}
                  >
                    {value}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Illustration ── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="show"
            className="relative w-full"
          >
            {/* Outer glow ring */}
            <div
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(180,108,114,0.12) 0%, transparent 70%)",
              }}
            />

            <div
              className="relative z-10 w-full"
              style={{ aspectRatio: "5/4" }}
            >
              <Image
                src="/images/herizon_hero.webp"
                alt="Abstract AI career platform illustration with a laptop, resume, roadmap, opportunity cards, and progress visuals in soft pastel colors."
                fill
                priority
                className="object-contain drop-shadow-xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating card - top left */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -left-6 top-8 z-20 hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{
                background: "var(--color-surface)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--color-border)",
              }}
              aria-hidden="true"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(180,108,114,0.1)", color: "var(--color-rose-gold)" }}>
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p
                  className="text-xs font-semibold leading-tight"
                  style={{ color: "var(--color-puce-red)" }}
                >
                  Opportunity Found
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  3 new matches today
                </p>
              </div>
            </motion.div>

            {/* Floating card - bottom right */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-4 bottom-10 z-20 hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{
                background: "var(--color-surface)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--color-border)",
              }}
              aria-hidden="true"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(94,123,155,0.1)", color: "var(--color-rackley)" }}>
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p
                  className="text-xs font-semibold leading-tight"
                  style={{ color: "var(--color-puce-red)" }}
                >
                  AI Insight Ready
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Resume score: 92%
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
