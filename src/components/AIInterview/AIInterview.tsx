import { useState } from "react";
import { motion } from "framer-motion";
import type { Candidate } from "../../types/candidate";
import type { InterviewQuestionResult } from "../../types/interview.ts";
import { PostureAnalyzer } from "./PostureAnalyzer";
import { VoiceAnalyzer } from "./VoiceAnalyzer";
import { SummaryReport } from "./SummaryReport";
import { usePostureAnalysis } from "../../hooks/usePostureAnalysis";
import { useVoiceAnalysis } from "../../hooks/useVoiceAnalysis";
import { generateCandidateAnswer } from "../../utils/mockAI";
import styles from "../../styles/AIInterview.module.scss";

interface AIInterviewProps {
  candidate: Candidate;
  onComplete?: (updatedCandidate: Candidate) => void;
}

const QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want to work for this company?",
  "Describe a challenge you overcame at work.",
  "What are your greatest strengths and weaknesses?",
  "Where do you see yourself in 5 years?",
];

export const AIInterview: React.FC<AIInterviewProps> = ({ candidate, onComplete }) => {
  const posture = usePostureAnalysis();
  const voice = useVoiceAnalysis();

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [responses, setResponses] = useState<InterviewQuestionResult[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [summaryText, setSummaryText] = useState<string>("");

  const start = () => setCurrentIndex(0);

  const pickRandom = <T,>(arr: T[], count = 1): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleNext = () => {
    if (currentIndex < 0 || currentIndex >= QUESTIONS.length) return;

    // Use live hook values with fallback to small randoms
    const voiceConfidence = voice?.confidence ?? Math.floor(Math.random() * 21) + 70; // 70-90
    const postureScore = posture?.score ?? Math.floor(Math.random() * 31) + 65; // 65-95
    const matchedKeywords = pickRandom(candidate.skills || ["skill"], Math.min(3, Math.max(1, Math.floor(Math.random() * 3) + 1)));
    const transcript = generateCandidateAnswer(candidate.name, QUESTIONS[currentIndex]);

    const overallScore = Math.round(voiceConfidence * 0.4 + postureScore * 0.35 + matchedKeywords.length * 5);

    const result: InterviewQuestionResult = {
      questionId: currentIndex + 1,
      questionText: QUESTIONS[currentIndex],
      transcript,
      matchedKeywords,
      voiceConfidence,
      postureScore,
      overallScore,
    };

    setResponses((prev) => [...prev, result]);

    if (currentIndex === QUESTIONS.length - 1) {
      // Complete interview
      const avgVoice = Math.round((responses.reduce((s, r) => s + r.voiceConfidence, 0) + voiceConfidence) / QUESTIONS.length);
      const avgPosture = Math.round((responses.reduce((s, r) => s + r.postureScore, 0) + postureScore) / QUESTIONS.length);
      const avgOverall = Math.round((responses.reduce((s, r) => s + r.overallScore, 0) + overallScore) / QUESTIONS.length);

      const cheatingRisk: "Low" | "Medium" | "High" = avgVoice < 70 || avgPosture < 65 ? "High" : avgVoice < 80 || avgPosture < 75 ? "Medium" : "Low";
      const tone = voice?.tone ?? "Neutral";

      const summary = `AI Interview Summary for ${candidate.name}:\n- Avg Voice Confidence: ${avgVoice}%\n- Avg Posture Score: ${avgPosture}%\n- Keywords matched: ${Array.from(new Set(candidate.skills || [])).slice(0,3).join(", ")}\n- Tone detected: ${tone}\n- Cheating Risk: ${cheatingRisk}\nOverall, ${candidate.name} scored ${avgOverall}% on the interview.`;

      setSummaryText(summary);
      setIsCompleted(true);

      // callback to parent
      onComplete?.({
        ...candidate,
        postureScore: avgPosture,
        voiceConfidence: avgVoice,
        cheatingRisk,
        aiSummary: summary,
        totalScore: avgOverall,
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className={styles.container}>
      <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>{`AI Interview - ${candidate.name}`}</motion.h2>

      {currentIndex === -1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.startArea}>
          <p>Click start to begin the interview</p>
          <motion.button className={styles.startBtn} onClick={start} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>Start Interview</motion.button>
        </motion.div>
      )}

      {currentIndex >= 0 && !isCompleted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.questionBox}>
          <div className={styles.progress}>Question {currentIndex + 1} / {QUESTIONS.length}</div>
          <h3>{QUESTIONS[currentIndex]}</h3>
          <p className={styles.transcriptPreview}>Live analysis running. Click 'Next' when ready.</p>

          <div className={styles.analyzers}>
            <PostureAnalyzer score={posture?.score ?? null} />
            <VoiceAnalyzer score={voice?.confidence ?? null} />
          </div>

          <motion.button className={styles.startBtn} onClick={handleNext} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            {currentIndex === QUESTIONS.length - 1 ? "Finish" : "Next"}
          </motion.button>
        </motion.div>
      )}

      {isCompleted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.results}>
          <SummaryReport
            postureScore={responses.length ? Math.round(responses.reduce((s, r) => s + r.postureScore, 0) / responses.length) : null}
            voiceConfidence={responses.length ? Math.round(responses.reduce((s, r) => s + r.voiceConfidence, 0) / responses.length) : null}
            cheatingRisk={responses.length ? (responses.reduce((s, r) => s + r.overallScore, 0) / responses.length) > 60 ? "Low" : "Medium" : "Low"}
            summary={summaryText}
          />

          <div className={styles.responsesList}>
            {responses.map((r) => (
              <motion.div key={r.questionId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.responseItem}>
                <strong>Q{r.questionId}:</strong> {r.questionText}
                <div className={styles.resMeta}><span>Voice: {r.voiceConfidence}%</span> <span>Posture: {r.postureScore}%</span> <span>Score: {r.overallScore}%</span></div>
                <p className={styles.transcript}>{r.transcript}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
