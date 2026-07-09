/**
 * components/dashboard/QuickActionCard.tsx
 *
 * A tappable action card used on the dashboard home page.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface QuickActionCardProps {
  icon: ReactNode;
  label: string;
  description: string;
  href: string;
  accent?: "rose" | "blue" | "green" | "amber";
  index?: number;
}

const accentCSS = {
  rose: { bg: "rgba(180,108,114,0.08)", color: "var(--color-rose-gold)", hover: "rgba(180,108,114,0.14)" },
  blue: { bg: "rgba(94,123,155,0.08)", color: "var(--color-rackley)", hover: "rgba(94,123,155,0.14)" },
  green: { bg: "rgba(34,197,94,0.08)", color: "#16a34a", hover: "rgba(34,197,94,0.14)" },
  amber: { bg: "rgba(245,158,11,0.08)", color: "#d97706", hover: "rgba(245,158,11,0.14)" },
};

export function QuickActionCard({
  icon,
  label,
  description,
  href,
  accent = "rose",
  index = 0,
}: QuickActionCardProps) {
  const colors = accentCSS[accent];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className="flex flex-col gap-3 p-4 rounded-2xl transition-all duration-200 group"
        style={{
          background: colors.bg,
          border: "1px solid var(--color-border-light)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 transition-colors duration-200"
          style={{ background: "var(--color-surface)", color: colors.color }}
        >
          {icon}
        </div>
        <div>
          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
          >
            {label}
          </p>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: "var(--color-text-muted)" }}>
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
