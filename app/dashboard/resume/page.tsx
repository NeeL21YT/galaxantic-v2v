/**
 * app/dashboard/resume/page.tsx
 *
 * Server Component wrapper - fetches existing resumes and the latest
 * completed analysis from the database, then hands off to the client shell.
 *
 * No placeholder data. All data comes from Supabase.
 */

import type { Metadata } from "next";
import { getUserResumes, getLatestAnalyzedResume } from "@/lib/db/resumes";
import { ResumePageClient } from "@/components/resume/ResumePageClient";
import type { ResumeAnalysis } from "@/types/resume-analysis";

export const metadata: Metadata = {
  title: "Resume - Herizon",
  description: "Upload your resume for instant AI scoring, ATS analysis, and a personalised 90-day career roadmap.",
};

export default async function ResumePage() {
  const [resumes, latestAnalyzed] = await Promise.all([
    getUserResumes(),
    getLatestAnalyzedResume(),
  ]);

  // If we have an existing analysis, hydrate it for immediate display
  const initialAnalysis =
    latestAnalyzed?.analysis_json && latestAnalyzed.analyzed_at
      ? {
          resumeId: latestAnalyzed.id,
          analysis: latestAnalyzed.analysis_json as unknown as ResumeAnalysis,
          fileName: latestAnalyzed.file_name ?? "Resume",
          analyzedAt: latestAnalyzed.analyzed_at,
          durationMs: latestAnalyzed.analysis_duration_ms ?? 0,
        }
      : null;

  return (
    <ResumePageClient
      initialResumes={resumes}
      initialAnalysis={initialAnalysis}
    />
  );
}
