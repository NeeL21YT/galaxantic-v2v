/**
 * lib/herlens/categories.ts
 *
 * Single source of truth for HerLens product categories and NewsData queries.
 */

import type { NewsCategory } from "@/types/dashboard";

export type HerLensCategory = Exclude<NewsCategory, "all">;

export interface HerLensCategoryConfig {
  id: HerLensCategory;
  label: string;
  query: string;
}

export const HERLENS_ARTICLES_PER_CATEGORY = 5;

export const HERLENS_CATEGORIES: HerLensCategoryConfig[] = [
  {
    id: "beauty-health",
    label: "Beauty & Wellness",
    query: "women beauty wellness health nutrition fitness mental health",
  },
  {
    id: "fashion-lifestyle",
    label: "Fashion & Lifestyle",
    query: "women fashion lifestyle style culture design",
  },
  {
    id: "career-finance",
    label: "Career, Business & Finance",
    query: "women career business startup finance leadership workplace",
  },
  {
    id: "education-stem",
    label: "Education & STEM",
    query: "women girls education STEM science technology engineering mathematics",
  },
  {
    id: "sports-entertainment",
    label: "Sports & Entertainment",
    query: "women sports entertainment film music media",
  },
  {
    id: "policy-leadership",
    label: "Policy, Leadership & Social Impact",
    query: "women policy politics leadership social impact rights",
  },
  {
    id: "parenting-family",
    label: "Parenting & Family Dynamics",
    query: "women mothers parents parenting family childcare caregiving",
  },
  {
    id: "travel-arts",
    label: "Travel, Arts & Culture",
    query: "women travel arts culture books heritage",
  },
];

export const HERLENS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  all: "All",
  "beauty-health": "Beauty & Wellness",
  "fashion-lifestyle": "Fashion & Lifestyle",
  "career-finance": "Career, Business & Finance",
  "education-stem": "Education & STEM",
  "sports-entertainment": "Sports & Entertainment",
  "policy-leadership": "Policy, Leadership & Social Impact",
  "parenting-family": "Parenting & Family Dynamics",
  "travel-arts": "Travel, Arts & Culture",
};

export function isHerLensCategory(value: string): value is HerLensCategory {
  return HERLENS_CATEGORIES.some((category) => category.id === value);
}
