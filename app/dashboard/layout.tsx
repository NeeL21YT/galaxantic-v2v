/**
 * app/dashboard/layout.tsx
 *
 * Root layout for all dashboard pages.
 *
 * Async Server Component — fetches the authenticated user server-side once
 * at the layout level. All dashboard pages nested under this layout
 * inherit the user data via props, keeping client-side auth state
 * unnecessary and the architecture clean for future stages.
 *
 * Route protection is handled by middleware.ts. This layout provides a
 * second layer of defence — if getUser() returns null here (edge case
 * where middleware was bypassed), the user sees an empty name gracefully.
 *
 * Provides: DashboardSidebar (desktop) + DashboardNavbar + MobileSidebarDrawer
 */

import { getUser } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/layout/DashboardShell";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getUser();

  // Extract display name from user metadata, fallback to email prefix.
  const fullName: string =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "User";

  const email: string = user?.email ?? "";

  return (
    <DashboardShell userName={fullName} userEmail={email}>
      {children}
    </DashboardShell>
  );
}
