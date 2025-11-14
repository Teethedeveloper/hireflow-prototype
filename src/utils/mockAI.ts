// src/utils/mockAI.ts
import type { Candidate } from "../types/candidate";
import type { AIInterviewResult, InterviewQuestionResult } from "../types/interview.ts";

/**
 * Generates a random match score (60–100%)
 */
export const generateMatchScore = (): number => {
  return Math.floor(Math.random() * 41) + 60;
};

/**
 * Returns top N candidates sorted by matchScore
 */
export const rankCandidates = (candidates: Candidate[], topN: number = 5): Candidate[] => {
  return [...candidates]
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, topN);
};

/**
 * Utility: pick random items from an array
 */
const pickRandom = <T>(arr: T[], count = 1): T[] => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Generates fake AI interview results (5 questions)
 * with per-question analysis and overall summary.
 */
export const generateAIInterviewSummary = (candidate: Candidate): AIInterviewResult => {
  // Future: can incorporate candidate.matchScore for weighting
  void candidate;


  // Mock 5 standard interview questions
  const questions = [
    "Tell me about yourself.",
    "Why do you want to work for this company?",
    "Describe a challenge you overcame at work.",
    "What are your greatest strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
  ];

  // Generate per-question performance
  const questionResults: InterviewQuestionResult[] = questions.map((q, index) => {
    const voiceConfidence = Math.floor(Math.random() * 31) + 70; // 70–100
    const postureScore = Math.floor(Math.random() * 31) + 65; // 65–95
    const matchedKeywords = pickRandom(candidate.skills, Math.floor(Math.random() * 3) + 1);
    const transcript = `Mock response by ${candidate.name} about "${matchedKeywords.join(", ")}".`;

    // Weighted average score for each question
    const overallScore = Math.round(
      (voiceConfidence * 0.4 + postureScore * 0.3 + matchedKeywords.length * 10) / 1
    );

    return {
      questionId: index + 1,
      questionText: q,
      transcript,
      matchedKeywords,
      voiceConfidence,
      postureScore,
      overallScore,
    };
  });

  // Aggregate all question data
  const avgVoice = Math.round(
    questionResults.reduce((sum, q) => sum + q.voiceConfidence, 0) / questionResults.length
  );
  const avgPosture = Math.round(
    questionResults.reduce((sum, q) => sum + q.postureScore, 0) / questionResults.length
  );
  const avgOverall = Math.round(
    questionResults.reduce((sum, q) => sum + q.overallScore, 0) / questionResults.length
  );

  // Determine cheating risk based on thresholds
  const cheatingRisk: "Low" | "Medium" | "High" =
    avgVoice < 70 || avgPosture < 70 ? "High" : avgVoice < 80 ? "Medium" : "Low";

  // Generate tone and summary text (deterministic-ish without calling Math.random here for risk decisions)
  const tone = ["Professional", "Friendly", "Neutral"][Math.floor(Math.random() * 3)];
  const summary = `AI Interview Summary for ${candidate.name}:\n- Avg Voice Confidence: ${avgVoice}%\n- Avg Posture Score: ${avgPosture}%\n- Keywords matched: ${candidate.skills.slice(0, 3).join(", ")}\n- Tone detected: ${tone}\n- Cheating Risk: ${cheatingRisk}\nOverall, ${candidate.name} shows alignment with the ${candidate.role} role, scoring ${avgOverall}% on average.`;

  return {
    candidateId: candidate.id,
    jobRole: candidate.role,
    totalScore: avgOverall,
    cheatingRisk,
    summary,
    questions: questionResults,
    tone,
    voiceConfidence: avgVoice,
    postureScore: avgPosture,
    posture: avgPosture > 85 ? "Excellent" : avgPosture > 70 ? "Good" : "Average",
  };
};

/**
 * Optional: Generate random candidate answers for mock AI interview
 */
export const generateCandidateAnswer = (candidateName: string, question: string): string => {
  const sampleResponses = [
    `I have worked extensively on ${question.toLowerCase()} in my previous projects.`,
    `During my experience, I faced challenges related to ${question.toLowerCase()} and overcame them.`,
    `I am confident in my skills related to ${question.toLowerCase()} and have successfully implemented them.`,
  ];
  const randomIndex = Math.floor(Math.random() * sampleResponses.length);
  return `${candidateName} says: ${sampleResponses[randomIndex]}`;
};
