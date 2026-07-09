/**
 * components/dashboard/PageHeader.tsx
 *
 * Reusable page header used at the top of every dashboard page.
 */

"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional action button(s) top-right */
  action?: ReactNode;
  /** Breadcrumb label (auto uses title if omitted) */
  breadcrumb?: string;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
    >
      <div className="flex flex-col gap-1">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-puce-red)",
            fontSize: "clamp(1.4rem, 3vw, 1.875rem)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
}
