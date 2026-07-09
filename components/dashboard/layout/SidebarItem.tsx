/**
 * components/dashboard/layout/SidebarItem.tsx
 *
 * A single navigation item in the dashboard sidebar.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SidebarItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  /** Sidebar is in collapsed (icon-only) mode */
  collapsed?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ href, icon, label, collapsed = false, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <motion.div whileHover={{ x: collapsed ? 0 : 2 }} transition={{ duration: 0.15 }}>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          collapsed ? "justify-center" : ""
        )}
        style={{
          background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
          color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
        }}
        aria-current={isActive ? "page" : undefined}
        title={collapsed ? label : undefined}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
            style={{ background: "var(--color-rose-gold-light)" }}
            aria-hidden="true"
          />
        )}

        {/* Icon */}
        <span
          className="flex-shrink-0 [&>svg]:w-4.5 [&>svg]:h-4.5 w-4.5 h-4.5"
          style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}
          aria-hidden="true"
        >
          {icon}
        </span>

        {/* Label */}
        {!collapsed && (
          <span className="leading-none truncate">{label}</span>
        )}

        {/* Tooltip for collapsed mode */}
        {collapsed && (
          <span
            className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
            style={{ background: "#1a0e10", color: "#fff" }}
            role="tooltip"
          >
            {label}
          </span>
        )}
      </Link>
    </motion.div>
  );
}
