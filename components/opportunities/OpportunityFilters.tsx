"use client";

/**
 * components/opportunities/OpportunityFilters.tsx
 *
 * Filter panel for the Opportunity Navigator.
 * Renders as collapsible pill groups.
 * All state is lifted to the parent via onFiltersChange.
 */

import { X } from "lucide-react";
import type { OpportunityFilters, OpportunityCategory, WorkMode } from "@/lib/opportunities/types";
import { DEFAULT_FILTERS } from "@/lib/opportunities/types";

interface OpportunityFiltersProps {
  filters: OpportunityFilters;
  onFiltersChange: (filters: OpportunityFilters) => void;
  availableCountries?: string[];
  totalActive: number;
}

const CATEGORIES: Array<{ value: OpportunityCategory; label: string }> = [
  { value: "job",         label: "Jobs"         },
  { value: "internship",  label: "Internships"  },
  { value: "scholarship", label: "Scholarships" },
  { value: "hackathon",   label: "Hackathons"   },
  { value: "fellowship",  label: "Fellowships"  },
  { value: "competition", label: "Competitions" },
];

const WORK_MODES: Array<{ value: WorkMode; label: string }> = [
  { value: "remote", label: "Remote"  },
  { value: "hybrid", label: "Hybrid"  },
  { value: "onsite", label: "On-site" },
];

export function OpportunityFilters({
  filters,
  onFiltersChange,
  availableCountries = [],
  totalActive,
}: OpportunityFiltersProps) {
  function toggleCategory(cat: OpportunityCategory) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFiltersChange({ ...filters, categories: next });
  }

  function setWorkMode(mode: WorkMode | null) {
    onFiltersChange({ ...filters, workMode: filters.workMode === mode ? null : mode });
  }

  function toggle(key: keyof Pick<OpportunityFilters, "womenFocused" | "careerBreakFriendly" | "hideExpired" | "highMatchOnly" | "bookmarkedOnly">) {
    onFiltersChange({ ...filters, [key]: !filters[key] });
  }

  function reset() {
    onFiltersChange(DEFAULT_FILTERS);
  }

  const pillBase = "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border cursor-pointer";
  const pillActive = { background: "var(--color-rose-gold)", color: "#fff", borderColor: "var(--color-rose-gold)" };
  const pillInactive = { background: "var(--color-surface-hover)", color: "var(--color-text-secondary)", borderColor: "var(--color-border-light)" };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          Filters {totalActive > 0 && `(${totalActive} active)`}
        </p>
        {totalActive > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-xs flex items-center gap-1 transition-colors"
            style={{ color: "var(--color-rose-gold)" }}
            aria-label="Clear all filters"
          >
            <X className="w-3 h-3" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="text-[11px] font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          Category
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => {
            const active = filters.categories.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                className={pillBase}
                style={active ? pillActive : pillInactive}
                aria-pressed={active}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <p className="text-[11px] font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          Work Mode
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by work mode">
          {WORK_MODES.map((mode) => {
            const active = filters.workMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setWorkMode(mode.value)}
                className={pillBase}
                style={active ? pillActive : pillInactive}
                aria-pressed={active}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Country */}
      {availableCountries.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
            Country
          </p>
          <select
            value={filters.country ?? ""}
            onChange={(e) => onFiltersChange({ ...filters, country: e.target.value || null })}
            className="input-base text-xs py-2"
            style={{ fontSize: "0.75rem" }}
            aria-label="Filter by country"
          >
            <option value="">All countries</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Toggle filters */}
      <div className="flex flex-col gap-2">
        {([
          { key: "womenFocused",        label: "Women-focused only"      },
          { key: "careerBreakFriendly", label: "Career-break friendly"   },
          { key: "highMatchOnly",       label: "High match only (≥70%)"  },
          { key: "hideExpired",         label: "Hide expired"            },
          { key: "bookmarkedOnly",      label: "Bookmarked only"         },
        ] as const).map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span
              onClick={() => toggle(key)}
              role="checkbox"
              aria-checked={filters[key]}
              tabIndex={0}
              onKeyDown={(e) => e.key === " " && toggle(key)}
              className="w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0"
              style={{
                background: filters[key] ? "var(--color-rose-gold)" : "var(--color-border)",
              }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200"
                style={{
                  background: "#fff",
                  left: filters[key] ? "calc(100% - 1.125rem)" : "0.125rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
              />
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

/** Returns the count of active (non-default) filter options */
export function countActiveFilters(filters: OpportunityFilters): number {
  let count = 0;
  if (filters.categories.length > 0) count++;
  if (filters.workMode !== null) count++;
  if (filters.country !== null) count++;
  if (filters.educationLevel !== null) count++;
  if (filters.womenFocused) count++;
  if (filters.careerBreakFriendly) count++;
  if (!filters.hideExpired) count++;   // default is true, so deviation = active filter
  if (filters.highMatchOnly) count++;
  if (filters.bookmarkedOnly) count++;
  return count;
}
