/**
 * components/sections/FeaturesSection.tsx
 *
 * Three premium feature cards with staggered scroll-reveal animations.
 * Showcases the three core modules of the Herizon platform.
 */

"use client";

import { motion } from "framer-motion";
import { Briefcase, Compass, Bot, FileText, Map, Eye, PiggyBank } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { GradientBackground } from "@/components/shared/GradientBackground";

/* ── Feature Data ──────────────────────────────────────────── */

const FEATURES = [
  {
    icon: <Briefcase />,
    title: "Career Break",
    tag: "Restart",
    description:
      "Confidently return to work after any career break. Get personalized guidance to transition back into the workforce.",
    href: "/dashboard/career-break",
  },
  {
    icon: <FileText />,
    title: "Resume",
    tag: "Optimize",
    description:
      "AI-powered resume analysis. Identify skill gaps, get an ATS score, and receive targeted feedback to stand out to employers.",
    href: "/dashboard/resume",
  },
  {
    icon: <Map />,
    title: "Roadmap",
    tag: "Plan",
    description:
      "Your interactive 30/60/90-day action plan, automatically generated from your resume to bridge your specific career gaps.",
    href: "/dashboard/roadmap",
  },
  {
    icon: <Compass />,
    title: "Opportunities",
    tag: "Discover",
    description:
      "Your personalized feed of jobs, internships, scholarships, and hackathons - ranked by AI based on your profile.",
    href: "/dashboard/opportunities",
  },
  {
    icon: <Bot />,
    title: "AI Coach",
    tag: "Grow",
    description:
      "Your always-on personal mentor. Get tailored interview preparation, learning roadmaps, and contextual career guidance.",
    href: "/dashboard/ai-coach",
  },
  {
    icon: <Eye />,
    title: "HerLens",
    tag: "Stay Informed",
    description:
      "Daily bite-sized, AI-summarized news focusing on women in business, tech, and leadership to keep you ahead of the curve.",
    href: "/dashboard/herlens",
  },
  {
    icon: <PiggyBank />,
    title: "Financial Compass",
    tag: "Finance",
    description:
      "Plan your financial independence with deterministic health scores and personalized AI budgeting strategies.",
    href: "/dashboard/financial-compass",
  },
] as const;


/* ── Component ─────────────────────────────────────────────── */

export function FeaturesSection() {
  return (
    <GradientBackground variant="subtle" id="features" as="section">
      <div className="section-padding">
        <Container>
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
            className="mb-14"
          >
            <SectionTitle
              eyebrow="What We Offer"
              title={
                <>
                  Everything you need to{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-puce-red), var(--color-rose-gold))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    thrive
                  </span>
                </>
              }
              subtitle="Herizon combines seven powerful modules into one seamless platform - built specifically for women at every stage of their career."
              align="center"
              accent
            />
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                tag={feature.tag}
                href={feature.href}
                index={i}
              />
            ))}
          </div>
        </Container>
      </div>
    </GradientBackground>
  );
}
