/**
 * types/dashboard.ts
 * TypeScript types for all dashboard entities (Stage 1B).
 */

import type { ReactNode } from "react";

/* ── User ───────────────────────────────────────────────────── */

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  joinedAt: string;
  careerReadiness: number; // 0–100
}

/* ── Opportunities ──────────────────────────────────────────── */

export type OpportunityType =
  | "job"
  | "internship"
  | "scholarship"
  | "fellowship"
  | "hackathon"
  | "grant";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: OpportunityType;
  matchPercent: number;
  deadline: string;
  isBookmarked: boolean;
  logoPlaceholder: ReactNode; // Lucide icon component
  tags: string[];
}

/* ── Roadmap ────────────────────────────────────────────────── */

export type MilestoneStatus = "completed" | "in-progress" | "upcoming";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  phase: 30 | 60 | 90;
  tasks: string[];
}

/* ── Resume ─────────────────────────────────────────────────── */

export interface ResumeItem {
  id: string;
  filename: string;
  uploadedAt: string;
  score: number; // 0–100
  suggestions: string[];
  status: "analyzed" | "processing" | "pending";
}

/* ── Chat ───────────────────────────────────────────────────── */

export type MessageSender = "user" | "ai";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
}

/* ── Activity ───────────────────────────────────────────────── */

export interface ActivityItem {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  time: string;
}

/* ── Skill Gap ──────────────────────────────────────────────── */

export interface SkillGap {
  skill: string;
  current: number; // 0–100
  target: number;
  priority: "high" | "medium" | "low";
}

/* ── Settings ───────────────────────────────────────────────── */

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

/* ── HerLens ─────────────────────────────────────────────────── */

export type NewsCategory =
  | "all"
  | "beauty-health"
  | "fashion-lifestyle"
  | "career-finance"
  | "education-stem"
  | "sports-entertainment"
  | "policy-leadership"
  | "parenting-family"
  | "travel-arts";

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  headline: string;
  publishedTime: string;
  summary: string; // ≤90 words
  detailedSummary: string;
  keyTakeaways: string[];
  sourceName: string;
  sourceUrl: string; // placeholder "#"
}

/* ── Financial Compass ──────────────────────────────────────── */

export type FinancialGoalType =
  | "higher-education"
  | "emergency-fund"
  | "start-business"
  | "buy-laptop"
  | "home"
  | "vehicle"
  | "other";

export type EmploymentType = "student" | "working" | "freelancer" | "business";

export interface FinancialFormData {
  // Step 1
  monthlyIncome: string;
  employmentType: EmploymentType | "";
  currentSavings: string;
  monthlyExpenses: string;
  // Step 2
  goal: FinancialGoalType | "";
  // Step 3 - generic
  goalDetails: string;
  // Step 3 - business specific
  businessIdea: string;
  businessLocation: string;
  education: string;
  currentSkills: string;
  businessExperience: string;
  expectedInvestment: string;
}

export interface BudgetAllocation {
  label: string;
  percent: number;
  amount: string;
  color: string;
  description: string;
}

export interface FinancialRecommendation {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface ActionPlanItem {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
}

export interface BusinessPlanCard {
  id: string;
  label: string;
  value: string;
  icon: ReactNode;
  description?: string;
}

