/**
 * app/dashboard/settings/page.tsx
 *
 * Settings - Profile, Notifications, Security, Preferences, Danger Zone.
 *
 * Server Component wrapper - fetches the real user email and passes it
 * to the client shell so the delete confirmation can verify it.
 */

import { getProfile } from "@/lib/db/profiles";
import { getUser } from "@/lib/supabase/server";
import { SettingsPageClient } from "@/components/dashboard/SettingsPageClient";

export const metadata = {
  title: "Settings - Herizon",
};

export default async function SettingsPage() {
  const [profile, user] = await Promise.all([getProfile(), getUser()]);

  const userEmail = profile?.email || user?.email || "";
  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return <SettingsPageClient userEmail={userEmail} userName={userName} />;
}
