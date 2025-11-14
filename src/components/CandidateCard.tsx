import { motion } from "framer-motion";
import { User, Star, Mic, Brain } from "lucide-react";
import type { Candidate } from "../types/candidate";
import styles from "../styles/components/CandidateCard.module.scss";

interface CandidateCardProps {
  candidate: Candidate;
  onSelect?: (id: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onSelect }) => {
  return (
    <motion.div
      className={styles.card}
      whileHover={{ scale: 1.03, boxShadow: "0 6px 15px rgba(0,0,0,0.2)" }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      onClick={() => onSelect?.(candidate.id)}
    >
      {/* Header */}
      <div className={styles.header}>
        <User size={32} className={styles.icon} />
        <h3>{candidate.name}</h3>
        <p className={styles.position}>{candidate.role}</p>
      </div>

      {/* Base AI Match Score */}
      {candidate.matchScore !== undefined && (
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <Star className={styles.metricIcon} color="#FFD700" />
            <span>Match Score:</span>
            <strong>{candidate.matchScore}%</strong>
          </div>
        </div>
      )}

      {/* Optional AI Interview Metrics */}
      {(candidate.voiceConfidence !== undefined ||
        candidate.postureScore !== undefined ||
        candidate.cheatingRisk !== undefined) && (
        <div className={styles.metrics}>
          {candidate.voiceConfidence !== undefined && (
            <div className={styles.metric}>
              <Mic className={styles.metricIcon} color="#6C63FF" />
              <span>Voice Confidence:</span>
              <strong>{candidate.voiceConfidence}%</strong>
            </div>
          )}

          {candidate.postureScore !== undefined && (
            <div className={styles.metric}>
              <Brain className={styles.metricIcon} color="#00C896" />
              <span>Posture Score:</span>
              <strong>{candidate.postureScore}%</strong>
            </div>
          )}

          {candidate.cheatingRisk !== undefined && (
            <div className={styles.metric}>
              <span>Cheating Risk:</span>
              <strong>{candidate.cheatingRisk}</strong>
            </div>
          )}
        </div>
      )}

      {/* AI Summary */}
      {candidate.aiSummary && (
        <motion.div
          className={styles.summary}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p>{candidate.aiSummary}</p>
        </motion.div>
      )}
    </motion.div>
  );
};
