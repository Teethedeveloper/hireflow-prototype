import type { Candidate } from "./candidate";

/**
 * Simple per-question result used by the mock AI.
 */
export interface InterviewQuestionResult {
  questionId: number;
  questionText: string;
  transcript: string;
  matchedKeywords: string[];
  voiceConfidence: number; // 0-100
  postureScore: number; // 0-100
  overallScore: number; // 0-100
}

/**
 * Final AI interview result combining posture, voice, question analysis and summary.
 */
export interface AIInterviewResult {
  candidateId: string;
  jobRole?: string;
  totalScore: number; // aggregated score 0-100
  cheatingRisk: "Low" | "Medium" | "High";
  summary: string;
  questions: InterviewQuestionResult[];
  tone: "Professional" | "Friendly" | "Neutral" | "Unclear" | string;
  voiceConfidence: number; // avg voice confidence 0-100
  postureScore: number; // avg posture 0-100
  // optional human-friendly posture label
  posture?: "Excellent" | "Good" | "Average" | "Poor" | string;
}

/**
 * Represents a full AI interview session (with all 5 questions and results)
 */
export interface AIInterviewSession {
  candidate: Candidate;
  questions: string[];
  responses: {
    question: string;
    transcript: string;
    postureScore: number;
    voiceConfidence: number;
    cheatingRisk: "Low" | "Medium" | "High";
    keywordMatch: number; // % of keywords matched from job description
  }[];
  overallResult: AIInterviewResult;
  timestamp: string;
}
