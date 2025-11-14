import type { Candidate } from "../types/candidate";
import type { Job } from "../types/job";

// Mock candidate database (preloaded from candidates.json in real app)
const MOCK_CANDIDATES = [
  {
    id: "1",
    name: "Priya Sharma",
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    experience: 3,
    location: "Bangalore",
    email: "priya.sharma@example.com",
  },
  {
    id: "2",
    name: "Amit Patel",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    experience: 5,
    location: "Mumbai",
    email: "amit.patel@example.com",
  },
  {
    id: "3",
    name: "Sneha Reddy",
    skills: ["React", "Next.js", "GraphQL", "Sass"],
    experience: 2,
    location: "Hyderabad",
    email: "sneha.reddy@example.com",
  },
  {
    id: "4",
    name: "Rohit Verma",
    skills: ["JavaScript", "Node.js", "Express", "PostgreSQL"],
    experience: 4,
    location: "Pune",
    email: "rohit.verma@example.com",
  },
  {
    id: "5",
    name: "Ananya Gupta",
    skills: ["React", "TypeScript", "TailwindCSS", "Redux"],
    experience: 3,
    location: "Delhi",
    email: "ananya.gupta@example.com",
  },
];

// Similarity score between two strings (Levenshtein distance)
function stringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1;

  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[s2.length][s1.length];
}

/**
 * Extract candidate from mock data based on file name similarity.
 * Auto-selects best matching job based on skill overlap.
 * Returns Candidate with matched job role and match score.
 */
export function extractCandidateFromMock(
  fileName: string,
  fileUrl: string,
  allJobs: Job[]
): Candidate {
  const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "").trim();

  // Find best matching candidate from mock data
  let bestMatch = MOCK_CANDIDATES[0];
  let bestScore = 0;

  MOCK_CANDIDATES.forEach((candidate) => {
    const score = stringSimilarity(fileNameWithoutExtension, candidate.name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = candidate;
    }
  });

  // Auto-select best matching job based on skill overlap
  let selectedJob: Job | undefined;
  let bestJobScore = 0;

  allJobs.forEach((job) => {
    const matchedSkills = bestMatch.skills.filter((s) =>
      job.skillsRequired.includes(s)
    ).length;
    const skillMatch = job.skillsRequired.length
      ? matchedSkills / job.skillsRequired.length
      : 0;

    if (skillMatch > bestJobScore) {
      bestJobScore = skillMatch;
      selectedJob = job;
    }
  });

  // Compute match score using same logic as job averaging
  let matchScore: number | undefined;
  if (selectedJob) {
    const matchedSkills = bestMatch.skills.filter((s) =>
      selectedJob!.skillsRequired.includes(s)
    ).length;
    const skillMatch = selectedJob!.skillsRequired.length
      ? matchedSkills / selectedJob!.skillsRequired.length
      : 0;

    const reqExp = selectedJob!.experienceRequired ?? 0;
    const expDiff = Math.max(0, reqExp - bestMatch.experience);
    const expMatch = reqExp > 0 ? Math.max(0, 1 - expDiff / reqExp) : 1;

    matchScore = Math.round((skillMatch * 0.7 + expMatch * 0.3) * 100);
  }

  return {
    id: `${Date.now()}-${Math.random()}`,
    name: bestMatch.name,
    email: bestMatch.email,
    role: selectedJob?.title || "Unknown",
    experience: bestMatch.experience,
    skills: [...bestMatch.skills],
    resumeUrl: fileUrl,
    matchScore,
  };
}
