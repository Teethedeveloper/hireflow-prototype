import { useMemo } from "react";
import type { Candidate } from "../types/candidate";
import type { AIInterviewResult } from "../types/interview.ts";
import { usePostureAnalysis } from "./usePostureAnalysis";
import { useVoiceAnalysis } from "./useVoiceAnalysis";
import { generateAIInterviewSummary } from "../utils/mockAI";

export const useInterviewAI = (candidate: Candidate | null): AIInterviewResult | null => {
  const posture = usePostureAnalysis();
  const voice = useVoiceAnalysis();

  // Return a memoized summary directly (avoid setting state inside effects)
  const computed = useMemo<AIInterviewResult | null>(() => {
    if (!candidate) return null;

    const withMatch = {
      ...candidate,
      matchScore: candidate.matchScore ?? undefined,
    } as Candidate;

    const result = generateAIInterviewSummary(withMatch);

    // Overwrite with latest posture/voice metrics when available
    if (typeof result.voiceConfidence === "number") {
      result.voiceConfidence = voice.confidence ?? result.voiceConfidence;
    }
    if (typeof result.postureScore === "number") {
      result.postureScore = posture?.score ?? result.postureScore;
    }

    return result;
  }, [candidate, posture, voice]);

  return computed;
};
