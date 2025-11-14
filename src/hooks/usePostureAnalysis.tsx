import { useState, useEffect } from "react";

export type PostureResult = {
  score: number; // 0-100
  stability: "Excellent" | "Good" | "Average" | "Poor";
  movementDetected: boolean;
};

export const usePostureAnalysis = (): PostureResult => {
  const [posture, setPosture] = useState<PostureResult>({
    score: 75,
    stability: "Good",
    movementDetected: false,
  });

  useEffect(() => {
    // Mock posture detection by randomizing every 3 seconds
    const interval = setInterval(() => {
      const stabilities: PostureResult["stability"][] = ["Excellent", "Good", "Average", "Poor"];
      const stability = stabilities[Math.floor(Math.random() * stabilities.length)];
      const score =
        stability === "Excellent" ? 90 : stability === "Good" ? 75 : stability === "Average" ? 60 : 45;
      const movementDetected = Math.random() > 0.9; // rare movement flag
      setPosture({ score, stability, movementDetected });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return posture;
};
