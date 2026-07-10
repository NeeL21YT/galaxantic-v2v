/**
 * app/dashboard/opportunities/page.tsx
 *
 * Opportunity Navigator - Server Component.
 * Fetches initial data server-side for fast first paint,
 * then hands off to OpportunitiesPageClient for interactivity.
 */

import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { OpportunitiesPageClient } from "./OpportunitiesPageClient";
import { getOpportunities, getSavedOpportunities } from "./actions";
import { DEFAULT_FILTERS } from "@/lib/opportunities/types";
import type { GetOpportunitiesResult } from "@/lib/opportunities/types";

export const metadata = {
  title: "Opportunities - Herizon",
  description:
    "AI-matched jobs, internships, fellowships and scholarships tailored to your profile and career goals.",
};

export default async function OpportunitiesPage() {
  // Load initial data server-side in parallel
  const [rawResult, savedOpportunities] = await Promise.all([
    getOpportunities(DEFAULT_FILTERS),
    getSavedOpportunities(),
  ]);

  const initialData: GetOpportunitiesResult | null =
    "success" in rawResult && !rawResult.success ? null : (rawResult as GetOpportunitiesResult);

  const totalMatched = initialData?.meta?.ranked ?? 0;
  const totalFiltered = initialData?.meta?.filtered ?? 0;

  return (
    <>
      <PageHeader
        title="Opportunity Navigator"
        subtitle={
          totalFiltered > 0
            ? `${totalMatched} AI-ranked matches · ${totalFiltered} opportunities in your filters`
            : "Discover AI-matched opportunities for your career stage and goals."
        }
      />

      <Suspense fallback={<OpportunitiesLoadingSkeleton />}>
        <OpportunitiesPageClient
          initialData={initialData}
          initialBookmarks={savedOpportunities}
        />
      </Suspense>
    </>
  );
}

/* ── Loading skeleton ────────────────────────────────────────── */

function OpportunitiesLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Search bar skeleton */}
      <div
        className="h-16 rounded-2xl skeleton-shimmer"
        style={{ border: "1px solid var(--color-border)" }}
      />
      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl skeleton-shimmer"
            style={{ height: 240, border: "1px solid var(--color-border)" }}
          />
        ))}
      </div>
    </div>
  );
}
