/**
 * components/financial/ProgressCircle.tsx
 *
 * SVG-based circular progress indicator.
 */

interface ProgressCircleProps {
  percent: number; // 0-100
  color: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressCircle({
  percent,
  color,
  size = 80,
  strokeWidth = 8,
  label,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `${percent}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
      </svg>
      {/* Center text */}
      <span
        className="absolute text-sm font-bold"
        style={{ color: "var(--color-puce-red)" }}
      >
        {percent}%
      </span>
    </div>
  );
}
