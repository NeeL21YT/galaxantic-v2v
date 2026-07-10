/**
 * components/dashboard/layout/DashboardShell.tsx
 *
 * Client Component wrapper for the dashboard layout.
 *
 * Extracted from app/dashboard/layout.tsx so the layout can be an
 * async Server Component (to fetch the authenticated user) while still
 * supporting the useState-based mobile drawer toggle.
 *
 * Receives userName and userEmail from the server layout and passes them
 * down to DashboardNavbar and AvatarDropdown - no client-side auth state
 * required.
 */

"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/layout/DashboardNavbar";
import { MobileSidebarDrawer } from "@/components/dashboard/layout/MobileSidebarDrawer";
import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
  userName: string;
  userEmail: string;
}

export function DashboardShell({ children, userName, userEmail }: DashboardShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--color-background)" }}
    >
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      {/* Mobile Drawer */}
      <MobileSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardNavbar
          onMenuClick={() => setDrawerOpen(true)}
          userName={userName}
          userEmail={userEmail}
        />

        {/* Scrollable main content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--color-background)" }}
          id="main-content"
          tabIndex={-1}
          aria-label="Main content"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
