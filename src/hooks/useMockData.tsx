import { useState, useEffect, useMemo } from "react";
import type { Candidate } from "../types/candidate";
import type { Job } from "../types/job";

interface MockData {
  candidates: Candidate[];
  jobs: Job[];
}

type RawJob = {
  id: number | string;
  title?: string;
  name?: string;
  location?: string;
  skillsRequired?: unknown;
  requiredSkills?: unknown;
  experienceRequired?: unknown;
  experienceLevel?: unknown;
};

export const useMockData = (): MockData => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [rawJobs, setRawJobs] = useState<RawJob[]>([]);

  useEffect(() => {
    // Fetch candidates.json
    fetch("/data/candidates.json")
      .then((res) => res.json())
      .then((data: Candidate[]) => setCandidates(data))
      .catch((err) => console.error("Error loading candidates:", err));

    // Fetch jobs.json
    fetch("/data/jobs.json")
      .then((res) => res.json())
      .then((data: RawJob[]) => setRawJobs(data))
      .catch((err) => console.error("Error loading jobs:", err));
  }, []);

  const jobs = useMemo(() => {
    if (!rawJobs || rawJobs.length === 0) return [] as Job[];

    const normalizedJobs: Job[] = rawJobs.map((j) => {
      const skills = Array.isArray(j.skillsRequired)
        ? (j.skillsRequired as string[])
        : Array.isArray(j.requiredSkills)
        ? (j.requiredSkills as string[])
        : [];

      const expReq = typeof j.experienceRequired === "number"
        ? (j.experienceRequired as number)
        : typeof j.experienceLevel === "number"
        ? (j.experienceLevel as number)
        : 0;

      return {
        id: String(j.id),
        title: j.title ?? j.name ?? "Untitled",
        location: j.location ?? "",
        skillsRequired: skills,
        experienceRequired: expReq,
      };
    });

    if (!candidates || candidates.length === 0) return normalizedJobs;

    // Compute average match score across ALL candidates who have applied
    const jobsWithMetrics = normalizedJobs.map((job) => {
      const scores: number[] = candidates.map((c) => {
        const candidateSkills = Array.isArray(c.skills) ? c.skills : [];
        const matchedSkills = candidateSkills.filter((s) =>
          job.skillsRequired.includes(s)
        ).length;
        const skillMatch = job.skillsRequired.length
          ? matchedSkills / job.skillsRequired.length
          : 0;

        const candExp = (c.experience ?? 0) as number;
        const reqExp = job.experienceRequired ?? 0;
        const expDiff = Math.max(0, reqExp - candExp);
        const expMatch = reqExp > 0 ? Math.max(0, 1 - expDiff / reqExp) : 1;

        const score = Math.round((skillMatch * 0.7 + expMatch * 0.3) * 100);
        return score;
      });

      // Average of all applicants (including those with score < 50)
      const total = scores.reduce((s, n) => s + n, 0);
      const avg = scores.length ? Math.round(total / scores.length) : 0;
      
      // Count how many candidates meet threshold
      const matchCount = scores.filter((s) => s >= 50).length;

      return {
        ...job,
        avgMatchScore: avg,
        matchCount,
      };
    });

    return jobsWithMetrics;
  }, [rawJobs, candidates]);

  return { candidates, jobs };
};

