export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  experience: number; // in years
  skills: string[];
  resumeUrl: string;
  matchScore?: number; // Base AI matching score (resume + job)
  
  // Optional advanced AI interview analysis fields
  voiceConfidence?: number;   // Percentage (0–100)
  postureScore?: number;      // Percentage (0–100)
  cheatingRisk?: "Low" | "Medium" | "High";
  aiSummary?: string;         // Summary generated after mock AI interview
  totalScore?: number;        // Overall interview score (0-100)
}

