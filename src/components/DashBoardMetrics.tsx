import type { FC } from "react";
import { motion } from "framer-motion";
import type { Candidate } from "../types/candidate";
import styles from "../styles/DashboardMetrics.module.scss";

interface DashboardMetricsProps {
  candidates: Candidate[];
}

export const DashboardMetrics: FC<DashboardMetricsProps> = ({ candidates }) => {
  const totalCandidates = candidates.length;

  const avgMatchScore =
    candidates.length > 0
      ? Math.floor(
          candidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) / candidates.length
        )
      : 0;

  const topCandidate = candidates.length > 0
    ? candidates.reduce((prev, curr) =>
        (curr.matchScore || 0) > (prev.matchScore || 0) ? curr : prev
      )
    : null;

  const topCandidatePercentage = topCandidate 
    ? Math.round(((topCandidate.matchScore || 0) / 100) * 100)
    : 0;

  return (
    <div className={styles.metricsContainer}>
      <motion.div
        className={styles.metricCard}
        whileHover={{ scale: 1.03 }}
      >
        <h3>Total Candidates</h3>
        <p>{totalCandidates}</p>
      </motion.div>

      <motion.div
        className={styles.metricCard}
        whileHover={{ scale: 1.03 }}
      >
        <h3>Average Match Score</h3>
        <p>{avgMatchScore}%</p>
      </motion.div>

      {topCandidate && (
        <motion.div
          className={styles.metricCard}
          whileHover={{ scale: 1.03 }}
        >
          <h3>Top Candidate</h3>
          <p>{topCandidate.name}</p>
          <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {topCandidate.matchScore || 0}% match ({topCandidatePercentage}% of pool)
          </p>
        </motion.div>
      )}
    </div>
  );
};

