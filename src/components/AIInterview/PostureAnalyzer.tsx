import type { FC } from "react";
import { Brain } from "lucide-react";
import styles from "../../styles/AIInterview.module.scss";

interface PostureAnalyzerProps {
  score: number | null;
}

export const PostureAnalyzer: FC<PostureAnalyzerProps> = ({ score }) => (
  <div className={styles.metric}>
    <Brain size={20} color="#00C896" /> 
    <span>Posture Score:</span> 
    <strong>{score !== null ? `${score}%` : "--"}</strong>
  </div>
);
