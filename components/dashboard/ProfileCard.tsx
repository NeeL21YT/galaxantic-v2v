/**
 * components/dashboard/ProfileCard.tsx
 *
 * Large user profile display for the Settings page header.
 */

"use client";

import { Camera } from "lucide-react";
import type { User } from "@/types/dashboard";

interface ProfileCardProps {
  user: User;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold overflow-hidden"
          style={{ background: "var(--color-rose-gold)", color: "#fff" }}
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
        <button
          type="button"
          aria-label="Change avatar"
          className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors"
          style={{ background: "var(--color-rose-gold)", color: "#fff" }}
          onClick={() => {
            // TODO Stage 2: implement avatar upload
          }}
        >
          <Camera className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-puce-red)" }}
        >
          {user.name}
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {user.email}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
          {user.role} · Member since{" "}
          {new Date(user.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>

        {/* Readiness badge */}
        <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
          <div
            className="h-1.5 w-24 rounded-full overflow-hidden"
            style={{ background: "var(--color-border)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${user.careerReadiness}%`,
                background: "var(--color-rose-gold)",
              }}
            />
          </div>
          <span className="text-xs" style={{ color: "var(--color-rose-gold)" }}>
            {user.careerReadiness}% Career Ready
          </span>
        </div>
      </div>
    </div>
  );
}
