/**
 * components/dashboard/NotificationButton.tsx
 *
 * Bell icon button with an unread badge count.
 */

"use client";

import { Bell } from "lucide-react";

interface NotificationButtonProps {
  count?: number;
}

export function NotificationButton({ count = 3 }: NotificationButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
      className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150"
      style={{
        background: "var(--color-surface-hover)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-secondary)",
      }}
    >
      <Bell className="w-4 h-4" aria-hidden="true" />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: "var(--color-rose-gold)", color: "#fff" }}
          aria-hidden="true"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
