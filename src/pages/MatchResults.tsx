import { useMemo } from "react";
import { motion } from "framer-motion";
import { useMockData } from "../hooks/useMockData";
import { CandidateList } from "../components/CandidateList";
import styles from "../styles/MatchResults.module.scss";

const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

export const MatchResults: React.FC = () => {
  const { candidates } = useMockData();

  const rankedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [candidates]);

  return (
    <motion.div className={styles.page} variants={pageVariants} initial="hidden" animate="visible">
      <motion.h1 variants={itemVariants}>Match Results</motion.h1>
      <motion.div variants={itemVariants}>
        <CandidateList
          candidates={rankedCandidates}
          onSelectCandidate={(id) => console.log("Selected candidate:", id)}
        />
      </motion.div>
    </motion.div>
  );
};
