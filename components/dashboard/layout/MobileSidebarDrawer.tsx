/**
 * components/dashboard/layout/MobileSidebarDrawer.tsx
 *
 * Full-screen drawer for the sidebar on mobile/tablet viewports.
 */

"use client";

import { useEffect } from "react";
import { X, LayoutDashboard, Briefcase, FileText, Map, Compass, Bot, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import { SidebarItem } from "./SidebarItem";

const NAV_ITEMS = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/dashboard/career-break", icon: <Briefcase />, label: "Career Break" },
  { href: "/dashboard/resume", icon: <FileText />, label: "Resume" },
  { href: "/dashboard/roadmap", icon: <Map />, label: "Roadmap" },
  { href: "/dashboard/opportunities", icon: <Compass />, label: "Opportunities" },
  { href: "/dashboard/ai-coach", icon: <Bot />, label: "AI Coach" },
  { href: "/dashboard/settings", icon: <Settings />, label: "Settings" },
];

interface MobileSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebarDrawer({ open, onClose }: MobileSidebarDrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 flex flex-col md:hidden w-72"
            style={{
              background: "var(--color-puce-red-dark)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
            aria-label="Mobile navigation"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <Logo light={true} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest px-3 pb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Menu
              </p>
              {NAV_ITEMS.map((item) => (
                <SidebarItem key={item.href} {...item} onClick={onClose} />
              ))}
            </nav>

            {/* Logout */}
            <div
              className="px-4 py-4 border-t"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium w-full transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.45)" }}
                onClick={() => {
                  onClose();
                  // TODO Stage 2: implement Supabase sign-out
                }}
                aria-label="Sign out"
              >
                <LogOut className="w-4.5 h-4.5 flex-shrink-0" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
