# HireFlow Prototype — AI Candidate Screening

HireFlow is a lightweight prototype for AI-assisted candidate screening. It auto-matches candidates to jobs, conducts mock interviews, and ranks candidates based on aggregated scores.

## Features

- **Auto Job Matching**: Upload resume → automatically match to best-fit job based on skills
- **Average Scoring**: Compute average match score across all candidates
- **Top Candidate Display**: Show highest-scoring candidate with percentile ranking
- **Mock 5-Question Interview**: Collect responses with posture/voice analysis heuristics
- **Responsive UI**: Sidebar navigation, animated components, professional SCSS styling
- **Single-Click Interaction**: Cards are click-once to prevent accidental re-selection

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: SCSS modules (migrated from @import to @use)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Hooks**: Custom React hooks for mock data and analysis

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── pages/
│   ├── Dashboard.tsx              # Main app hub (shows uploaded candidates, jobs they applied for)
│   ├── CandidateInterview.tsx     # Candidate interview page (unused, kept for future)
│   ├── MatchResults.tsx           # Match results page (unused)
│   └── UploadResume.tsx           # Upload page (unused, integrated into Dashboard)
│
├── components/
│   ├── Sidebar.tsx                # Left sidebar navigation with gradient background
│   ├── ResumeUploader.tsx         # Drag-drop PDF upload component
│   ├── JobSelector.tsx            # Display jobs applied for (non-interactive, reference only)
│   ├── CandidateList.tsx          # Grid of candidate cards with metrics
│   ├── CandidateCard.tsx          # Individual candidate card (name, role, match score, skills, summary)
│   ├── DashBoardMetrics.tsx       # Stats: total candidates, avg match score, top candidate + percentile
│   ├── Navbar.tsx                 # Top navigation (unused)
│   ├── AIInterview/
│   │   ├── AIInterview.tsx        # Main interview flow (5 questions, per-question scoring)
│   │   ├── SummaryReport.tsx      # Interview results (cheating risk, posture, voice, overall score)
│   │   ├── PostureAnalyzer.tsx    # Posture analysis mock (per-question hook)
│   │   └── VoiceAnalyzer.tsx      # Voice analysis mock (per-question hook)
│   └── UI/
│       ├── Button.tsx             # Reusable button component
│       ├── Card.tsx               # Reusable card component
│       └── Modal.tsx              # Reusable modal component
│
├── hooks/
│   ├── useMockData.tsx            # Fetch & normalize candidates.json + jobs.json, compute per-job averages
│   ├── useInterviewAI.ts          # Compute AI interview summary from candidate + posture/voice (memoized)
│   ├── usePostureAnalysis.tsx     # Return mock posture score + stability
│   └── useVoiceAnalysis.tsx       # Return mock voice confidence + tone
│
├── utils/
│   ├── candidateExtraction.ts     # Extract candidate from mock data, auto-match to best job by skills
│   ├── mockAI.ts                  # Generate per-question interview results, aggregates, tone
│   ├── formatters.ts              # Date/text formatting utilities
│   └── logger.ts                  # Logging utility
│
├── types/
│   ├── candidate.d.ts             # Candidate interface (name, skills, match score, interview fields)
│   ├── job.d.ts                   # Job interface (title, skills required, experience, avg match metrics)
│   ├── interview.ts               # Interview types (InterviewQuestionResult, AIInterviewResult)
│   └── match.d.ts                 # Match types (unused)
│
├── data/
│   ├── candidates.json            # Mock candidate pool (name, skills, experience, location)
│   └── jobs.json                  # Job postings (title, skills required, experience, location)
│
├── styles/
│   ├── variables.scss             # Color palette, fonts, spacing tokens (@use prefix)
│   ├── globals.scss               # Global resets
│   ├── mixins.scss                # Sass mixins
│   ├── components.scss            # Sidebar styling (gradient, animations)
│   ├── dashboard.module.scss      # Dashboard layout (sidebar + main content, responsive)
│   ├── components/
│   │   └── CandidateCard.module.scss  # Card styling (no ellipsis, full text wrap)
│   ├── CandidateList.module.scss  # Grid layout for candidate cards
│   ├── JobSelector.module.scss    # Grid layout for job cards (reference display)
│   ├── ResumeUploader.module.scss # Drag-drop upload styling
│   ├── DashboardMetrics.module.scss   # Metrics card styling
│   ├── AIInterview.module.scss    # Interview container styling
│   ├── AIInterviewPage.module.scss    # Interview page styling
│   ├── MatchResults.module.scss   # Match results styling
│   ├── UploadResume.module.scss   # Upload page styling
│   └── UI.module.scss             # Button, Card, Modal styling
│
├── App.tsx                        # Root component (renders Dashboard)
├── main.tsx                       # React entry point
├── index.css                      # Base styles
└── App.css                        # App-level styles
```

## Data Flow

1. **Dashboard loads** → fetch candidates.json + jobs.json via `useMockData`
2. **User uploads resume** (PDF) → `ResumeUploader` calls `handleResumeUpload`
3. **Extract candidate** → `extractCandidateFromMock` finds best matching candidate in mock pool, auto-selects best job by skill overlap
4. **Add to localAdds** → candidate appears in CandidateList with auto-matched job role + computed match score
5. **useMockData recomputes jobs** → avg match score updated across all jobs based on all candidates (base + uploaded)
6. **DashboardMetrics updates** → shows total candidates, average match score, top candidate + percentile
7. **Jobs show only after upload** → "Applied for Positions" section appears with jobs that candidates matched to
8. **Click candidate → Start interview** → AIInterview collects 5 responses, posture/voice per question, generates summary
9. **Interview complete** → Update candidate with totalScore, cheatingRisk, voiceConfidence, postureScore
10. **Metrics refresh** → Top candidate and averages recalculate in real-time

## Key Concepts

### Average Match Score
- Computed for **each job** based on **all candidates** (mock pool + uploaded resumes)
- Formula: `70% skill match + 30% experience match`, averaged across all applicants
- Displayed in Dashboard metrics and JobSelector

### Top Candidate
- Candidate with highest individual match score at any given moment
- Shows name, match %, and percentile relative to other candidates
- Updates dynamically as candidates are uploaded/interviewed

### Job Auto-Matching
- When a resume is uploaded, `extractCandidateFromMock` finds the best matching job
- Matching is based on keyword overlap: skills in resume that exist in job's required skills
- The matched job becomes the candidate's `role` field

### Keyword Matching
- **Source**: Candidate skills (from mock pool or uploaded file metadata)
- **Target**: Job `skillsRequired` array from jobs.json
- **Scope**: Used in both candidate extraction and job average score computation

### Single-Click Safety
- CandidateCard uses `clickedCandidateId` state to prevent re-selection
- Once clicked, that candidate's interview opens and further clicks are ignored until interview completes

## Unused Files

The following components/pages are kept for future expansion but not used in current flow:

- `pages/CandidateInterview.tsx` — Dedicated interview page (currently integrated in modal/overlay)
- `pages/MatchResults.tsx` — Detailed match results (future feature)
- `pages/UploadResume.tsx` — Standalone upload page (now in Dashboard)
- `components/Navbar.tsx` — Top navigation (replaced by Sidebar)
- `types/match.d.ts` — Match type definitions (logic integrated into Candidate + Job types)

These files are not exported or used; they can be safely deleted when project is finalized.

## Notes

- All SCSS now uses `@use` instead of deprecated `@import` to avoid Dart Sass 3.0 warnings
- CandidateCard text uses `word-break: break-word; overflow-wrap: break-word;` to prevent overflow; no ellipsis truncation
- Interview and metrics recompute via `useMemo` to avoid unnecessary re-renders and setState-in-effect lint warnings
- Mock data (candidates, jobs) hardcoded in hooks and utilities for prototype simplicity; easily swappable with real API calls
- `index.html` — Entry HTML template

### `/src` — Source Code

#### `/src/main.tsx`
Application entry point; mounts React app into DOM.

#### `/src/App.tsx`
Root component that renders the Dashboard page.

#### `/src/pages/`
Top-level views:
- **Dashboard.tsx** — Main view: upload resumes, view candidates, start interviews. Shows:
  - Dashboard metrics (avg score, total candidates, top candidate %)
  - Upload resume section (drag-drop or click-to-upload)
  - Applied for Positions (jobs matched by candidates' skills)
  - Candidates list (clickable cards to start interview)
- **CandidateInterview.tsx** — (Legacy placeholder) Interview flow for a single candidate
- **MatchResults.tsx** — (Legacy placeholder) Results display after interview
- **UploadResume.tsx** — (Legacy placeholder) Resume upload flow

#### `/src/components/`
Reusable UI components:
- **CandidateCard.tsx** — Displays candidate name, role, skills match score, AI metrics (voice, posture, cheating risk), and summary
- **CandidateList.tsx** — Grid layout of candidate cards with animation
- **JobSelector.tsx** — Display applied-for positions with avg match % and candidate counts (reference-only after upload)
- **ResumeUploader.tsx** — Drag-drop zone to upload PDF/DOC resumes
- **DashBoardMetrics.tsx** — Summary metrics: total candidates, avg score, top candidate with %
- **Sidebar.tsx** — Navigation sidebar with menu items (Home, Candidates, Upload, AI Interview, Settings)
- **Navbar.tsx** — (Legacy) Top navigation placeholder

##### `/src/components/AIInterview/`
Interview workflow components:
- **AIInterview.tsx** — Main interview modal:
  - Displays 5 predefined questions
  - Per-question logic: samples posture/voice via hooks, captures user input
  - Computes aggregated metrics (avg voice, avg posture, overall score)
  - Calls `onComplete` callback with updated candidate object (scores, summary, cheating risk)
- **SummaryReport.tsx** — Post-interview summary card showing cheating risk level, voice confidence %, posture score %, overall score, and AI-generated summary
- **PostureAnalyzer.tsx** — Simulates posture analysis; returns {score, stability, movementDetected}
- **VoiceAnalyzer.tsx** — Simulates voice analysis; returns {confidence, tone}

##### `/src/components/UI/`
Primitive UI components:
- **Card.tsx** — Container with shadow and padding (used by CandidateCard)
- **Button.tsx** — Styled button with variants (primary, secondary, danger)
- **Modal.tsx** — Modal dialog wrapper (used by AIInterview)

#### `/src/hooks/`
Custom React hooks:
- **useMockData.tsx** — Loads candidates.json and jobs.json, computes per-job avg match score and candidate counts based on current candidates
- **useInterviewAI.ts** — Returns memoized AI interview summary for a candidate (combines base candidate info with posture/voice from hooks)
- **usePostureAnalysis.tsx** — Generates mock posture analysis result (called per-question in AIInterview)
- **useVoiceAnalysis.tsx** — Generates mock voice analysis result (called per-question in AIInterview)

#### `/src/utils/`
Utility functions:
- **candidateExtraction.ts** — `extractCandidateFromMock()`:
  - Matches uploaded file name to mock candidate database (similarity matching)
  - Auto-selects best job from jobs.json based on skill overlap
  - Computes initial match score
  - Returns Candidate object ready for interview
- **mockAI.ts** — `generateAIInterviewSummary()` + helper to mock per-question results and aggregates
- **formatters.ts** — Text formatting utilities
- **logger.ts** — Simple logging utility

#### `/src/types/`
TypeScript type definitions:
- **candidate.d.ts** — `Candidate` interface: id, name, email, role, experience, skills, resumeUrl, plus optional fields (matchScore, voiceConfidence, postureScore, cheatingRisk, aiSummary, totalScore)
- **interview.ts** — `InterviewQuestionResult`, `AIInterviewResult`, `AIInterviewSession` interfaces defining per-question and aggregated interview data
- **interview.d.ts** — Re-exports from interview.ts for compatibility
- **job.d.ts** — `Job` interface: id, title, location, skillsRequired[], experienceRequired, avgMatchScore?, matchCount?
- **match.d.ts** — (Placeholder) Match scoring types

#### `/src/data/`
Mock data:
- **candidates.json** — Preloaded candidate profiles (5 examples):
  ```json
  [
    {
      "id": 1,
      "name": "Priya Sharma",
      "skills": ["React", "Node.js", "MongoDB", "TypeScript"],
      "experience": 3,
      "location": "Bangalore",
      "resume": "resumes/priya-sharma.pdf"
    },
    ...
  ]
  ```
- **jobs.json** — Job postings with skills and experience requirements (5 examples):
  ```json
  [
    {
      "id": 1,
      "title": "Frontend Developer",
      "skillsRequired": ["React", "TypeScript", "Sass", "Redux"],
      "experienceRequired": 2,
      "location": "Bangalore"
    },
    ...
  ]
  ```

#### `/src/styles/`
SCSS stylesheets:
- **variables.scss** — Design tokens: colors ($primary, $secondary, $accent), neutral palette, shadows, border radii
- **globals.scss** — Global styles (reset, typography defaults)
- **mixins.scss** — Reusable SCSS mixins
- **components.scss** — Sidebar styles
- **dashboard.module.scss** — Dashboard layout with sidebar flex + main content area
- **CandidateList.module.scss** — Responsive grid for candidate cards
- **components/CandidateCard.module.scss** — Card styling: header, metrics (grid layout with icons), summary section, text wrapping without ellipsis
- **JobSelector.module.scss** — Job reference cards with avg match %, candidate count, selected state
- **ResumeUploader.module.scss** — Drag-drop zone styling
- **DashboardMetrics.module.scss** — Metrics container (flex row with cards)
- **UI.module.scss** — Button and primitive UI styles
- **AIInterview.module.scss** — Interview modal and question display
- **AIInterviewPage.module.scss** — Interview page layout
- **MatchResults.module.scss** — Results page styling
- **UploadResume.module.scss** — Upload page styling

#### `/src/index.css` & `/src/App.css`
Global and app-level CSS (light theme, font defaults)

### `/public/`
Static assets (favicon, public files)

---

## How to Use the Prototype

### Workflow

1. **Start Dashboard**: App opens to the HireFlow Dashboard.

2. **Upload Resume**:
   - Click the "Upload Resume" card or drag-drop a PDF/DOC file.
   - The app auto-extracts candidate info from mock data (by name similarity).
   - Auto-selects the best matching job from `jobs.json` based on skill overlap.
   - Candidate is added to the list with initial match score.
   - "Applied for Positions" section now appears showing the matched job(s).

3. **Review Candidate**:
   - See candidate card with name, role, experience, match score.
   - Dashboard Metrics show total candidates and top candidate % score.

4. **Start Interview** (Click candidate card once):
   - Modal opens showing the candidate name and first question.
   - Answer the question or click "Next" to advance.
   - Each question samples posture/voice from mock hooks.
   - After 5 questions, interview completes.

5. **View Results**:
   - SummaryReport shows cheating risk level (Low/Medium/High), voice confidence %, posture score %, overall score.
   - Candidate card updates with AI summary and scores.
   - Dashboard Metrics recalculate avg score and top candidate %.

### Key Features

- **Auto Job Matching**: Candidate skills matched to jobs.json keywords; best match assigned automatically
- **Single Interview per Candidate**: Card clickable once to prevent duplicate interviews
- **Average Scoring**: Dashboard shows avg totalScore across all candidates who completed interviews
- **Top Candidate Badge**: DashboardMetrics highlights the highest-scoring candidate with their % score
- **Responsive Layout**: Sidebar (hidden on mobile), main content scales with viewport
- **No Text Overflow**: All candidate card text wraps within card bounds; no ellipsis

---

## Data & Keyword Consistency

### How Keywords Align

- **jobs.json** defines job requirements: `skillsRequired` array (e.g., ["React", "TypeScript", "Sass", "Redux"])
- **candidates.json** defines candidate profiles: `skills` array (e.g., ["React", "Node.js", "MongoDB", "TypeScript"])
- **Interview questions** may reference similar skills to validate knowledge
- **extractCandidateFromMock()** matches candidate skills to job requirements for scoring

### Example Match

| Candidate Skill | Job Requirement | Match? |
|-----------------|-----------------|--------|
| React           | React           | ✓      |
| Node.js         | React           | ✗      |
| TypeScript      | TypeScript      | ✓      |

**Match Score** = (2 matched skills / 4 required skills) × 100 = 50%

---

## Notes & Recommendations

- **Mock AI**: All AI analysis (interview summary, posture, voice) is mocked in `src/utils/mockAI.ts`. Replace with real LLM/speech/vision APIs for production.
- **Real Posture/Voice**: Use MediaPipe for posture, OpenAI Whisper or similar for voice-to-text.
- **Database Integration**: Replace `candidates.json` / `jobs.json` with API calls to a backend.
- **Styling**: Keep component styles in `.module.scss` files; import design tokens from `variables.scss`.
- **Type Safety**: Use strict TypeScript; avoid `any` types (use `unknown` if needed).

---

## Building for Production

```bash
npm run build       # Bundles with Vite
npm run preview     # Preview production build locally
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript check (if tsconfig allows)
```

---

## License & Attribution

This prototype is provided as-is for demo and experimentation purposes. Add a proper license file if publishing.

---

## Author

- **Eleton Masombuka** — HireFlow Prototype Lead