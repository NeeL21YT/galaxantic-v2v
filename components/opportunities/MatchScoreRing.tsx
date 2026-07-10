/**
 * components/opportunities/MatchScoreRing.tsx
 *
 * Small circular score indicator - consistent with the resume score rings.
 * Shows the AI match score (0–100) with a colour-coded arc.
 */

"use client";

interface MatchScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function MatchScoreRing({
  score,
  size = 44,
  strokeWidth = 4,
  showLabel = true,
}: MatchScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * (score / 100);
  const cx = size / 2;
  const cy = size / 2;

  const color =
    score >= 75
      ? "var(--color-rose-gold)"
      : score >= 50
      ? "#d97706"
      : "var(--color-rackley)";

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
      aria-label={`Match score ${score}%`}
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute text-[9px] font-bold leading-none"
          style={{ color }}
        >
          {score}
        </span>
      )}
    </div>
  );
}
