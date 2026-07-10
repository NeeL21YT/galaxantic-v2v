/**
 * components/sections/CTASection.tsx
 *
 * Large full-width call-to-action section with gradient background,
 * decorative shapes, headline, description, and two CTA buttons.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";

/* ── Component ─────────────────────────────────────────────── */

export function CTASection() {
  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
      aria-label="Call to action"
    >
      {/* Gradient card background */}
      <div
        className="absolute inset-0 mx-4 md:mx-8 lg:mx-16 rounded-3xl overflow-hidden"
        aria-hidden="true"
      >
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-puce-red) 0%, var(--color-rose-gold) 55%, #c4808a 100%)",
          }}
        />

        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
          style={{
            background: "rgba(255,255,255,0.08)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full"
          style={{
            background: "rgba(255,200,203,0.15)",
            filter: "blur(32px)",
          }}
        />

        {/* Abstract SVG decorations */}
        <svg
          className="absolute top-0 right-0 w-full h-full opacity-10"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <circle cx="650" cy="80" r="180" fill="white" />
          <circle cx="750" cy="350" r="100" fill="white" />
          <circle cx="100" cy="300" r="120" fill="white" />
          <path
            d="M0 200 Q200 100 400 200 T800 200"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center gap-8 py-8">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Your Journey Starts Now
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#fff",
            }}
          >
            Ready to Shape Your Future?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg leading-relaxed max-w-xl"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Join thousands of women who are already using Herizon to restart careers,
            discover opportunities, and build the professional life they deserve.
            Your next chapter begins with a single step.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {/* Primary - white button */}
            <motion.a
              href="/register"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-base px-8 py-3.5 text-base gap-2 shadow-lg"
              style={{
                background: "#fff",
                color: "var(--color-puce-red)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              }}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.a>

            {/* Secondary - ghost on dark */}
            <motion.a
              href="#features"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-base px-8 py-3.5 text-base gap-2"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(8px)",
              }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Features
            </motion.a>
          </motion.div>

          {/* Social proof line */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Free to use · No credit card required · Built for the Vibe2Vision Hackathon
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
