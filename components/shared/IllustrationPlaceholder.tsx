/**
 * components/shared/IllustrationPlaceholder.tsx
 *
 * Elegant abstract illustration container using decorative SVG shapes.
 * Marks where AI-generated illustrations will be inserted later.
 */

import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

type IllustrationVariant = "hero" | "feature" | "cta" | "empty";

interface IllustrationPlaceholderProps {
  /** Alt text / accessible label */
  label?: string;
  /** Visual variant */
  variant?: IllustrationVariant;
  /** Additional class names */
  className?: string;
  /** Aspect ratio (CSS value) */
  aspectRatio?: string;
}

/* ── Component ─────────────────────────────────────────────── */

export function IllustrationPlaceholder({
  label = "Illustration placeholder",
  variant = "hero",
  className,
  aspectRatio = "4/3",
}: IllustrationPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden rounded-3xl w-full",
        className
      )}
      style={{
        aspectRatio,
        background:
          "linear-gradient(135deg, var(--color-champagne) 0%, #fdf0e8 40%, var(--color-light-red) 100%)",
      }}
    >
      {/* Abstract decorative SVG shapes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Large soft circle — top right */}
        <circle cx="340" cy="60" r="120" fill="rgba(180,108,114,0.18)" />

        {/* Medium circle — bottom left */}
        <circle cx="60" cy="280" r="90" fill="rgba(245,230,209,0.6)" />

        {/* Small accent circle */}
        <circle cx="200" cy="260" r="50" fill="rgba(255,200,203,0.35)" />

        {/* Curved decorative line */}
        <path
          d="M0 180 Q100 120 200 160 T400 140"
          stroke="rgba(180,108,114,0.3)"
          strokeWidth="2"
          fill="none"
        />

        {/* Inner decorative elements based on variant */}
        {variant === "hero" && (
          <>
            {/* Rising star/flower shape */}
            <circle cx="200" cy="140" r="48" fill="rgba(255,255,255,0.5)" />
            <circle cx="200" cy="140" r="32" fill="rgba(255,255,255,0.65)" />
            {/* Petal shapes */}
            <ellipse cx="200" cy="100" rx="14" ry="28" fill="rgba(180,108,114,0.25)" />
            <ellipse cx="200" cy="180" rx="14" ry="28" fill="rgba(180,108,114,0.25)" />
            <ellipse cx="160" cy="140" rx="28" ry="14" fill="rgba(180,108,114,0.25)" />
            <ellipse cx="240" cy="140" rx="28" ry="14" fill="rgba(180,108,114,0.25)" />
            <circle cx="200" cy="140" r="16" fill="rgba(110,46,52,0.2)" />

            {/* Floating dots */}
            <circle cx="310" cy="180" r="6" fill="rgba(180,108,114,0.5)" />
            <circle cx="290" cy="210" r="4" fill="rgba(110,46,52,0.3)" />
            <circle cx="100" cy="90" r="5" fill="rgba(94,123,155,0.4)" />
            <circle cx="80" cy="130" r="3" fill="rgba(94,123,155,0.3)" />
            <circle cx="130" cy="60" r="4" fill="rgba(180,108,114,0.35)" />

            {/* Small geometric accent */}
            <rect x="320" y="240" width="24" height="24" rx="6" fill="rgba(94,123,155,0.2)" transform="rotate(15 320 240)" />
            <rect x="60" y="180" width="16" height="16" rx="4" fill="rgba(180,108,114,0.2)" transform="rotate(-10 60 180)" />
          </>
        )}

        {variant === "feature" && (
          <>
            <rect x="140" y="100" width="120" height="120" rx="24" fill="rgba(255,255,255,0.55)" />
            <circle cx="200" cy="160" r="28" fill="rgba(180,108,114,0.3)" />
            <circle cx="200" cy="160" r="14" fill="rgba(110,46,52,0.25)" />
          </>
        )}

        {variant === "cta" && (
          <>
            <path
              d="M160 80 L240 80 L280 160 L200 220 L120 160 Z"
              fill="rgba(255,255,255,0.2)"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            />
            <circle cx="200" cy="160" r="30" fill="rgba(255,255,255,0.3)" />
          </>
        )}
      </svg>

      {/* Placeholder label */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <span
          className="text-[10px] font-medium px-3 py-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.7)",
            color: "var(--color-rose-gold-dark)",
            backdropFilter: "blur(4px)",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
