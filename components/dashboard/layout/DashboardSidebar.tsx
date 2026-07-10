/**
 * components/dashboard/layout/DashboardSidebar.tsx
 *
 * Desktop sidebar for the dashboard. Collapses to icon-only on md breakpoint.
 */

"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Map,
  Compass,
  Bot,
  Eye,
  PiggyBank,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { SidebarItem } from "./SidebarItem";

const NAV_ITEMS = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/dashboard/career-break", icon: <Briefcase />, label: "Career Break" },
  { href: "/dashboard/resume", icon: <FileText />, label: "Resume" },
  { href: "/dashboard/roadmap", icon: <Map />, label: "Roadmap" },
  { href: "/dashboard/opportunities", icon: <Compass />, label: "Opportunities" },
  { href: "/dashboard/ai-coach", icon: <Bot />, label: "AI Coach" },
  { href: "/dashboard/herlens", icon: <Eye />, label: "HerLens" },
  { href: "/dashboard/financial-compass", icon: <PiggyBank />, label: "Financial Compass" },
];

const BOTTOM_ITEMS = [
  { href: "/dashboard/settings", icon: <Settings />, label: "Settings" },
];

interface DashboardSidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

export function DashboardSidebar({ onCollapseChange }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    onCollapseChange?.(next);
  }

  return (
    <aside
      className="hidden md:flex flex-col h-full relative transition-all duration-300"
      style={{
        width: collapsed ? "68px" : "256px",
        background: "var(--color-puce-red-dark)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
      aria-label="Dashboard navigation"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-4 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", minHeight: "68px" }}
      >
        {collapsed ? (
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: "var(--color-rose-gold)", color: "#fff" }}
            aria-label="Herizon"
          >
            H
          </span>
        ) : (
          <Logo light={true} />
        )}
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3.5 top-[86px] w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors duration-150"
        style={{
          background: "var(--color-puce-red-dark)",
          border: "1.5px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto" aria-label="Main navigation">
        {!collapsed && (
          <p
            className="text-[10px] font-semibold uppercase tracking-widest px-3 pb-2"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Menu
          </p>
        )}
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div
        className="px-3 py-4 flex flex-col gap-1 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {BOTTOM_ITEMS.map((item) => (
          <SidebarItem key={item.href} {...item} collapsed={collapsed} />
        ))}

        {/* Logout placeholder */}
        <button
          type="button"
          className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full"
          style={{
            color: "rgba(255,255,255,0.45)",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onClick={() => {
            // TODO Stage 2: implement Supabase sign-out
          }}
          title={collapsed ? "Sign Out" : undefined}
          aria-label="Sign out"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span className="leading-none">Sign Out</span>}
          {collapsed && (
            <span
              className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
              style={{ background: "#1a0e10", color: "#fff" }}
              role="tooltip"
            >
              Sign Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
