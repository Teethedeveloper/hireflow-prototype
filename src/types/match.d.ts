export interface AIInterviewResult {
  postureScore: number;
  voiceConfidence: number;
  cheatingRisk: "Low" | "Medium" | "High";
  overallConfidence: number;
}

export interface CandidateInterviewSummary {
  candidateId: string;
  result: AIInterviewResult;
  summaryText: string;
}
