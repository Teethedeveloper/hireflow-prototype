export interface Job {
  id: string;
  title: string;
  location: string;
  skillsRequired: string[];
  experienceRequired: number;
  // Computed metrics
  avgMatchScore?: number; // 0-100
  matchCount?: number; // number of candidates considered a match (>=50)
}
