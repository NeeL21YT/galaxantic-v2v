/**
 * components/dashboard/SearchBar.tsx
 *
 * Placeholder search input for the dashboard navbar.
 */

"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search opportunities, skills…",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: "var(--color-text-muted)" }}
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder={placeholder}
        aria-label="Search"
        readOnly
        className="w-full pl-9 pr-4 py-2 text-sm rounded-full outline-none cursor-text"
        style={{
          background: "var(--color-surface-hover)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-body)",
        }}
        onFocus={(e) => {
          // TODO Stage 2: implement real search
          e.target.blur();
        }}
      />
    </div>
  );
}
