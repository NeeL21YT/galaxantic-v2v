/**
 * app/dashboard/opportunities/page.tsx
 *
 * Opportunity Navigator — grid of curated career opportunities.
 */

import { Compass, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { OpportunityCard } from "@/components/dashboard/OpportunityCard";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_OPPORTUNITIES } from "@/lib/data/placeholder";
import type { OpportunityType } from "@/types/dashboard";

export const metadata = {
  title: "Opportunities — Herizon",
  description: "Curated jobs, internships, fellowships and scholarships matched to your profile.",
};

const FILTERS: Array<{ label: string; value: OpportunityType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Jobs", value: "job" },
  { label: "Internships", value: "internship" },
  { label: "Fellowships", value: "fellowship" },
  { label: "Scholarships", value: "scholarship" },
  { label: "Hackathons", value: "hackathon" },
];

export default function OpportunitiesPage() {
  return (
    <>
      <PageHeader
        title="Opportunity Navigator"
        subtitle={`${PLACEHOLDER_OPPORTUNITIES.length} opportunities matched to your profile.`}
        action={
          <Button variant="secondary" size="sm">
            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
            Filters
          </Button>
        }
      />

      {/* Search + Filter Bar */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 p-4 rounded-2xl"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex-1 w-full sm:max-w-xs">
          <SearchBar placeholder="Search roles, companies, skills…" />
        </div>

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by opportunity type">
          {FILTERS.map((f, i) => (
            <button
              key={f.value}
              type="button"
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-150"
              style={{
                background: i === 0 ? "var(--color-rose-gold)" : "var(--color-surface-hover)",
                color: i === 0 ? "#fff" : "var(--color-text-secondary)",
                border: "1px solid var(--color-border-light)",
              }}
              aria-pressed={i === 0}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLACEHOLDER_OPPORTUNITIES.map((opp, i) => (
          <OpportunityCard key={opp.id} opportunity={opp} index={i} />
        ))}
      </div>

      {/* Bottom info */}
      <div
        className="mt-8 p-5 rounded-2xl text-center"
        style={{
          background: "linear-gradient(135deg, rgba(180,108,114,0.07) 0%, rgba(94,123,155,0.07) 100%)",
          border: "1px solid var(--color-border-light)",
        }}
      >
        <Compass className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--color-rose-gold)" }} aria-hidden="true" />
        <p className="text-sm font-semibold" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
          More opportunities unlocked daily
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
          Update your profile and resume to improve match accuracy.
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Button href="/dashboard/resume" variant="primary" size="sm">Update Resume</Button>
          <Button href="/dashboard/ai-coach" variant="outline" size="sm">Get AI Recommendations</Button>
        </div>
      </div>
    </>
  );
}
