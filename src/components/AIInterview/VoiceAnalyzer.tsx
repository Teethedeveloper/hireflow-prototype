import type { FC } from "react";
import { Mic } from "lucide-react";
import styles from "../../styles/AIInterview.module.scss";

interface VoiceAnalyzerProps {
  score: number | null;
}

export const VoiceAnalyzer: FC<VoiceAnalyzerProps> = ({ score }) => (
  <div className={styles.metric}>
    <Mic size={20} color="#6C63FF" /> 
    <span>Voice Confidence:</span> 
    <strong>{score !== null ? `${score}%` : "--"}</strong>
  </div>
);
