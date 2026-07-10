/**
 * app/dashboard/layout.tsx
 *
 * Root layout for all dashboard pages.
 *
 * Async Server Component — fetches the user profile server-side once
 * at the layout level. All dashboard pages nested under this layout
 * inherit user data via props, keeping client-side auth state
 * unnecessary and the architecture clean.
 *
 * Route protection is handled by proxy.ts. This layout provides a
 * second layer of defence — if getUser() returns null here (edge case
 * where proxy was bypassed), the user sees an empty name gracefully.
 *
 * Provides: DashboardSidebar (desktop) + DashboardNavbar + MobileSidebarDrawer
 */

import { getProfile } from "@/lib/db/profiles";
import { getUser } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Prefer profile.full_name (user-submitted during onboarding).
  // Fall back to auth user metadata, then email prefix.
  const [profile, user] = await Promise.all([getProfile(), getUser()]);

  const fullName: string =
    profile?.full_name?.trim() ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "User";

  const email: string = profile?.email || user?.email || "";

  return (
    <DashboardShell userName={fullName} userEmail={email}>
      {children}
    </DashboardShell>
  );
}
