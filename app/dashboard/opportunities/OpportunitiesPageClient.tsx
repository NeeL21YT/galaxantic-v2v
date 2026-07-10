"use client";

/**
 * app/dashboard/opportunities/OpportunitiesPageClient.tsx
 *
 * Main client component for the Opportunity Navigator.
 *
 * Tabs:
 *   • Top Matches   - AI-ranked top 10 with full AI metadata
 *   • Browse All    - all deterministically filtered opportunities
 *   • Saved         - bookmarked opportunities
 *
 * Search: fast client-side using pre-built search index.
 * Filters: local for simple toggles; server re-rank for major changes.
 */

import {
  useState,
  useTransition,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Compass,
  Sparkles,
  Bookmark,
  LayoutGrid,
  X,
  MapPin,
  Calendar,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Wifi,
} from "lucide-react";
import { OpportunityCardEnhanced } from "@/components/opportunities/OpportunityCardEnhanced";
import {
  OpportunityFilters,
  countActiveFilters,
} from "@/components/opportunities/OpportunityFilters";
import {
  getOpportunities,
  bookmarkOpportunity,
  removeBookmark,
} from "./actions";
import type {
  RankedOpportunity,
  Opportunity,
  SearchIndexEntry,
  OpportunityFilters as FiltersType,
  GetOpportunitiesResult,
  OpportunityCategory,
} from "@/lib/opportunities/types";
import { DEFAULT_FILTERS } from "@/lib/opportunities/types";
import type { BookmarkRow } from "@/lib/opportunities/bookmark-helper";

/* ── Props ───────────────────────────────────────────────────── */

interface OpportunitiesPageClientProps {
  initialData: GetOpportunitiesResult | null;
  initialBookmarks: BookmarkRow[];
}

/* ── Tab type ────────────────────────────────────────────────── */

type Tab = "matches" | "browse" | "saved";

/* ── Component ───────────────────────────────────────────────── */

