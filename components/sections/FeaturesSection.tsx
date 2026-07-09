/**
 * components/sections/FeaturesSection.tsx
 *
 * Three premium feature cards with staggered scroll-reveal animations.
 * Showcases the three core modules of the Herizon platform.
 */

"use client";

import { motion } from "framer-motion";
import { Briefcase, Compass, Bot } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { GradientBackground } from "@/components/shared/GradientBackground";

/* ── Feature Data ──────────────────────────────────────────── */

const FEATURES = [
  {
    icon: <Briefcase />,
    title: "Career Break Companion",
    tag: "Restart",
    description:
      "Confidently return to work after any career break. Get an AI-powered gap analysis, personalized 30/60/90-day roadmap, skill gap recommendations, and a career readiness score tailored to your goals.",
    href: "/dashboard/career-break",
  },
  {
    icon: <Compass />,
    title: "Opportunity Navigator",
    tag: "Discover",
    description:
      "Your personalized feed of internships, scholarships, fellowships, hackathons and job openings — curated by AI, filtered by eligibility, and tracked by deadline. Never miss the right opportunity.",
    href: "/dashboard/opportunities",
  },
  {
    icon: <Bot />,
    title: "AI Career Coach",
    tag: "Grow",
    description:
      "Your always-on personal mentor. Get AI-powered resume reviews, interview preparation, learning roadmaps, and career guidance — designed to help you grow with clarity and confidence.",
    href: "/dashboard/ai-coach",
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
              subtitle="Herizon combines three powerful modules into one seamless platform — built specifically for women at every stage of their career."
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
