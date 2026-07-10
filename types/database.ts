/**
 * types/database.ts
 *
 * TypeScript types mirroring the Supabase database schema.
 *
 * Rules:
 * - Each type maps 1:1 to a database table row.
 * - `Insert` and `Update` variants omit auto-generated fields
 *   (id, created_at, updated_at) so callers only pass what they own.
 * - No business logic here — pure data shapes.
 */

/* ── profiles ──────────────────────────────────────────────── */

export type EducationLevel =
  | "high_school"
  | "diploma"
  | "undergraduate"
  | "postgraduate"
  | "phd"
  | "other";

export type CareerStage =
  | "student"
  | "career_break"
  | "working"
  | "freelancer"
  | "entrepreneur";

export interface Profile {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string | null;
  education_level: EducationLevel | null;
  career_stage: CareerStage | null;
  location: string | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

/** Fields required to create a new profile row */
export interface ProfileInsert {
  auth_user_id: string;
  email: string;
  full_name?: string | null;
}

/** Fields that can be updated during onboarding or settings */
export interface ProfileUpdate {
  full_name?: string | null;
  education_level?: EducationLevel | null;
  career_stage?: CareerStage | null;
  location?: string | null;
  bio?: string | null;
  skills?: string[];
  interests?: string[];
  onboarding_completed?: boolean;
}

/* ── resumes ────────────────────────────────────────────────── */

export type AnalysisStatus = "pending" | "processing" | "analyzed" | "failed";

export interface Resume {
  id: string;
  user_id: string;
  file_name: string | null;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  analysis_status: AnalysisStatus;
  resume_score: number | null;
  uploaded_at: string | null;
  created_at: string;
}

export interface ResumeInsert {
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at?: string;
}

/* ── career_roadmaps ────────────────────────────────────────── */

export interface CareerRoadmap {
  id: string;
  user_id: string;
  goal: string | null;
  current_stage: string | null;
  roadmap_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CareerRoadmapInsert {
  user_id: string;
  goal?: string;
  current_stage?: string;
  roadmap_json?: Record<string, unknown>;
}

/* ── saved_opportunities ────────────────────────────────────── */

export type OpportunityCategory =
  | "job"
  | "scholarship"
  | "hackathon"
  | "fellowship"
  | "grant"
  | "internship";

export interface SavedOpportunity {
  id: string;
  user_id: string;
  title: string | null;
  organization: string | null;
  category: OpportunityCategory | null;
  deadline: string | null;
  url: string | null;
  saved_at: string;
}

export interface SavedOpportunityInsert {
  user_id: string;
  title: string;
  organization?: string;
  category?: OpportunityCategory;
  deadline?: string;
  url?: string;
}

/* ── financial_plans ────────────────────────────────────────── */

export interface FinancialPlan {
  id: string;
  user_id: string;
  monthly_income: number | null;
  monthly_expenses: number | null;
  current_savings: number | null;
  goal: string | null;
  plan_json: Record<string, unknown> | null;
  updated_at: string;
}

export interface FinancialPlanUpsert {
  user_id: string;
  monthly_income?: number;
  monthly_expenses?: number;
  current_savings?: number;
  goal?: string;
  plan_json?: Record<string, unknown>;
}

/* ── herlens_news ───────────────────────────────────────────── */

export interface HerlensNewsRow {
  id: string;
  category: string | null;
  title: string;
  summary: string | null;
  key_takeaways: string[] | null;
  source: string | null;
  published_at: string | null;
  updated_at: string;
}