export function OpportunitiesPageClient({
  initialData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialBookmarks,
}: OpportunitiesPageClientProps) {
  /* State */
  const [activeTab, setActiveTab] = useState<Tab>("matches");
  const [filters, setFilters] = useState<FiltersType>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isRanking, startRanking] = useTransition();
  const [topMatches, setTopMatches] = useState<RankedOpportunity[]>(
    initialData?.topMatches ?? []
  );
  const [allFiltered, setAllFiltered] = useState<Opportunity[]>(
    initialData?.allFiltered ?? []
  );
  const [searchIndex, setSearchIndex] = useState<SearchIndexEntry[]>(
    initialData?.searchIndex ?? []
  );
  const [meta, setMeta] = useState(initialData?.meta ?? null);
  const [rankError, setRankError] = useState<string | null>(null);
  const [bookmarkSet, setBookmarkSet] = useState<Set<string>>(
    () => new Set(topMatches.filter((m) => m.isBookmarked).map((m) => m.opportunity.id))
  );

  /* Search index map for O(1) lookups */
  const searchMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const entry of searchIndex) m.set(entry.id, entry.searchText);
    return m;
  }, [searchIndex]);

  /* Derive countries for filter dropdown */
  const availableCountries = useMemo(() => {
    const s = new Set<string>();
    for (const opp of allFiltered) if (opp.country) s.add(opp.country);
    return [...s].sort();
  }, [allFiltered]);

  /* ── Client-side search ──────────────────────────────────────── */

  const q = searchQuery.toLowerCase().trim();

  function matchesSearch(opp: Opportunity): boolean {
    if (!q) return true;
    const indexed = searchMap.get(opp.id);
    if (indexed) return indexed.includes(q);
    // Fallback: inline search
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.organization.toLowerCase().includes(q) ||
      opp.category.toLowerCase().includes(q)
    );
  }

  /* ── Client-side filter on browse tab ───────────────────────── */

  const filteredBrowse = useMemo(() => {
    return allFiltered.filter((opp) => {
      if (!matchesSearch(opp)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(opp.category)) return false;
      if (filters.workMode === "remote" && !opp.remote) return false;
      if (filters.workMode === "hybrid" && !opp.hybrid) return false;
      if (filters.workMode === "onsite" && (opp.remote || opp.hybrid)) return false;
      if (filters.womenFocused && !opp.womenFocused) return false;
      if (filters.careerBreakFriendly && !opp.careerBreakFriendly) return false;
      if (filters.highMatchOnly) return false; // only applies to top matches
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFiltered, filters, q]);

  /* ── Filtered top matches ─────────────────────────────────────── */

  const filteredTopMatches = useMemo(() => {
    return topMatches.filter((item) => {
      if (!matchesSearch(item.opportunity)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(item.opportunity.category)) return false;
      if (filters.workMode === "remote" && !item.opportunity.remote) return false;
      if (filters.workMode === "hybrid" && !item.opportunity.hybrid) return false;
      if (filters.highMatchOnly && item.rank.matchScore < 70) return false;
      if (filters.womenFocused && !item.opportunity.womenFocused) return false;
      if (filters.careerBreakFriendly && !item.opportunity.careerBreakFriendly) return false;
      if (filters.bookmarkedOnly && !bookmarkSet.has(item.opportunity.id)) return false;
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topMatches, filters, q, bookmarkSet]);

  /* ── Re-rank on major filter change ─────────────────────────── */

  function handleFiltersChange(next: FiltersType) {
    setFilters(next);
    // Major filter changes that affect the dataset (not just display) trigger re-rank
    const majorChange =
      next.categories.join() !== filters.categories.join() ||
      next.workMode !== filters.workMode ||
      next.country !== filters.country ||
      next.educationLevel !== filters.educationLevel ||
      next.womenFocused !== filters.womenFocused ||
      next.careerBreakFriendly !== filters.careerBreakFriendly;

    if (majorChange) {
      setRankError(null);
      startRanking(async () => {
        const result = await getOpportunities(next);
        if ("success" in result && !result.success) {
          setRankError(result.error);
          return;
        }
        const data = result as GetOpportunitiesResult;
        setTopMatches(data.topMatches);
        setAllFiltered(data.allFiltered);
        setSearchIndex(data.searchIndex);
        setMeta(data.meta);
      });
    }
  }

  /* ── Bookmark toggle ─────────────────────────────────────────── */

  const handleBookmarkToggle = useCallback(
    async (opportunityId: string, shouldBookmark: boolean) => {
      // Optimistic update
      setBookmarkSet((prev) => {
        const next = new Set(prev);
        if (shouldBookmark) next.add(opportunityId);
        else next.delete(opportunityId);
        return next;
      });
      setTopMatches((prev) =>
        prev.map((m) =>
          m.opportunity.id === opportunityId ? { ...m, isBookmarked: shouldBookmark } : m
        )
      );

      if (shouldBookmark) {
        const item = topMatches.find((m) => m.opportunity.id === opportunityId);
        if (item) {
          await bookmarkOpportunity(item.opportunity, {
            rank: item.rank,
            rankingMeta: meta?.rankingMeta ?? null,
          });
        }
      } else {
        await removeBookmark(opportunityId);
      }
    },
    [topMatches, meta]
  );

  /* ── Active filter count ─────────────────────────────────────── */

  const activeFilterCount = countActiveFilters(filters);

  /* ── Tabs config ─────────────────────────────────────────────── */

  const TABS: Array<{ id: Tab; label: string; count: number; icon: typeof Sparkles }> = [
    { id: "matches", label: "Top Matches",  count: filteredTopMatches.length, icon: Sparkles   },
    { id: "browse",  label: "Browse All",   count: filteredBrowse.length,     icon: LayoutGrid },
    { id: "saved",   label: "Saved",        count: bookmarkSet.size,          icon: Bookmark   },
  ];

  /* ── Empty states ────────────────────────────────────────────── */

  const noDataset = meta?.total === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Search + Filter Bar ──────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--color-text-muted)" }}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search roles, organisations, skills…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pr-4 py-2 text-sm"
            style={{ paddingLeft: "2.25rem" }}
            aria-label="Search opportunities"
            id="opportunity-search"
          />
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl flex-shrink-0"
          style={{ background: "var(--color-surface-hover)" }}
          role="tablist"
          aria-label="Opportunity views"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150"
                style={
                  activeTab === tab.id
                    ? { background: "var(--color-surface)", color: "var(--color-rose-gold)", boxShadow: "var(--shadow-sm)" }
                    : { color: "var(--color-text-muted)" }
                }
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {tab.label}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: activeTab === tab.id ? "rgba(180,108,114,0.12)" : "var(--color-border)",
                    color: activeTab === tab.id ? "var(--color-rose-gold)" : "var(--color-text-muted)",
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="btn-base px-3 py-2 text-xs gap-1.5 flex-shrink-0"
          style={{
            background: showFilters || activeFilterCount > 0 ? "rgba(180,108,114,0.10)" : "var(--color-surface-hover)",
            color: showFilters || activeFilterCount > 0 ? "var(--color-rose-gold)" : "var(--color-text-secondary)",
            border: "1px solid var(--color-border-light)",
          }}
          aria-expanded={showFilters}
          aria-label={`${showFilters ? "Hide" : "Show"} filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ""}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ background: "var(--color-rose-gold)", color: "#fff" }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Filter panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="p-5 rounded-2xl"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <OpportunityFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableCountries={availableCountries}
                totalActive={activeFilterCount}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status bar ───────────────────────────────────────── */}
      {meta && (
        <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span>{meta.total} total opportunities</span>
          <span>·</span>
          <span>{meta.filtered} match your filters</span>
          {meta.fromCache && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1" style={{ color: "var(--color-rackley)" }}>
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                Cached ranking
              </span>
            </>
          )}
          {isRanking && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1" style={{ color: "var(--color-rose-gold)" }}>
                <RefreshCw className="w-3 h-3 animate-spin" aria-hidden="true" />
                Re-ranking…
              </span>
            </>
          )}
        </div>
      )}

      {/* ── Error banner ─────────────────────────────────────── */}
      {rankError && (
        <div
          className="flex items-center gap-3 p-4 rounded-2xl text-sm"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#dc2626" }}
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          {rankError}
          <button
            onClick={() => setRankError(null)}
            className="ml-auto"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── No dataset empty state ───────────────────────────── */}
      {noDataset && (
        <EmptyState
          icon={<Compass className="w-8 h-8" />}
          title="Dataset Loading Soon"
          description="The opportunity dataset is being prepared. Check back shortly - it will appear automatically once ready."
          actions={null}
        />
      )}

      {/* ── Tab content ──────────────────────────────────────── */}
      {!noDataset && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top Matches */}
            {activeTab === "matches" && (
              <>
                {filteredTopMatches.length === 0 ? (
                  <EmptyState
                    icon={<Sparkles className="w-8 h-8" />}
                    title={isRanking ? "Ranking opportunities…" : "No top matches yet"}
                    description={
                      isRanking
                        ? "Herizon AI is analysing your profile against the filtered opportunities."
                        : "Upload your resume to get AI-powered opportunity matches tailored to your profile."
                    }
                    actions={
                      !isRanking ? (
                        <a
                          href="/dashboard/resume"
                          className="btn-base px-5 py-2.5 text-sm"
                          style={{ background: "var(--color-rose-gold)", color: "#fff" }}
                        >
                          Upload Resume
                        </a>
                      ) : null
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTopMatches.map((item, i) => (
                      <OpportunityCardEnhanced
                        key={item.opportunity.id}
                        item={{ ...item, isBookmarked: bookmarkSet.has(item.opportunity.id) }}
                        index={i}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Browse All */}
            {activeTab === "browse" && (
              <>
                {filteredBrowse.length === 0 ? (
                  <EmptyState
                    icon={<LayoutGrid className="w-8 h-8" />}
                    title="No opportunities found"
                    description="Try adjusting your filters or search query."
                    actions={null}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBrowse.map((opp, i) => (
                      <BrowseCard
                        key={opp.id}
                        opportunity={opp}
                        index={i}
                        isBookmarked={bookmarkSet.has(opp.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                        aiRank={topMatches.find((m) => m.opportunity.id === opp.id)?.rank ?? null}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Saved / Bookmarks */}
            {activeTab === "saved" && (
              <>
                {bookmarkSet.size === 0 ? (
                  <EmptyState
                    icon={<Bookmark className="w-8 h-8" />}
                    title="No saved opportunities"
                    description="Bookmark opportunities from the Top Matches or Browse All tabs to save them here."
                    actions={null}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topMatches
                      .filter((m) => bookmarkSet.has(m.opportunity.id))
                      .map((item, i) => (
                        <OpportunityCardEnhanced
                          key={item.opportunity.id}
                          item={{ ...item, isBookmarked: true }}
                          index={i}
                          onBookmarkToggle={handleBookmarkToggle}
                        />
                      ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Footer CTA ───────────────────────────────────────── */}
      {!noDataset && (
        <div
          className="mt-2 p-5 rounded-2xl text-center"
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
            <a
              href="/dashboard/resume"
              className="btn-base px-4 py-2 text-xs"
              style={{ background: "var(--color-rose-gold)", color: "#fff" }}
            >
              Update Resume
            </a>
            <a
              href="/dashboard/ai-coach"
              className="btn-base px-4 py-2 text-xs"
              style={{ background: "var(--color-surface-hover)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
            >
              Get AI Recommendations
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Browse Card (no AI ranking) ─────────────────────────────── */

interface BrowseCardProps {
  opportunity: Opportunity;
  index: number;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string, shouldBookmark: boolean) => Promise<void>;
  aiRank: RankedOpportunity["rank"] | null;
}

function BrowseCard({ opportunity, index, isBookmarked, onBookmarkToggle, aiRank }: BrowseCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [pending, startPending] = useTransition();

  // Capture timestamp once at component mount via lazy useState initializer
  const [mountTime] = useState<number>(() => Date.now());
  const daysLeft = Math.ceil(
    (new Date(opportunity.deadline).getTime() - mountTime) / (1000 * 60 * 60 * 24)
  );

  const CATEGORY_COLOR: Record<OpportunityCategory, { bg: string; text: string }> = {
    job:         { bg: "rgba(94,123,155,0.12)",  text: "var(--color-rackley)"   },
    internship:  { bg: "rgba(34,197,94,0.10)",   text: "#16a34a"                },
    scholarship: { bg: "rgba(245,158,11,0.10)",  text: "#d97706"                },
    fellowship:  { bg: "rgba(180,108,114,0.10)", text: "var(--color-rose-gold)" },
    hackathon:   { bg: "rgba(168,85,247,0.10)",  text: "#9333ea"                },
    competition: { bg: "rgba(239,68,68,0.10)",   text: "#dc2626"                },
  };
  const catStyle = CATEGORY_COLOR[opportunity.category] ?? CATEGORY_COLOR.job;

  function handleBookmark() {
    const next = !bookmarked;
    setBookmarked(next);
    startPending(() => onBookmarkToggle(opportunity.id, next));
  }

  const deadlineLabel =
    daysLeft <= 0
      ? "Expired"
      : daysLeft <= 7
      ? `${daysLeft}d left`
      : new Date(opportunity.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)" }}
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
            style={{ background: catStyle.bg, color: catStyle.text }}
          >
            {opportunity.category}
          </span>
          <p
            className="text-sm font-semibold leading-tight mt-1 line-clamp-2"
            style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}
          >
            {opportunity.title}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
            {opportunity.organization}
          </p>
        </div>
        <button
          type="button"
          onClick={handleBookmark}
          disabled={pending}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            background: bookmarked ? "rgba(180,108,114,0.12)" : "var(--color-surface-hover)",
            color: bookmarked ? "var(--color-rose-gold)" : "var(--color-text-muted)",
          }}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" aria-hidden="true" />
          {opportunity.location}
        </span>
        {opportunity.remote && (
          <span className="flex items-center gap-1" style={{ color: "#16a34a" }}>
            <Wifi className="w-3 h-3" aria-hidden="true" />
            Remote
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          {deadlineLabel}
        </span>
      </div>

      {aiRank && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${aiRank.matchScore}%`, background: "var(--color-rose-gold)" }}
            />
          </div>
          <span className="text-xs font-semibold flex-shrink-0" style={{ color: "var(--color-rose-gold)" }}>
            {aiRank.matchScore}% match
          </span>
        </div>
      )}

      <a
        href={opportunity.applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          // TODO: log analytics event: opportunity_opened
        }}
        className="btn-base w-full py-2 text-xs gap-1.5 mt-auto"
        style={{ background: "var(--color-rose-gold)", color: "#fff", borderRadius: "var(--radius-full)" }}
        aria-label={`Apply to ${opportunity.title}`}
      >
        Apply Now
        <ExternalLink className="w-3 h-3" aria-hidden="true" />
      </a>
    </motion.div>
  );
}

/* ── Empty state ─────────────────────────────────────────────── */

function EmptyState({
  icon,
  title,
  description,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actions: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(180,108,114,0.04) 0%, rgba(94,123,155,0.04) 100%)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(180,108,114,0.10)", color: "var(--color-rose-gold)" }}>
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: "var(--color-puce-red)", fontFamily: "var(--font-heading)" }}>
        {title}
      </h3>
      <p className="text-sm max-w-sm" style={{ color: "var(--color-text-muted)" }}>
        {description}
      </p>
      {actions && <div className="mt-5">{actions}</div>}
    </div>
  );
}
