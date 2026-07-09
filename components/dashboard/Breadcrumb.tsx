/**
 * components/dashboard/Breadcrumb.tsx
 *
 * Lightweight breadcrumb component for dashboard pages.
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
}

export function Breadcrumb({ segments }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 flex-wrap">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs transition-colors duration-150"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Dashboard home"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </li>
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight
              className="w-3 h-3"
              style={{ color: "var(--color-border)" }}
              aria-hidden="true"
            />
            {seg.href && i < segments.length - 1 ? (
              <Link
                href={seg.href}
                className="text-xs transition-colors duration-150"
                style={{ color: "var(--color-text-muted)" }}
              >
                {seg.label}
              </Link>
            ) : (
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-rose-gold)" }}
                aria-current="page"
              >
                {seg.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
