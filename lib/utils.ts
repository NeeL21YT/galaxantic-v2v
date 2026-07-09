/**
 * lib/utils.ts
 * Shared utility functions for the Herizon design system.
 */

/* ── Class Name Merger ─────────────────────────────────────── */

/**
 * Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames for this project.
 *
 * @example
 * cn("base-class", isActive && "active", undefined, "other")
 * // → "base-class active other"
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/* ── String Utilities ──────────────────────────────────────── */

/**
 * Truncates a string to a given length and appends ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Converts a string to title case.
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts a string to a URL-friendly slug.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── Date Utilities ────────────────────────────────────────── */

/**
 * Formats a date to a human-readable string.
 *
 * @example
 * formatDate(new Date("2025-06-01")) // → "June 1, 2025"
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

/**
 * Returns a relative time string (e.g. "3 days ago").
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d, { month: "short", day: "numeric", year: "numeric" });
}

/* ── Number Utilities ──────────────────────────────────────── */

/**
 * Formats a number with compact notation (e.g. 1200 → "1.2K").
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
}

/* ── Validation Utilities ──────────────────────────────────── */

/**
 * Validates an email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── DOM Utilities ─────────────────────────────────────────── */

/**
 * Smoothly scrolls to a section by ID.
 */
export function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
