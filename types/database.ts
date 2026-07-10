/**
 * types/database.ts
 *
 * TypeScript types mirroring the Supabase database schema.
 *
 * Rules:
 * - Each type maps 1:1 to a database table row.
 * - `Insert` and `Update` variants omit auto-generated fields
 *   (id, created_at, updated_at) so callers only pass what they own.
 * - No business logic here - pure data shapes.
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

export type AnalysisStatus =
  | "uploading"
  | "uploaded"
  | "extracting"
  | "analyzing"
  | "completed"
  | "failed"
  // legacy values kept for backward-compat
  | "pending"
  | "processing"
  | "analyzed";

export interface Resume {
  id: string;
  user_id: string;
  file_name: string | null;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  analysis_status: AnalysisStatus;
  resume_score: number | null;
  ats_score: number | null;
  career_readiness: number | null;
  extracted_text: string | null;
  text_hash: string | null;
  analysis_json: Record<string, unknown> | null;
  model_used: string | null;
  analysis_version: string | null;
  analysis_duration_ms: number | null;
  analyzed_at: string | null;
  uploaded_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ResumeInsert {
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  analysis_status?: AnalysisStatus;
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

/* ── AI coach chat ──────────────────────────────────────────── */

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatConversationInsert {
  user_id: string;
  title?: string;
}

export interface ChatConversationUpdate {
  title?: string;
  updated_at?: string;
}

export type ChatMessageRole = "user" | "assistant";

export interface ChatMessageRow {
  id: string;
  conversation_id: string;
  user_id: string;
  role: ChatMessageRole;
  message: string;
  created_at: string;
}

export interface ChatMessageInsert {
  conversation_id: string;
  user_id: string;
  role: ChatMessageRole;
  message: string;
}

/* ── financial_plans ────────────────────────────────────────── */

export interface FinancialPlan {
  id: string;
  user_id: string;
  monthly_income: number | null;
  monthly_expenses: number | null;
  current_savings: number | null;
  goal: string | null;
  employment_type: string | null;
  goal_details: string | null;
  target_amount: number | null;
  target_timeline: string | null;
  model_used: string | null;
  prompt_version: string | null;
  input_hash: string | null;
  plan_json: Record<string, unknown> | null; // Single source of truth for the full generated plan
  updated_at: string;
}

export interface FinancialPlanUpsert {
  user_id: string;
  monthly_income?: number;
  monthly_expenses?: number;
  current_savings?: number;
  goal?: string;
  employment_type?: string;
  goal_details?: string;
  target_amount?: number;
  target_timeline?: string;
  model_used?: string;
  prompt_version?: string;
  input_hash?: string;
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
  original_url: string | null;
  published_at: string | null;
  updated_at: string;
}

export interface HerlensNewsInsert {
  category: string;
  title: string;
  summary: string;
  key_takeaways: string[];
  source?: string | null;
  original_url?: string | null;
  published_at?: string | null;
}
