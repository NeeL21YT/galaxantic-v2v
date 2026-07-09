/**
 * types/dashboard.ts
 * TypeScript types for all dashboard entities (Stage 1B).
 */

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
  logoPlaceholder: string; // emoji / initials
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
  icon: string;
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
