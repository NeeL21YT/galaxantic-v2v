/**
 * app/dashboard/onboarding/page.tsx
 *
 * First-time onboarding page for new users.
 *
 * Server Component that:
 * 1. Fetches the user's profile server-side.
 * 2. Redirects to /dashboard if onboarding is already complete
 *    (handles direct navigation by an already-onboarded user).
 * 3. Renders the OnboardingWizard client component with the profile
 *    pre-populated so the wizard can show existing partial data.
 *
 * The proxy.ts onboarding guard handles the primary redirect for new
 * users. This page is the secondary safeguard.
 */

import { redirect } from "next/navigation";
import { getProfile } from "@/lib/db/profiles";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata = {
  title: "Set Up Your Profile - Herizon",
  description:
    "Complete your Herizon profile to unlock personalized career guidance, opportunities, and AI-powered tools.",
};

export default async function OnboardingPage() {
  const profile = await getProfile();

  // If no profile at all (shouldn't happen after auth callback), redirect to login
  if (!profile) {
    redirect("/login");
  }

  // If onboarding is already done, skip back to dashboard
  if (profile.onboarding_completed) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingWizard profile={profile} />
    </main>
  );
}
