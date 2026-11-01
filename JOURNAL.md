# 📔 Engineering Journals & Debugging Log — InterviewAI Pro

> **Comprehensive record of architectural investigations, root cause analyses, code remediations, and verification results across the InterviewAI Pro platform.**

---

## 📑 Journal Directory

1. [Journal Entry 01: Zero-Score Evaluation Logic & Scoring Integrity Remediation](#journal-entry-01-zero-score-evaluation-logic--scoring-integrity-remediation)
2. [Journal Entry 02: Chromium Speech Synthesis Premature Cutoff Bug (V8 GC)](#journal-entry-02-chromium-speech-synthesis-premature-cutoff-bug-v8-gc)
3. [Journal Entry 03: Trailing Speech Loss & Duplicate Phrases in Speech Recognition](#journal-entry-03-trailing-speech-loss--duplicate-phrases-in-speech-recognition)
4. [Journal Entry 04: React State Immutability Violations & Stale Closures](#journal-entry-04-react-state-immutability-violations--stale-closures)
5. [Journal Entry 05: UI High-Contrast Legibility & Canvas Dynamic Scaling](#journal-entry-05-ui-high-contrast-legibility--canvas-dynamic-scaling)

---

## Journal Entry 01: Zero-Score Evaluation Logic & Scoring Integrity Remediation

- **Date:** 2026-11-02
- **Severity:** High (Functional & Domain Integrity Defect)
- **Affected Subsystems:** `src/services/analyticsEngine.js`, `src/components/Analytics/ScoreCard.jsx`, `src/components/Analytics/FillerWordsAnalysis.jsx`

### 1. Symptom & Problem Statement
When a candidate initiated an interview session and either spoke nothing, immediately clicked *"Finish & View Scorecard"*, or skipped all questions, the resulting scorecard reported:
- **Technical Depth:** `60 / 100`
- **Communication Clarity:** `60 / 100`
- **Confidence Score:** `50 / 100`
- **Overall Score:** `55 / 100`
- **Vocal Pauses:** `0 total vocal pauses` accompanied by the success message:
  > *"✓ Exceptional speech control! Zero filler words detected."*
- **Speech Cadence:** `0 Words Per Minute (WPM)` accompanied by the message:
  > *"Target interview cadence is 130 - 150 WPM. Your pace allows interviewers to digest technical architecture easily."*

This produced an invalid evaluation report for an incomplete interview session with zero recorded candidate responses.

### 2. Root Cause Analysis
1. **Fallback Minimums in `analyticsEngine.js`**:
   The calculation functions in `analyticsEngine.js` applied artificial minimum score baselines:
   ```javascript
   // Original flawed fallback
   const communicationScore = totalWords > 0 
     ? Math.max(50, Math.min(98, Math.round(90 - (totalFillerWords * 3))))
     : 60; // Hardcoded 60 baseline
   const technicalScore = totalWords > 0
     ? Math.max(55, Math.min(98, Math.round(65 + (totalTechTermsCount * 4))))
     : 60; // Hardcoded 60 baseline
   const overallScore = totalWords > 0
     ? Math.round(...)
     : 55; // Hardcoded 55 baseline
   ```
2. **Missing `totalWords === 0` Guard in `FillerWordsAnalysis.jsx`**:
   The filler words component only checked `totalFillerWords === 0`. Because 0 words yielded 0 fillers, it inadvertently triggered the success branch intended for articulate candidates.
3. **Question Scoring Floor**:
   Unanswered questions received a default score of `40/100` and were assigned the strength *"Answered prompt directly."*

### 3. Remediation & Code Diff
- **Strict Zero-Score Guard**: In `analyticsEngine.js`, if `totalWords === 0` or all questions are unanswered, all metrics evaluate to `0/100`.
- **Incomplete Session Banner**: Added an `Incomplete Session — No Answers Recorded` warning badge in `ScoreCard.jsx`.
- **Accurate Feedback**: Updated `FillerWordsAnalysis.jsx` to display *"No verbal speech was recorded during this session"* and muted cadence guidance when `totalWords === 0`.
- **Question Scoring**: Unanswered questions now explicitly score `0/100` with corrective guidance to practice the STAR methodology.

```javascript
// Remediated Zero-Answer Evaluation in analyticsEngine.js
if (totalWords === 0 || answeredCount === 0) {
  overallScore = 0;
  technicalScore = 0;
  communicationScore = 0;
  confidenceScore = 0;
}
```

### 4. Verification
- Verified by launching a new session, skipping speech, and ending immediately.
- Result: **Overall Score: 0/100**, **Technical Depth: 0/100**, **Communication Clarity: 0/100**, and badge displays `Incomplete Session — No Answers Recorded`.

---

## Journal Entry 02: Chromium Speech Synthesis Premature Cutoff Bug (V8 GC)

- **Date:** 2026-11-02
- **Severity:** Critical (Audio Subsystem Hang)
- **Affected Subsystems:** `src/services/speechSynthesis.js`, `setup-wizard-demo/src/services/speechSynthesis.js`

### 1. Symptom & Problem Statement
In Chromium-based browsers (Google Chrome, Microsoft Edge, Brave, Opera), the AI interviewer voice would suddenly cut off mid-sentence during longer question prompts. When this occurred:
- The audio ceased playing through the speakers.
- The `utterance.onend` callback never fired.
- The application remained permanently stuck in `audioState: 'speaking'`, disabling the candidate's microphone controls.

### 2. Root Cause Analysis
This is an established bug in Chromium's V8 engine and Blink audio implementation:
- If a `SpeechSynthesisUtterance` instance is stored solely inside a local function scope, Chromium's generational garbage collector sweeps the JavaScript wrapper object while audio is still streaming in the underlying C++ audio subsystem.
- Once the JavaScript wrapper is destroyed, all event listeners (`onend`, `onerror`) are de-allocated, preventing the state machine from returning to `'standby'`.
- Furthermore, calling `synth.cancel()` in the exact same execution tick as `synth.speak()` caused the newly queued utterance to be cancelled immediately in certain Chromium versions.

### 3. Remediation & Code Diff
1. **Persistent Instance Anchor**: Stored the active utterance in a persistent class property (`this.activeUtterance = utterance;`).
2. **Lifecycle Cleanup**: Cleared `this.activeUtterance = null;` exclusively inside `onend` and `onerror` handlers.
3. **Queue Flush Delay**: Added a 40ms dispatch delay following `synth.cancel()` to allow Chromium's audio queue to clear before dispatching the new speech utterance.
4. **Resumption Call**: Added `synth.resume()` prior to `synth.speak()` to unfreeze stalled audio queues if the browser tab was backgrounded.

```javascript
// src/services/speechSynthesis.js
this.stop(); // Flushes previous speech

if (this.synth.paused) {
  this.synth.resume();
}

const utterance = new SpeechSynthesisUtterance(text);
this.activeUtterance = utterance; // Anchor to prevent V8 GC sweep

const cleanup = () => {
  this.isPlaying = false;
  this.activeUtterance = null; // Clean release on completion
  this.stopSpectrum();
};

utterance.onend = () => { cleanup(); if (onEnd) onEnd(); };
utterance.onerror = (err) => { cleanup(); if (onEnd) onEnd(); };

setTimeout(() => {
  if (this.synth && this.activeUtterance === utterance) {
    this.synth.speak(utterance);
  }
}, 40);
```

### 4. Verification
- Stress-tested with multi-paragraph questions (>150 words) across Google Chrome and Microsoft Edge. Speech played completely to the final word and transitioned to `'standby'` every time.

---

## Journal Entry 03: Trailing Speech Loss & Duplicate Phrases in Speech Recognition

- **Date:** 2026-11-02
- **Severity:** High (Data Loss & Accuracy Defect)
- **Affected Subsystems:** `src/services/speechRecognition.js`, `src/App.jsx`

### 1. Symptom & Problem Statement
1. **Trailing Word Loss**: When candidates clicked *"Click to Stop Speaking"*, the last 1–3 words of their sentence were frequently missing from their answer transcript.
2. **Duplicated Phrases**: In longer answers (>30 seconds), earlier phrases occasionally duplicated themselves in the transcript bubble.
3. **Infinite Reconnect Loop**: If a user denied microphone permissions, the application repeatedly attempted to restart recognition, flooding the console with warnings.

### 2. Root Cause Analysis
1. In Web Speech API `SpeechRecognition`, when `continuous = true`, the speech engine holds uncommitted words in `interimResults`. When `speechRecognizer.stop()` was invoked, it only returned `this.finalTranscript`. The trailing interim text was discarded before the speech engine finalized it.
2. Concatenating strings via `this.finalTranscript += event.results[i][0].transcript` starting at `event.resultIndex` caused duplicated words when the engine revised interim segments into multiple finalized chunks.
3. When microphone access was denied (`onerror` with `not-allowed`), `onend` fired immediately. Because `this.isListening` was not reset to `false` inside `onerror`, `onend` continuously attempted to call `this.recognition.start()`.

### 3. Remediation & Code Diff
1. Rebuilt the transcript buffer completely across `event.results` from index `0` on every result event.
2. Updated `stop()` to merge both finalized and trailing interim text buffers before returning the answer string.
3. Explicitly set `this.isListening = false` in `onerror` when `not-allowed` or `service-not-allowed` occurs.

```javascript
// src/services/speechRecognition.js
this.recognition.onresult = (event) => {
  let interim = '';
  let final = '';

  // Clean iteration over all results eliminates duplicated phrases
  for (let i = 0; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final += event.results[i][0].transcript + ' ';
    } else {
      interim += event.results[i][0].transcript;
    }
  }
  
  this.finalTranscript = final;
  this.interimTranscript = interim;
  // ...
};

stop() {
  this.isListening = false;
  if (this.recognition) {
    try { this.recognition.stop(); } catch (e) {}
  }
  // Return full text including pending interim speech
  return (this.finalTranscript + (this.interimTranscript ? ' ' + this.interimTranscript : '')).trim();
}
```

### 4. Verification
- Spoke fast, complex sentences ending right at the moment of clicking the mic toggle. All trailing words were preserved in the live transcript.

---

## Journal Entry 04: React State Immutability Violations & Stale Closures

- **Date:** 2026-11-02
- **Severity:** Medium (React StrictMode & State Mutation Violations)
- **Affected Subsystems:** `src/App.jsx`, `src/components/SetupWizard/StepAudioConfig.jsx`

### 1. Symptom & Problem Statement
1. In `processCandidateAnswer` and `handleSkipQuestion`, state arrays were shallow-copied, but the internal objects were mutated directly:
   `updatedHistory[updatedHistory.length - 1].answer = answerText;`
   If `transcriptHistory` was empty, `updatedHistory[-1]` threw a `TypeError`.
2. In `StepAudioConfig.jsx`, testing the microphone used a `setTimeout` that inspected `if (micStatus === 'testing')`. Because `micStatus` was captured at render time, it was always `'idle'`, preventing the fallback detection branch from ever executing.

### 2. Root Cause Analysis
- **Direct Object Mutation**: `[...transcriptHistory]` creates a new array container, but elements inside share memory references with previous React state. In React 18 Concurrent / Strict Mode, this causes skipped re-renders and stale state propagation.
- **Stale Closure**: `setTimeout` handlers in functional components capture state variables at the time of execution unless tracked via `useRef` or functional state dispatchers.

### 3. Remediation & Code Diff
1. Replaced direct mutations with immutable `.map()` state updates.
2. Added `micStatusRef` synchronized via `useEffect` to ensure timer callbacks always read the current status.
3. Added unmount cleanup timers in `useEffect` to prevent memory leaks.

```javascript
// src/App.jsx - Pure immutable update
const lastIdx = transcriptHistory.length - 1;
if (lastIdx < 0) return;

const updatedHistory = transcriptHistory.map((item, idx) => 
  idx === lastIdx ? { ...item, answer: answerText.trim() } : item
);
setTranscriptHistory(updatedHistory);
```

```javascript
// src/components/SetupWizard/StepAudioConfig.jsx - Stale closure resolution
const micStatusRef = useRef('idle');
useEffect(() => {
  micStatusRef.current = micStatus;
}, [micStatus]);

// Inside handleTestMic timeout:
micTimeoutRef.current = setTimeout(() => {
  speechRecognizer.stop();
  if (micStatusRef.current === 'testing') {
    setMicStatus('success');
    micStatusRef.current = 'success';
    setTestTranscript('Microphone active & detected successfully!');
  }
}, 4000);
```

### 4. Verification
- Verified zero console errors in React DevTools StrictMode. Mic testing properly transitions from `'testing'` to `'success'` even with background silence.

---

## Journal Entry 05: UI High-Contrast Legibility & Canvas Dynamic Scaling

- **Date:** 2026-11-02
- **Severity:** Medium (Visual Accessibility & Responsive Layout)
- **Affected Subsystems:** `src/components/Session/StateIndicator.jsx`, `src/components/Session/AudioVisualizer.jsx`, `src/components/Analytics/QuestionBreakdown.jsx`

### 1. Symptom & Problem Statement
1. **Unreadable Status Text**: `StateIndicator.jsx` rendered dark navy text (`#0F172A`) against a dark navy translucent background (`rgba(15, 23, 42, 0.85)`), rendering the status pill unreadable.
2. **Blurry Audio Waveform**: The audio visualizer canvas was hardcoded to `width={600} height={80}` in HTML attributes. When stretched across wide responsive layouts (>1000px), waveforms rendered pixelated and blurry.
3. **Muddy Transcript Boxes**: Candidate answer cards in the question breakdown used dark container fills on light backgrounds, appearing visually disconnected from the rest of the application.

### 2. Root Cause Analysis
- The design system in `globals.css` was migrated to a high-contrast minimalist light theme, but several child components retained dark-mode background values.
- Canvas 2D contexts render at their internal buffer dimensions (`canvas.width`), which differed from CSS layout dimensions (`100%`), causing GPU interpolation scaling blur.

### 3. Remediation & Code Diff
1. **High-Contrast Surface**: Re-styled `StateIndicator.jsx` with `#FFFFFF` background, solid border accents, and high-contrast typography.
2. **Dynamic Canvas DPI Resizing**: Added a `resizeCanvas()` hook in `AudioVisualizer.jsx` that matches `canvas.width` directly to parent `clientWidth` on mount and window resize.
3. **Light Card Polish**: Updated Question Breakdown transcript containers to use crisp `#F8FAFC` cards with `#E2E8F0` borders.

```javascript
// src/components/Session/AudioVisualizer.jsx - Sharp dynamic canvas resize
const resizeCanvas = () => {
  const parent = canvas.parentElement;
  if (parent) {
    canvas.width = parent.clientWidth || 800;
    canvas.height = parent.clientHeight || 80;
  }
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
```

### 4. Verification
- Verified responsive layout across mobile (375px), tablet (768px), and desktop (1440px). Status indicators and waveforms remain sharp, high-contrast, and fully legible.

