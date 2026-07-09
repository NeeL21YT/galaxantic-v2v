/**
 * app/dashboard/layout.tsx
 *
 * Root layout for all dashboard pages.
 * Provides: DashboardSidebar (desktop) + DashboardNavbar + MobileSidebarDrawer
 */

"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar";
import { DashboardNavbar } from "@/components/dashboard/layout/DashboardNavbar";
import { MobileSidebarDrawer } from "@/components/dashboard/layout/MobileSidebarDrawer";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
        <DashboardNavbar onMenuClick={() => setDrawerOpen(true)} />

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
