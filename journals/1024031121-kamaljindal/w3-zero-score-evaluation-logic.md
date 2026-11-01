# Week 3 : Zero-Score Evaluation Logic & Scorecard Integrity Remediation

## 1. Problem Statement & Error

When a candidate initiated a mock interview session and submitted zero speech (or immediately clicked *"Finish & View Scorecard"* without speaking or typing), the evaluation engine produced an inaccurate scorecard:

```text
Overall Score: 55 / 100
Technical Depth: 60 / 100
Communication Clarity: 60 / 100
Confidence Score: 50 / 100
Question 1 Score: 40 / 100
Vocal Pauses: 0 total pauses
Status: "✓ Exceptional speech control! Zero filler words detected."
Pace: 0 WPM ("Your pace allows interviewers to digest technical architecture easily.")
```

A session with zero verbal or written responses should never receive passing marks (`60/100`) or praise for speech cadence and control.

---

## 2. Relevant Context

In `src/services/analyticsEngine.js`, the session referee computes metrics by parsing candidate transcripts:

```javascript
// File: src/services/analyticsEngine.js
transcriptHistory.forEach((item, index) => {
  const answerText = item.answer || '';
  const words = answerText.trim() ? answerText.trim().split(/\s+/) : [];
  // ...
  if (wordCount < 10) score -= 25;
  // If wordCount === 0, score resulted in 45/100
});
```

In `src/components/Analytics/FillerWordsAnalysis.jsx`, filler words were displayed using a ternary:

```jsx
// File: src/components/Analytics/FillerWordsAnalysis.jsx
{fillerEntries.length === 0 ? (
  <div><Check size={16} /> Exceptional speech control! Zero filler words detected.</div>
) : ( ... )}
```

---

## 3. Key Observation & Root Cause

1. **Hardcoded Fallback Minimums**:
   `analyticsEngine.js` applied artificial minimum floors (`60` for technical score, `60` for communication, `55` for overall, and `40` for individual questions) instead of checking if any candidate answers existed:
   ```javascript
   const communicationScore = totalWords > 0 
     ? Math.max(50, Math.min(98, Math.round(90 - (totalFillerWords * 3))))
     : 60; // Flawed fallback minimum
   const technicalScore = totalWords > 0
     ? Math.max(55, Math.min(98, Math.round(65 + (totalTechTermsCount * 4))))
     : 60; // Flawed fallback minimum
   ```

2. **Flawed Zero-Filler Logic**:
   `FillerWordsAnalysis.jsx` only verified `fillerEntries.length === 0`. Because 0 spoken words produced 0 detected fillers, the component assumed perfect speech articulation rather than total absence of speech.

3. **Inappropriate Strengths Feedback**:
   Unanswered prompts were assigned `strengths: ["Answered prompt directly."]`.

---

## 4. Solution & Remediation

1. **Strict Zero-Answer Check**:
   In `src/services/analyticsEngine.js`, if `totalWords === 0` or all questions are unanswered, all score metrics evaluate strictly to `0/100`:

   ```javascript
   if (totalWords === 0 || answeredCount === 0) {
     overallScore = 0;
     technicalScore = 0;
     communicationScore = 0;
     confidenceScore = 0;
   }
   ```

2. **Accurate Incomplete Session Status**:
   In `src/components/Analytics/ScoreCard.jsx`, replaced the green `Performance Evaluated` badge with an amber `⚠️ Incomplete Session — No Answers Recorded` badge when `overallScore === 0`.

3. **Conditional Speech Feedback**:
   In `src/components/Analytics/FillerWordsAnalysis.jsx`, added a condition checking `hasSpoken`:

   ```jsx
   {!hasSpoken ? (
     <div className="badge-muted">No verbal speech was recorded during this session.</div>
   ) : fillerEntries.length === 0 ? (
     <div className="badge-emerald">Exceptional speech control! Zero filler words detected.</div>
   ) : ( ... )}
   ```

4. **Correct Question Score & Feedback**:
   Unanswered questions now score `0/100` with the feedback: *"No verbal or typed answer was recorded. Practice formulating an answer using the STAR method."*

---

## 5. Verification & Testing

- Tested empty session by starting interview and clicking *"Finish & View Scorecard"* with 0 words spoken.
- Verified output:
  - **Overall Score**: `0 / 100`
  - **Technical Depth**: `0 / 100`
  - **Communication Clarity**: `0 / 100`
  - **Question Breakdown**: `Score: 0 / 100`
  - **Banner**: `⚠️ Incomplete Session — No Answers Recorded`

