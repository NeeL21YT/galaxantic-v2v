/**
 * components/onboarding/ChipSelector.tsx
 *
 * Multi-select chip grid for picking skills and interests.
 * Chips toggle on/off. Selected state is highlighted with brand colors.
 */

"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelect?: number;
  /** Accessible label for the group */
  label: string;
}

export function ChipSelector({
  options,
  selected,
  onChange,
  maxSelect,
  label,
}: ChipSelectorProps) {
  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      if (maxSelect && selected.length >= maxSelect) return;
      onChange([...selected, option]);
    }
  }

  return (
    <fieldset className="border-none p-0 m-0">
      <legend className="sr-only">{label}</legend>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={label}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium",
                "transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-offset-1"
              )}
              style={{
                background: isSelected
                  ? "var(--color-puce-red)"
                  : "var(--color-champagne)",
                color: isSelected ? "#fff" : "var(--color-text-secondary)",
                border: isSelected
                  ? "1.5px solid var(--color-puce-red)"
                  : "1.5px solid var(--color-border)",
                boxShadow: isSelected
                  ? "0 2px 8px rgba(110,46,52,0.18)"
                  : "none",
                transform: isSelected ? "translateY(-1px)" : "none",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ["--tw-ring-color" as any]: "var(--color-rose-gold)",
              }}
            >
              {isSelected && (
                <Check className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              )}
              {option}
            </button>
          );
        })}
      </div>
      {maxSelect && (
        <p
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {selected.length}/{maxSelect} selected
        </p>
      )}
    </fieldset>
  );
}
