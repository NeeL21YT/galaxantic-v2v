/**
 * components/dashboard/SearchBar.tsx
 *
 * Placeholder search input for the dashboard navbar.
 */

"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search opportunities, skills…",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/dashboard/opportunities?search=${encodeURIComponent(query.trim())}`);
    }
  }

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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-9 pr-4 py-2 text-sm rounded-full outline-none transition-colors"
        style={{
          background: "var(--color-surface-hover)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-body)",
        }}
      />
    </div>
  );
}
