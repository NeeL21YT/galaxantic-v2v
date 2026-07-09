/**
 * components/dashboard/layout/DashboardNavbar.tsx
 *
 * Top navigation bar for the dashboard. Shows greeting, search,
 * notification bell, and user avatar dropdown.
 */

"use client";

import { Menu } from "lucide-react";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { NotificationButton } from "@/components/dashboard/NotificationButton";
import { AvatarDropdown } from "@/components/dashboard/AvatarDropdown";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { PLACEHOLDER_USER } from "@/lib/data/placeholder";

interface DashboardNavbarProps {
  onMenuClick: () => void;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function DashboardNavbar({ onMenuClick, breadcrumbs = [] }: DashboardNavbarProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 py-3"
      style={{
        background: "rgba(255,253,249,0.92)",
        borderBottom: "1px solid var(--color-border)",
        backdropFilter: "blur(12px)",
        minHeight: "68px",
      }}
    >
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-150"
          style={{
            background: "var(--color-surface-hover)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          <Menu className="w-4.5 h-4.5" aria-hidden="true" />
        </button>

        {/* Greeting + Breadcrumb */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <p
            className="text-xs hidden sm:block"
            style={{ color: "var(--color-text-muted)" }}
          >
            {greeting}, {PLACEHOLDER_USER.name.split(" ")[0]} 👋
          </p>
          {breadcrumbs.length > 0 && <Breadcrumb segments={breadcrumbs} />}
        </div>
      </div>

      {/* Right: Search + Notifications + Avatar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden lg:block w-56">
          <SearchBar />
        </div>
        <NotificationButton count={3} />
        <AvatarDropdown
          name={PLACEHOLDER_USER.name}
          email={PLACEHOLDER_USER.email}
          avatarUrl={PLACEHOLDER_USER.avatarUrl}
        />
      </div>
    </header>
  );
}
