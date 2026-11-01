# 🤖 AGENTS.md — AI Agent Guidance & Coding Standards

> **This document provides autonomous AI agents, assistants, and human contributors with comprehensive architectural rules, coding standards, environment instructions, and operational workflows for the InterviewAI Pro repository.**

---

## 🎯 Project Overview & Mission

**InterviewAI Pro** is an open-source, client-side, real-time voice mock interview simulator built with React 18 and Vite. It combines browser-native Web Speech APIs (Speech Recognition & Speech Synthesis), procedural HTML5 Canvas audio visualizations, a multi-provider AI Engine (offline heuristic smart simulator + OpenAI + Google Gemini), and a post-interview analytics evaluation referee that calculates technical depth, communication clarity, confidence, speech cadence (WPM), and vocal pauses.

---

## 🛠️ Technology Stack & Dependencies

| Layer | Technology | Specification / Version |
| :--- | :--- | :--- |
| **Framework** | React 18 | `react@^18.2.0`, `react-dom@^18.2.0` (Virtual DOM, Hooks) |
| **Tooling & Bundler** | Vite 5 | `vite@^5.1.4`, `@vitejs/plugin-react@^4.2.1` (ESM, Rollup) |
| **Icons** | Lucide React | `lucide-react@^0.344.0` |
| **Voice STT** | Web Speech API | `window.SpeechRecognition` / `webkitSpeechRecognition` |
| **Voice TTS** | Web Speech API | `window.speechSynthesis`, `SpeechSynthesisUtterance` |
| **Audio Waveform** | HTML5 Canvas 2D | Dynamic 60 FPS sine-wave parametric canvas renderer |
| **AI Layer** | Hybrid Multi-Router | Offline Smart Simulator, OpenAI Chat API, Gemini 1.5 Flash |
| **Styling** | Modern CSS System | CSS Variables (`:root`), Responsive Grid, Minimalist light theme |

---

## 🏗️ Codebase Layout

```
SE Project/
├── index.html                   # HTML5 Entry Point with Google Fonts (Inter & Outfit)
├── package.json                 # Project dependencies and script definitions
├── vite.config.js               # Vite dev server (port 3000) and React plugin config
├── .gitignore                   # Ignored files (node_modules, dist, .env, cache)
├── AGENTS.md                    # Agent developer instructions & conventions (This file)
├── ARCHITECTURE.md              # Visual pipeline and system architecture diagrams
├── PLAN.md                      # Milestone roadmap and upcoming features
├── PROGRESS.md                  # Implementation tracking, verified bugfixes, and status
├── README.md                    # Detailed architectural and layman's documentation
│
├── src/                         # Primary Production Application
│   ├── main.jsx                 # React root mount into #root
│   ├── App.jsx                  # Top-level state orchestrator & view navigator
│   ├── data/
│   │   └── presets.js           # Job presets, initial questions, interviewer personas
│   ├── services/
│   │   ├── speechRecognition.js # Continuous STT service with trailing interim preservation
│   │   ├── speechSynthesis.js   # TTS service with Chromium GC protection & voice change events
│   │   ├── aiEngine.js          # Router for OpenAI, Gemini, and offline rule simulator
│   │   └── analyticsEngine.js   # Session evaluator for scorecards, WPM, and filler analysis
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky nav with live AI engine badge & reset triggers
│   │   ├── SetupWizard/
│   │   │   ├── StepJobInput.jsx     # Wizard Step 1: Preset or custom job spec input
│   │   │   ├── StepPersona.jsx      # Wizard Step 2: AI Interviewer persona selector
│   │   │   └── StepAudioConfig.jsx  # Wizard Step 3: Mic input test & voice accent preview
│   │   ├── Session/
│   │   │   ├── StateIndicator.jsx   # Pill status indicator (listening/thinking/speaking/standby)
│   │   │   ├── AudioVisualizer.jsx  # 60 FPS responsive HTML5 Canvas wave visualizer
│   │   │   ├── LiveTranscript.jsx   # Real-time chat feed with speech bubbles & fallback input
│   │   │   └── ControlToolbar.jsx   # Mic toggle, hint request, skip question, end session
│   │   ├── Analytics/
│   │   │   ├── ScoreCard.jsx        # Overall score ring, sub-metrics, export trigger
│   │   │   ├── FillerWordsAnalysis.jsx # Vocal pauses counter, frequency chips, WPM gauge
│   │   │   └── QuestionBreakdown.jsx# Accordion breakdown with strengths & improvements
│   │   └── Modals/
│   │       ├── ApiSettingsModal.jsx # API key configuration (OpenAI / Gemini) in localStorage
│   │       └── ExportModal.jsx      # Markdown report generator & clipboard copy
│   └── styles/
│       ├── globals.css          # Design tokens, typography, button styles, badges, inputs
│       └── animations.css       # Keyframes: mic breath, pulse rings, shimmer skeleton
│
└── setup-wizard-demo/           # Standalone Demo Sub-project (Runs on port 3001)
    ├── package.json
    ├── vite.config.js
    └── src/
```

