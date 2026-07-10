/**
 * components/sections/HowItWorksSection.tsx
 *
 * Four-step connected process with numbered indicators and icons.
 * Responsive: vertical on mobile, horizontal on desktop.
 */

"use client";

import { motion } from "framer-motion";
import { Upload, Lightbulb, Map, Rocket } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ── Step Data ─────────────────────────────────────────────── */

const STEPS = [
  {
    number: "01",
    icon: <Upload />,
    title: "Upload Resume",
    description:
      "Share your resume or career history. Our AI instantly analyzes your experience, skills, and career trajectory.",
  },
  {
    number: "02",
    icon: <Lightbulb />,
    title: "AI Career Insights",
    description:
      "Receive a comprehensive AI analysis - career readiness score, skill gaps, and actionable improvement suggestions.",
  },
  {
    number: "03",
    icon: <Map />,
    title: "Personalized Roadmap",
    description:
      "Get a 30/60/90-day personalized career plan designed around your goals, timeline, and unique strengths.",
  },
  {
    number: "04",
    icon: <Rocket />,
    title: "Discover Opportunities",
    description:
      "Explore curated jobs, internships, scholarships, and hackathons matched precisely to your profile and aspirations.",
  },
] as const;

/* ── Step Card ─────────────────────────────────────────────── */

interface StepCardProps {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
  isLast: boolean;
}

function StepCard({ icon, title, description, index, isLast }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      className="relative flex flex-col items-center text-center gap-4 flex-1"
    >
      {/* Connector line - desktop only */}
      {!isLast && (
        <div
          className="hidden md:block absolute top-7 left-[calc(50%+2.5rem)] right-0 h-px"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(90deg, var(--color-rose-gold-light), var(--color-border))",
          }}
        />
      )}

      {/* Number + Icon stack */}
      <div className="relative flex-shrink-0">
        {/* Outer ring */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10"
          style={{
            background: "var(--color-surface)",
            border: "2px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
            color: "var(--color-rackley)",
          }}
        >
          <span className="w-6 h-6 [&>svg]:w-full [&>svg]:h-full">{icon}</span>
        </div>

        {/* Step number badge */}
        <span
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-20"
          style={{
            background: "var(--color-rose-gold)",
            color: "#fff",
          }}
          aria-hidden="true"
        >
          {index + 1}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 px-2">
        <h3
          className="text-base font-bold leading-tight"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-puce-red)",
          }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Section Component ─────────────────────────────────────── */

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-padding"
      aria-label="How Herizon works"
    >
      <Container>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="mb-16"
        >
          <SectionTitle
            eyebrow="How It Works"
            title="From resume to opportunity in four steps"
            subtitle="Herizon's AI does the heavy lifting - you focus on growing."
            align="center"
            accent
          />
        </motion.div>

        {/* Steps grid */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 relative"
          )}
        >
          {STEPS.map((step, i) => (
            <StepCard
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={i}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-14 h-px rounded-full mx-auto max-w-xs"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-rose-gold-light), transparent)",
          }}
          aria-hidden="true"
        />
      </Container>
    </section>
  );
}
