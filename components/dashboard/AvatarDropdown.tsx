/**
 * components/dashboard/AvatarDropdown.tsx
 *
 * User avatar with initials fallback and a simple dropdown menu.
 */

"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { ChevronDown, Settings, LogOut, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/supabase/actions";

interface AvatarDropdownProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AvatarDropdown({ name, email, avatarUrl }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full pr-2 py-1 pl-1 transition-colors duration-150"
        style={{
          background: open ? "var(--color-surface-hover)" : "transparent",
          border: "1px solid var(--color-border)",
        }}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Account menu"
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden"
          style={{ background: "var(--color-rose-gold)", color: "#fff" }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            getInitials(name)
          )}
        </div>
        <span
          className="text-xs font-medium hidden sm:block max-w-[80px] truncate"
          style={{ color: "var(--color-text-primary)" }}
        >
          {name.split(" ")[0]}
        </span>
        <ChevronDown
          className="w-3 h-3 hidden sm:block transition-transform duration-200"
          style={{
            color: "var(--color-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-lg)",
          }}
          role="menu"
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--color-border-light)" }}
          >
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
            >
              {name}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
              {email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {[
              { icon: <User className="w-4 h-4" />, label: "Profile", href: "/dashboard/settings" },
              { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                style={{ color: "var(--color-text-secondary)" }}
                role="menuitem"
              >
                <span style={{ color: "var(--color-text-muted)" }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <div
              className="my-1 border-t"
              style={{ borderColor: "var(--color-border-light)" }}
            />

            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 disabled:opacity-60"
              style={{ color: "#dc2626" }}
              onClick={() => {
                setOpen(false);
                startTransition(async () => {
                  await signOut();
                });
              }}
              disabled={isPending}
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              {isPending ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
