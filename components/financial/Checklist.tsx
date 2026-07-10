/**
 * components/financial/Checklist.tsx
 *
 * Interactive checklist for the Action Plan (Step 7).
 * Local checked state managed in parent and passed down.
 */

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ActionPlanItem } from "@/types/dashboard";

interface ChecklistProps {
  items: ActionPlanItem[];
  onToggle: (id: string) => void;
}

export function Checklist({ items, onToggle }: ChecklistProps) {
  return (
    <ul className="flex flex-col gap-2" role="list">
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
          className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors duration-150"
          style={{
            background: item.checked ? "var(--color-champagne)" : "var(--color-surface)",
            border: item.checked
              ? "1px solid var(--color-rose-gold-light)"
              : "1px solid var(--color-border)",
          }}
          onClick={() => onToggle(item.id)}
          role="listitem"
        >
          {/* Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id);
            }}
            aria-checked={item.checked}
            role="checkbox"
            aria-label={item.label}
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 outline-none focus-visible:ring-2"
            style={{
              background: item.checked ? "var(--color-rose-gold)" : "transparent",
              border: item.checked
                ? "2px solid var(--color-rose-gold)"
                : "2px solid var(--color-border)",
            }}
          >
            {item.checked && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Check className="w-3 h-3 text-white" aria-hidden="true" />
              </motion.span>
            )}
          </button>

          {/* Content */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="text-sm font-medium leading-snug"
              style={{
                color: item.checked
                  ? "var(--color-text-muted)"
                  : "var(--color-text-primary)",
                textDecoration: item.checked ? "line-through" : "none",
              }}
            >
              {item.label}
            </span>
            {item.description && (
              <span
                className="text-xs leading-snug"
                style={{ color: "var(--color-text-muted)" }}
              >
                {item.description}
              </span>
            )}
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
