/**
 * components/ui/Skeleton.tsx
 *
 * Content placeholder with shimmer animation for loading states.
 */

import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────── */

interface SkeletonProps {
  /** Width of the skeleton (CSS value or Tailwind class via className) */
  width?: string;
  /** Height of the skeleton */
  height?: string;
  /** Fully round (circle) or pill shape */
  rounded?: "sm" | "md" | "lg" | "xl" | "full" | "none";
  /** Additional class names */
  className?: string;
}

/* ── Base Skeleton ─────────────────────────────────────────── */

const roundedMap: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function Skeleton({
  width,
  height,
  rounded = "lg",
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer",
        roundedMap[rounded],
        className
      )}
      style={{
        width: width ?? "100%",
        height: height ?? "1rem",
      }}
      aria-hidden="true"
    />
  );
}

/* ── Preset Skeletons ──────────────────────────────────────── */

/** Skeleton for a card with title + description lines */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("card-base p-6 flex flex-col gap-4", className)}
      aria-hidden="true"
    >
      <Skeleton rounded="full" width="3rem" height="3rem" />
      <div className="flex flex-col gap-2">
        <Skeleton height="1.25rem" width="60%" />
        <Skeleton height="0.875rem" />
        <Skeleton height="0.875rem" width="80%" />
      </div>
    </div>
  );
}

/** Skeleton for a text block */
export function TextSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? "65%" : "100%"}
        />
      ))}
    </div>
  );
}

/** Skeleton for an avatar */
export function AvatarSkeleton({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = { sm: "2rem", md: "2.5rem", lg: "3.5rem" };
  return (
    <Skeleton
      rounded="full"
      width={sizeMap[size]}
      height={sizeMap[size]}
    />
  );
}
