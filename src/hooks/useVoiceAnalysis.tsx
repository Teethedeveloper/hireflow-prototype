import { useState, useEffect } from "react";

export interface VoiceAnalysis {
  confidence: number; // 0–100
  tone: "Professional" | "Friendly" | "Neutral";
}

export const useVoiceAnalysis = () => {
  const [voice, setVoice] = useState<VoiceAnalysis>({ confidence: 75, tone: "Neutral" });

  useEffect(() => {
    // Mock voice changes every 3 seconds
    const interval = setInterval(() => {
      const tones: VoiceAnalysis["tone"][] = ["Professional", "Friendly", "Neutral"];
      setVoice({
        confidence: Math.floor(Math.random() * 41) + 60, // 60–100%
        tone: tones[Math.floor(Math.random() * tones.length)],
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return voice;
};
