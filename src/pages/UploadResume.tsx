import { ResumeUploader } from "../components/ResumeUploader";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Candidate } from "../types/candidate";
import styles from "../styles/UploadResume.module.scss";

const pageVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };
const itemVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

export const UploadResume: React.FC = () => {
  const [uploadedCandidates, setUploadedCandidates] = useState<Candidate[]>([]);

  const handleUpload = (file: File) => {
    const newCandidate: Candidate = {
      id: `${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      email: `${file.name.replace(/\.[^/.]+$/, "")}@example.com`,
      role: "Unknown",
      experience: Math.floor(Math.random() * 5) + 1,
      skills: ["Skill1", "Skill2"],
      resumeUrl: URL.createObjectURL(file),
    };
    setUploadedCandidates((prev) => [...prev, newCandidate]);
  };

  return (
    <motion.div className={styles.page} variants={pageVariants} initial="hidden" animate="visible">
      <motion.h1 variants={itemVariants}>Upload Resumes</motion.h1>
      <motion.div variants={itemVariants}>
        <ResumeUploader onUpload={handleUpload} />
      </motion.div>
      <motion.p variants={itemVariants}>{uploadedCandidates.length} resumes uploaded</motion.p>
    </motion.div>
  );
};
