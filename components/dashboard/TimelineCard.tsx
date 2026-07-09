/**
 * components/dashboard/TimelineCard.tsx
 *
 * A single milestone card used in the Roadmap timeline.
 */

"use client";

import { CheckCircle2, Circle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Milestone, MilestoneStatus } from "@/types/dashboard";

const statusConfig: Record<
  MilestoneStatus,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  completed: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "#16a34a",
    bg: "rgba(34,197,94,0.10)",
    label: "Completed",
  },
  "in-progress": {
    icon: <Clock className="w-4 h-4" />,
    color: "var(--color-rackley)",
    bg: "rgba(94,123,155,0.10)",
    label: "In Progress",
  },
  upcoming: {
    icon: <Circle className="w-4 h-4" />,
    color: "var(--color-text-muted)",
    bg: "var(--color-surface-hover)",
    label: "Upcoming",
  },
};

interface TimelineCardProps {
  milestone: Milestone;
  index?: number;
  isLast?: boolean;
}

export function TimelineCard({ milestone, index = 0, isLast = false }: TimelineCardProps) {
  const config = statusConfig[milestone.status];
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative flex gap-4"
    >
      {/* Timeline spine */}
      {!isLast && (
        <div
          className="absolute left-[18px] top-8 bottom-0 w-px"
          style={{
            background:
              milestone.status === "completed"
                ? "rgba(34,197,94,0.3)"
                : "var(--color-border)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Status Icon */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10"
        style={{ background: config.bg, color: config.color, border: `1.5px solid ${config.color}` }}
        aria-label={config.label}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div
        className="flex-1 rounded-2xl p-4 mb-4"
        style={{
          background: "var(--color-surface)",
          border: `1px solid ${milestone.status === "in-progress" ? "var(--color-rose-gold-light)" : "var(--color-border)"}`,
          boxShadow: milestone.status === "in-progress" ? "var(--shadow-card)" : "none",
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <p
            className="text-sm font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: milestone.status === "upcoming" ? "var(--color-text-secondary)" : "var(--color-puce-red)",
            }}
          >
            {milestone.title}
          </p>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
            style={{ background: config.bg, color: config.color }}
          >
            {config.label}
          </span>
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--color-text-muted)" }}>
          {milestone.description}
        </p>
        {/* Tasks */}
        <ul className="flex flex-col gap-1.5">
          {milestone.tasks.map((task) => (
            <li key={task} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: config.color }}
                aria-hidden="true"
              />
              {task}
            </li>
          ))}
        </ul>
        <p className="text-[10px] mt-3" style={{ color: "var(--color-text-muted)" }}>
          Due: {new Date(milestone.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </motion.div>
  );
}
