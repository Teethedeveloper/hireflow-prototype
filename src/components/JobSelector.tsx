import type { FC } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import type { Job } from "../types/job";
import styles from "../styles/JobSelector.module.scss";

interface JobSelectorProps {
  jobs: Job[];
  selectedJobId?: string;
}

export const JobSelector: FC<JobSelectorProps> = ({
  jobs,
  selectedJobId,
}) => {
  return (
    <div className={styles.container}>
      {jobs.map((job) => {
        const isSelected = job.id === selectedJobId;
        return (
          <motion.div
            key={job.id}
            className={`${styles.jobCard} ${isSelected ? styles.selected : ""}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          >
            <div className={styles.iconWrapper}>
              <Briefcase size={24} />
            </div>
            <div className={styles.jobInfo}>
              <h4>{job.title}</h4>
              <p>{job.location}</p>
              <div className={styles.metrics}>
                <span className={styles.avg}>Avg match: {job.avgMatchScore ?? 0}%</span>
                <span className={styles.count}>{job.matchCount ?? 0} candidates</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
