import { useState } from "react";
import { motion } from "framer-motion";
import { useMockData } from "../hooks/useMockData";
import { AIInterview } from "../components/AIInterview/AIInterview";
import type { Candidate } from "../types/candidate";
import styles from "../styles/AIInterviewPage.module.scss";

const pageVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export const AIInterviewPage: React.FC = () => {
  const { candidates } = useMockData();
  const [selectedCandidate] = useState<Candidate | null>(candidates[0] || null);

  const handleInterviewComplete = (updatedCandidate: Candidate) => {
    console.log("AI Interview Completed:", updatedCandidate);
    alert(`Interview completed for ${updatedCandidate.name}`);
  };

  return (
    <motion.div className={styles.interviewPage} variants={pageVariants} initial="hidden" animate="visible">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>AI Interview</motion.h1>
      {selectedCandidate ? (
        <AIInterview
          candidate={selectedCandidate}
          onComplete={handleInterviewComplete}
        />
      ) : (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No candidates available</motion.p>
      )}
    </motion.div>
  );
};
