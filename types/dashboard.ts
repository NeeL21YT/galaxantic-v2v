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
  sourceUrl: string;
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

export type EmploymentType = "student" | "working" | "freelancer" | "business" | "other";

export interface FinancialFormData {
  // Step 1
  monthlyIncome: string;
  employmentType: EmploymentType | "";
  customEmploymentType: string; // used when employmentType === "other"
  currentSavings: string;
  monthlyExpenses: string;
  // Step 2
  goal: FinancialGoalType | "";
  customGoal: string; // used when goal === "other"
  // Step 3 - generic
  goalDetails: string;
  targetAmount: string;
  targetTimeline: string;
  additionalNotes: string;
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
  phase?: "30" | "60" | "90";
}

export interface BusinessPlanCard {
  id: string;
  label: string;
  value: string;
  icon: ReactNode;
  description?: string;
}

/* ── Financial Plan Result (Stage 2G) ───────────────────────── */

export interface BudgetBreakdown {
  label: string;
  percent: number;       // e.g. 50
  amount: number;        // raw INR e.g. 25000
  color: string;
  description: string;
}

export interface FinancialHealthInputs {
  savingsRate: number;           // 0-100
  expenseRatio: number;          // 0-100
  emergencyFundProgress: number; // 0-100 (current savings vs 6x expenses)
  goalDifficultyScore: number;   // 0-100 (how hard is the goal)
  incomeStabilityScore: number;  // 0-100 (based on employment type)
  disposableIncomeRatio: number; // 0-100 (disposable / income)
}

export interface CalculatedMetrics {
  disposableIncome: number;
  savingsRate: number;
  expenseRatio: number;
  emergencyFundTarget: number;
  emergencyFundProgress: number; // percentage of target covered by current savings
  monthlyGoalContribution: number;
  estimatedGoalCompletionMonths: number | null;
  goalReachable: boolean;
  financialHealthScore: number;
  financialHealthGrade: "Excellent" | "Good" | "Fair" | "Needs Improvement";
  budgetBreakdown: BudgetBreakdown[];
  inputs: FinancialHealthInputs;
}

export interface FinancialGeminiAnalysis {
  financialHealth: {
    score: number;
    grade: string;
    summary: string;
  };
  analysis: {
    income: string;
    expenses: string;
    savings: string;
    goal: string;
  };
  recommendations: string[];
  budgetInsights: string[];
  riskFactors: string[];
  actionPlan: {
    "30Days": string[];
    "60Days": string[];
    "90Days": string[];
  };
  careerInvestment: string[];
  learningSuggestions: string[];
  motivationalSummary: string;
}

export interface FinancialPlanMeta {
  generated_at: string;
  model_used: string;
  calculation_version: string;
  prompt_version: string;
  processing_time_ms: number;
}

export interface FinancialPlanResult {
  id: string;
  inputHash: string;
  userInputs: {
    monthlyIncome: number;
    monthlyExpenses: number;
    currentSavings: number;
    employmentType: string;
    goal: string;
    goalDetails: string;
    targetAmount: number;
    targetTimeline: string;
    additionalNotes: string;
  };
  calculatedMetrics: CalculatedMetrics;
  aiAnalysis: FinancialGeminiAnalysis;
  meta: FinancialPlanMeta;
  updatedAt: string;
}
