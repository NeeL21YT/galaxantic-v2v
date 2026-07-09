/**
 * components/shared/FeatureCard.tsx
 *
 * Premium feature/service card with icon, title, and description.
 * Used in features sections across the app.
 */

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

/* ── Types ─────────────────────────────────────────────────── */

interface FeatureCardProps {
  /** Lucide icon or any ReactNode */
  icon: ReactNode;
  /** Card heading */
  title: string;
  /** Supporting description */
  description: string;
  /** Optional tag */
  tag?: string;
  /** Additional class names */
  className?: string;
  /** Animation delay index for staggered entry */
  index?: number;
  /** If provided, renders the card as a Next.js Link */
  href?: string;
}

/* ── Component ─────────────────────────────────────────────── */

export function FeatureCard({
  icon,
  title,
  description,
  tag,
  className,
  index = 0,
  href,
}: FeatureCardProps) {
  const cardClass = cn(
    "card-base group flex flex-col gap-5 p-7",
    href ? "cursor-pointer" : "cursor-default",
    className
  );

  const inner = (
    <>
      {/* Icon container */}
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl transition-colors duration-300"
        style={{
          background: "var(--color-champagne)",
          color: "var(--color-rackley)",
        }}
      >
        <span className="w-7 h-7 [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        {tag && (
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-rose-gold)" }}
          >
            {tag}
          </span>
        )}

        <h3
          className="text-lg font-bold leading-snug"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-puce-red)",
          }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-12 mt-auto"
        style={{ background: "var(--color-rose-gold)" }}
        aria-hidden="true"
      />
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      {href ? (
        <Link href={href} className={cardClass}>
          {inner}
        </Link>
      ) : (
        <div className={cardClass}>{inner}</div>
      )}
    </motion.div>
  );
}

