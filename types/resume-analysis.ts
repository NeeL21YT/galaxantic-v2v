/**
 * types/resume-analysis.ts
 *
 * TypeScript types for the Gemini resume analysis response.
 * These mirror the JSON Schema sent to the Gemini API exactly.
 */

export interface ResumeRoadmap {
  "30Days": string[];
  "60Days": string[];
  "90Days": string[];
}

/** Full structured response returned by Gemini */
export interface ResumeAnalysis {
  resumeScore: number;
  atsScore: number;
  careerReadiness: number;
  careerGapDetected: boolean;
  careerGapExplanation: string;
  strengths: string[];
  weaknesses: string[];
  technicalSkills: string[];
  softSkills: string[];
  missingSkills: string[];
  certifications: string[];
  recommendedProjects: string[];
  interviewTips: string[];
  resumeImprovements: string[];
  summary: string;
  roadmap: ResumeRoadmap;
}

/** Metadata stored alongside the analysis JSON */
export interface AnalysisMeta {
  modelUsed: string;
  analysisVersion: string;
  analysisDurationMs: number;
  analyzedAt: string;
}

/** Combined shape returned to the client after processResume() */
export interface ProcessResumeResult {
  resumeId: string;
  analysis: ResumeAnalysis;
  meta: AnalysisMeta;
}
