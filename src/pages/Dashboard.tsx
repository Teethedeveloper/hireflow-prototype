import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Candidate } from "../types/candidate";
import { useMockData } from "../hooks/useMockData";
import { extractCandidateFromMock } from "../utils/candidateExtraction";
import { JobSelector } from "../components/JobSelector";
import { CandidateList } from "../components/CandidateList";
import { ResumeUploader } from "../components/ResumeUploader";
import { AIInterview } from "../components/AIInterview/AIInterview";
import { DashboardMetrics } from "../components/DashBoardMetrics";
import { Sidebar } from "../components/Sidebar";
import styles from "../styles/dashboard.module.scss";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

export const Dashboard: React.FC = () => {
  const { candidates: allCandidates, jobs } = useMockData();
  const [localAdds, setLocalAdds] = useState<Candidate[]>([]);
  const [interviewCandidate, setInterviewCandidate] = useState<Candidate | null>(null);
  const [clickedCandidateId, setClickedCandidateId] = useState<string | null>(null);

  // Compute displayed candidates (base dataset + any locally added resumes)
  const candidates = useMemo(() => {
    return [...allCandidates, ...localAdds];
  }, [allCandidates, localAdds]);

  // Handle new resume uploads
  const handleResumeUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    // Auto-select best matching job from all available jobs
    const candidate = extractCandidateFromMock(file.name, fileUrl, jobs);
    setLocalAdds((prev) => [...prev, candidate]);
  };

  // Handle AI interview completion
  const handleInterviewComplete = (updatedCandidate: Candidate) => {
    setLocalAdds((prev) => {
      const found = prev.find((c) => c.id === updatedCandidate.id);
      if (found) {
        return prev.map((c) => (c.id === updatedCandidate.id ? updatedCandidate : c));
      }
      return [...prev, updatedCandidate];
    });
    setInterviewCandidate(null);
  };

  const handleSelectCandidate = (id: string) => {
    // Only allow one click per candidate
    if (clickedCandidateId === id) return;
    
    setClickedCandidateId(id);
    const candidate = candidates.find((c) => c.id === id) || null;
    setInterviewCandidate(candidate);
  };

  // Get unique jobs applied for by candidates
  const appliedJobs = useMemo(() => {
    const jobMap = new Map<string, typeof jobs[0]>();
    candidates.forEach((c) => {
      const matchingJob = jobs.find((j) => j.title === c.role);
      if (matchingJob) {
        jobMap.set(matchingJob.id, matchingJob);
      }
    });
    return Array.from(jobMap.values());
  }, [candidates, jobs]);

  return (
    <div className={styles.dashboardWrapper}>
      <Sidebar />
      <motion.div className={styles.dashboard} variants={containerVariants} initial="hidden" animate="visible">
        <motion.h1 variants={itemVariants}>HireFlow Dashboard</motion.h1>

        <motion.div variants={itemVariants}>
          <DashboardMetrics candidates={candidates} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Upload Resume</h2>
          <ResumeUploader onUpload={handleResumeUpload} />
        </motion.div>

        {appliedJobs.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className={styles.sectionTitle}>Applied for Positions</h2>
            <JobSelector
              jobs={appliedJobs}
              selectedJobId={undefined}
            />
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Candidates</h2>
          <CandidateList
            candidates={candidates}
            onSelectCandidate={handleSelectCandidate}
          />
        </motion.div>

        {interviewCandidate && (
          <AIInterview
            candidate={interviewCandidate}
            onComplete={handleInterviewComplete}
          />
        )}
      </motion.div>
    </div>
  );
};