---

## 🔒 Mandatory Agent Guardrails & Conventions

### 1. Web Speech API Guardrails
- **Chromium SpeechSynthesis Garbage Collection Bug**: Chromium browsers aggressively garbage-collect active `SpeechSynthesisUtterance` instances if stored only in function scope, causing speech to cut off mid-sentence and never firing `onend`. Always store active utterances in a class property (`this.activeUtterance = utterance;`) and release on `onend`/`onerror`.
- **SpeechSynthesis Cancellation Quirk**: Never call `synth.speak()` in the exact same event cycle immediately following `synth.cancel()`; delay playback by 30–50ms using a `setTimeout` to allow browser audio queues to flush cleanly.
- **SpeechRecognition Interim Data**: When `continuous = true`, rebuild text across `event.results` from index `0`. When stopping recognition, always return both finalized and trailing interim text so user speech ending right before clicking stop is never lost.
- **Voice Loading Asynchrony**: In Chrome, `speechSynthesis.getVoices()` returns empty on initial execution. Always hook `voiceschanged` event listeners and provide an unsubscribe callback to React components.

### 2. React State & Immutability Rules
- **No Direct State Mutation**: Never mutate arrays or objects stored in React state (e.g., `updatedHistory[lastIdx].answer = text`). Always use immutable patterns:
  ```javascript
  const updatedHistory = transcriptHistory.map((item, idx) => 
    idx === lastIndex ? { ...item, answer: text } : item
  );
  ```
- **Stale Closure Prevention**: When scheduling `setTimeout` or `setInterval` handlers that check component state (e.g., `micStatus`), use a `useRef` tracker (e.g., `micStatusRef.current = micStatus;`) or functional state updates. Always clear active timers on unmount.

### 3. Analytics Scoring Integrity
- **Zero-Answer Sessions**: If `totalWords === 0` or all questions are unanswered:
  - Overall score MUST be `0/100`.
  - Individual question scores MUST be `0/100`.
  - Never generate false praise such as *"Exceptional speech control"* or *"Answered prompt directly"* when no speech or answers were recorded.
  - Display the `Incomplete Session` status badge instead of `Performance Evaluated`.

### 4. UI & Styling Rules
- **High-Contrast Legibility**: Maintain strict contrast between text (`var(--text-primary): #0F172A`) and container surfaces. Never put dark text on dark surfaces or transparent backgrounds without a solid card backdrop.
- **Valid React Props**: Do not pass non-standard HTML attributes like `uppercase="true"`; use valid CSS styles (`textTransform: 'uppercase'`).
- **Responsive Canvas**: Never leave `<canvas>` at fixed dimensions without handling parent container resizing. Always scale canvas dimensions dynamically on window resize.

---

## 💻 Developer & Agent Command Reference

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production (verifies syntax, bundling, and asset minification)
npm run build

# Preview production build locally
npm run preview

# Standalone setup-wizard-demo sub-project (http://localhost:3001)
npm --prefix setup-wizard-demo run dev
npm --prefix setup-wizard-demo run build
```

---

## ✅ Pre-Commit & Verification Checklist for Agents

1. [ ] Run `npm run build` in root and verify zero compilation errors.
2. [ ] Run `npm --prefix setup-wizard-demo run build` and verify clean build.
3. [ ] Verify speech services check `typeof window !== 'undefined'`.
4. [ ] Ensure no `console.error` warnings about unrecognized DOM attributes or invalid props.
5. [ ] Verify that unanswering a question yields a score of `0/100` rather than false scores.
6. [ ] Confirm that active provider changes in `ApiSettingsModal` propagate immediately to the Navbar badge.

