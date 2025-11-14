import type { FC } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import styles from "../../styles/AIInterview.module.scss";

interface SummaryReportProps {
  postureScore: number | null;
  voiceConfidence: number | null;
  cheatingRisk?: "Low" | "Medium" | "High" | null;
  summary: string;
}

export const SummaryReport: FC<SummaryReportProps> = ({
  postureScore,
  voiceConfidence,
  cheatingRisk: incomingCheatingRisk,
  summary,
}) => {
  // Compute cheating risk level deterministically from props
  const cheatingRisk: "Low" | "Medium" | "High" =
    incomingCheatingRisk ?? (postureScore !== null && voiceConfidence !== null
      ? voiceConfidence < 70 || postureScore < 65
        ? "High"
        : voiceConfidence < 80 || postureScore < 75
        ? "Medium"
        : "Low"
      : "Low");

  const color = cheatingRisk === "Low" ? "#38bdf8" : cheatingRisk === "Medium" ? "#fbbf24" : "#f87171";

  // Compute an overall score if both posture and voice are present
  const overallScore =
    postureScore !== null && voiceConfidence !== null
      ? Math.round((postureScore * 0.35 + voiceConfidence * 0.35 + 30) )
      : null;

  return (
    <div className={styles.results}>
      {/* Cheating Risk */}
      <div className={styles.metric}>
        {cheatingRisk === "High" ? (
          <AlertTriangle size={20} color={color} />
        ) : (
          <CheckCircle size={20} color={color} />
        )}
        <span>Cheating Risk:</span>
        <strong style={{ color }}>{cheatingRisk}</strong>
      </div>

      {/* Posture score */}
      {postureScore !== null && (
        <div className={styles.metric}>
          <CheckCircle size={18} color="#38bdf8" />
          <span>Posture Score:</span>
          <strong>{postureScore}%</strong>
        </div>
      )}

      {/* Voice confidence */}
      {voiceConfidence !== null && (
        <div className={styles.metric}>
          <CheckCircle size={18} color="#10b981" />
          <span>Voice Confidence:</span>
          <strong>{voiceConfidence}%</strong>
        </div>
      )}

      {/* Overall score */}
      {overallScore !== null && (
        <div className={styles.metric}>
          <CheckCircle size={18} color="#7c3aed" />
          <span>Overall Score:</span>
          <strong>{overallScore}%</strong>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className={styles.summary}>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};
