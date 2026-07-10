/**
 * lib/coach/prompt-builder.ts
 *
 * Builds compact, structured prompts for Herizon AI. The model receives only
 * recent conversation turns plus a deterministic summary of older turns.
 */

import type { ChatMessageRow } from "@/types/database";
import type { CoachUserContext } from "./context-loader";

export const HERIZON_AI_SYSTEM_PROMPT = `You are Herizon AI.

You are simultaneously:
- Career Coach
- Resume Reviewer
- Interview Mentor
- Learning Advisor
- Career Transition Specialist
- Opportunity Advisor

Your mission is to help women restart, grow, upskill, and lead their careers.

Always use the supplied user context.
Never invent user information.
If information is unavailable, state that clearly.
Always provide clear, actionable, step-by-step advice.
Be encouraging, professional, empathetic, and practical.
IMPORTANT: If the name found within the Resume Analysis text clearly differs from the User Context name, politely acknowledge that they seem to have uploaded someone else's resume, but continue to provide helpful advice based on that resume's context anyway.

Markdown is allowed. Use headings, bold text, bullet lists, numbered lists, tables, code blocks, and links only when they make the response clearer.`;

const MAX_RESUME_CHARS = 3500;
const RECENT_MESSAGE_LIMIT = 12;
const OLDER_MESSAGE_SUMMARY_LIMIT = 8;

function truncate(value: string | null | undefined, max = 900): string {
  if (!value) return "";
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 20).trim()}... [truncated]`;
}

function summarizeOlderMessages(messages: ChatMessageRow[]): string {
  if (messages.length === 0) return "No older messages.";

  return messages
    .slice(-OLDER_MESSAGE_SUMMARY_LIMIT)
    .map((msg) => `${msg.role}: ${truncate(msg.message, 220)}`)
    .join("\n");
}

function recentMessages(messages: ChatMessageRow[]): ChatMessageRow[] {
  return messages.slice(-RECENT_MESSAGE_LIMIT);
}

function buildUserContext(context: CoachUserContext) {
  const { profile } = context;

  return {
    authenticatedUserId: context.userId,
    name: profile?.full_name ?? "Unavailable",
    email: profile?.email ?? "Unavailable",
    educationLevel: profile?.education_level ?? "Unavailable",
    careerStage: profile?.career_stage ?? "Unavailable",
    location: profile?.location ?? "Unavailable",
    bio: profile?.bio ?? "Unavailable",
    skills: profile?.skills ?? [],
    interests: profile?.interests ?? [],
    onboardingCompleted: profile?.onboarding_completed ?? false,
  };
}

function buildResumeContext(context: CoachUserContext) {
  const { resume, resumeAnalysis } = context;

  if (!resume) {
    return "No completed resume analysis is available yet.";
  }

  return {
    fileName: resume.file_name,
    uploadedAt: resume.uploaded_at,
    analyzedAt: resume.analyzed_at,
    resumeScore: resume.resume_score,
    atsScore: resume.ats_score,
    careerReadiness: resume.career_readiness,
    extractedResumeExcerpt: resume.extracted_text
      ? truncate(resume.extracted_text, MAX_RESUME_CHARS)
      : "Unavailable",
    analysis: resumeAnalysis
      ? {
          resumeScore: resumeAnalysis.resumeScore,
          atsScore: resumeAnalysis.atsScore,
          careerReadiness: resumeAnalysis.careerReadiness,
          careerGapDetected: resumeAnalysis.careerGapDetected,
          careerGapExplanation: resumeAnalysis.careerGapExplanation,
          strengths: resumeAnalysis.strengths,
          weaknesses: resumeAnalysis.weaknesses,
          technicalSkills: resumeAnalysis.technicalSkills,
          softSkills: resumeAnalysis.softSkills,
          missingSkills: resumeAnalysis.missingSkills,
          certifications: resumeAnalysis.certifications,
          recommendedProjects: resumeAnalysis.recommendedProjects,
          interviewTips: resumeAnalysis.interviewTips,
          resumeImprovements: resumeAnalysis.resumeImprovements,
          summary: resumeAnalysis.summary,
          roadmap: resumeAnalysis.roadmap,
        }
      : "Resume analysis JSON is unavailable.",
  };
}

function buildCareerGoalsContext(context: CoachUserContext) {
  return {
    profileInterests: context.profile?.interests ?? [],
    profileBio: context.profile?.bio ?? "Unavailable",
    latestRoadmapGoal: context.roadmap?.goal ?? "Unavailable",
    latestRoadmapCurrentStage: context.roadmap?.current_stage ?? "Unavailable",
    latestRoadmap: context.roadmap?.roadmap_json ?? "Unavailable",
  };
}

function buildSavedOpportunitiesContext(context: CoachUserContext) {
  if (context.savedOpportunities.length === 0) {
    return "No saved opportunities yet.";
  }

  return context.savedOpportunities.map((opp) => ({
    title: opp.title,
    organization: opp.organization,
    category: opp.category,
    deadline: opp.deadline,
    url: opp.url,
    aiNotes: opp.ai_notes,
    savedAt: opp.saved_at,
  }));
}

export interface BuildCoachPromptParams {
  context: CoachUserContext;
  previousMessages: ChatMessageRow[];
  latestUserMessage: string;
}

export function buildCoachPrompt({
  context,
  previousMessages,
  latestUserMessage,
}: BuildCoachPromptParams): string {
  const older = previousMessages.slice(0, Math.max(0, previousMessages.length - RECENT_MESSAGE_LIMIT));
  const recent = recentMessages(previousMessages).map((msg) => ({
    role: msg.role,
    message: truncate(msg.message, 1200),
    createdAt: msg.created_at,
  }));

  return `${HERIZON_AI_SYSTEM_PROMPT}

USER CONTEXT:
${JSON.stringify(buildUserContext(context), null, 2)}

RESUME ANALYSIS:
${JSON.stringify(buildResumeContext(context), null, 2)}

CAREER GOALS:
${JSON.stringify(buildCareerGoalsContext(context), null, 2)}

SAVED OPPORTUNITIES:
${JSON.stringify(buildSavedOpportunitiesContext(context), null, 2)}

OLDER CONVERSATION SUMMARY:
${summarizeOlderMessages(older)}

RECENT PREVIOUS MESSAGES:
${JSON.stringify(recent, null, 2)}

CURRENT USER QUESTION:
${latestUserMessage}

GEMINI:
Return a JSON object with:
- responseMarkdown: a helpful personalized answer in safe Markdown
- intent: one short label such as resume_review, interview_prep, career_gap, learning_plan, opportunity_advice, career_transition, or general_career_advice
- followUpSuggestions: 2 to 4 short next prompts the user may ask

Do not include facts that are not supported by the supplied context.`;
}
