/**
 * components/resume/ScoreRing.tsx
 *
 * Animated SVG ring displaying a 0–100 score.
 * Colour: green (≥75), amber (≥50), red (<50).
 */

"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

function scoreColor(score: number): string {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

export function ScoreRing({
  score,
  label,
  size = 100,
  strokeWidth = 8,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`${label}: ${score} out of 100`}
          role="img"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-bold leading-none"
            style={{
              fontSize: size < 90 ? "1.25rem" : "1.5rem",
              fontFamily: "var(--font-heading)",
              color,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span
            className="text-[10px] leading-none mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            /100
          </span>
        </div>
      </div>

      <span
        className="text-xs font-medium text-center"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </span>
    </div>
  );
}
