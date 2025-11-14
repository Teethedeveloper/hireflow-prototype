import type { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Candidate } from "../types/candidate";
import { CandidateCard } from "./CandidateCard";
import styles from "../styles/CandidateList.module.scss";

interface CandidateListProps {
  candidates: Candidate[];
  onSelectCandidate?: (id: string) => void;
}

export const CandidateList: FC<CandidateListProps> = ({
  candidates,
  onSelectCandidate,
}) => {
  return (
    <div className={styles.listContainer}>
      <AnimatePresence>
        {candidates.map((candidate) => (
          <motion.div
            key={candidate.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.cardWrapper}
          >
            <CandidateCard
              candidate={candidate}
              onSelect={onSelectCandidate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
