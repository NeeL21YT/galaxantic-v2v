/**
 * components/resume/RoadmapTimeline.tsx
 *
 * 30 / 60 / 90-day career roadmap display.
 * Rendered as a horizontal 3-column layout on desktop,
 * stacked on mobile.
 */

"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { ResumeRoadmap } from "@/types/resume-analysis";

interface PhaseConfig {
  key: keyof ResumeRoadmap;
  label: string;
  days: string;
  accent: string;
  bg: string;
}

const PHASES: PhaseConfig[] = [
  {
    key: "30Days",
    label: "Month 1",
    days: "Days 1–30",
    accent: "var(--color-rose-gold)",
    bg: "rgba(180,108,114,0.07)",
  },
  {
    key: "60Days",
    label: "Month 2",
    days: "Days 31–60",
    accent: "var(--color-rackley)",
    bg: "rgba(94,123,155,0.07)",
  },
  {
    key: "90Days",
    label: "Month 3",
    days: "Days 61–90",
    accent: "#16a34a",
    bg: "rgba(22,163,74,0.07)",
  },
];

interface RoadmapTimelineProps {
  roadmap: ResumeRoadmap;
}

export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PHASES.map((phase, phaseIdx) => {
        const items = roadmap[phase.key] ?? [];

        return (
          <motion.div
            key={phase.key}
            className="rounded-2xl p-5"
            style={{
              background: phase.bg,
              border: `1px solid ${phase.accent}30`,
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIdx * 0.15, duration: 0.5 }}
          >
            {/* Phase header */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: phase.accent }}
              >
                {phaseIdx + 1}
              </div>
              <div>
                <p
                  className="text-sm font-semibold leading-none"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
                >
                  {phase.label}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {phase.days}
                </p>
              </div>
            </div>

            {/* Items */}
            <ul className="flex flex-col gap-2.5" role="list">
              {items.map((item, itemIdx) => (
                <motion.li
                  key={itemIdx}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: phaseIdx * 0.15 + itemIdx * 0.06 }}
                >
                  <CheckCircle2
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    style={{ color: phase.accent }}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}
