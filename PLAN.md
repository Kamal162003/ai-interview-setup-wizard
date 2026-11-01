# 📋 PLAN.md — Project Roadmap, Milestones & Engineering Plan

> **Strategic roadmap, architectural milestones, completed deliverables, and upcoming engineering initiatives for InterviewAI Pro.**

---

## 🎯 Project Vision

To provide developers, engineers, and professionals with a free, high-fidelity, real-time AI mock interview simulator that requires zero paid cloud infrastructure by leveraging browser-native speech processing, intelligent heuristic evaluation, and flexible cloud LLM connectivity.

---

## 🗺️ Milestone Roadmap

```
  ┌──────────────────────────────────────────────────────────────┐
  │                 PHASE 1: Foundation & Wizard                 │  [COMPLETED]
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │                 PHASE 2: Live Audio Session                  │  [COMPLETED]
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │                 PHASE 3: Analytics & Scorecard               │  [COMPLETED]
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │                 PHASE 4: Multi-AI Router Layer               │  [COMPLETED]
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │           PHASE 5: Bug Remediation & Zero-Score Logic        │  [COMPLETED]
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │         PHASE 6: Web Audio Analyser & Real dB Meter          │  [IN PLANNING]
  └──────────────────────────────┬───────────────────────────────┘
                                 │
  ┌──────────────────────────────▼───────────────────────────────┐
  │           PHASE 7: Offline Whisper Web (Wasm) STT            │  [FUTURE]
  └──────────────────────────────────────────────────────────────┘
```

---

## 🏁 Milestone Breakdown

### Phase 1: Setup Wizard & Role Configuration ✅ [Completed]
- [x] Preset library for Senior Frontend, Fullstack, System Architect, Product Manager, and Behavioral roles.
- [x] Custom job specification input form with role title, seniority level, and custom job description.
- [x] Interviewer Persona Selector with distinct personas (Dr. Evelyn Vance, Marcus Chen, Sarah Jenkins, David Miller).
- [x] Audio configuration step allowing microphone input testing and synthesized AI voice accent previewing.
- [x] Standalone configuration subproject (`setup-wizard-demo`) for isolated component testing.

### Phase 2: Live Interview Session Room ✅ [Completed]
- [x] State machine orchestrating audio lifecycle transitions (`standby` ➔ `listening` ➔ `thinking` ➔ `speaking`).
- [x] Web Speech API integration for continuous real-time Speech-to-Text (`SpeechRecognition`).
- [x] Web Speech API integration for natural Text-to-Speech synthesis (`speechSynthesis`).
- [x] HTML5 Canvas 2D reactive waveform visualizer running at 60 FPS with state-dependent amplitude and color modulation.
- [x] Live transcript feed with distinct AI interviewer bubbles, candidate answers, and interim speech bubbles.
- [x] Manual response input fallback for non-microphone testing environments.
- [x] Interactive control toolbar: Microphone toggle, structural hint request (STAR method), question skip, and early session termination.

### Phase 3: Analytics & Post-Interview Scorecard ✅ [Completed]
- [x] Post-interview scorecard generator computing Overall Score, Technical Depth, Communication Clarity, and Confidence ratings.
- [x] Vocal pause & filler word scanner detecting occurrences of *"um"*, *"uh"*, *"like"*, *"you know"*, *"basically"*, etc.
- [x] Speech cadence estimator measuring Words Per Minute (WPM) speed.
- [x] Question-by-question accordion breakdown with candidate answer transcript, strengths, recommended improvements, and ideal model answers.
- [x] Markdown scorecard exporter with automatic file download and one-click clipboard copying.

### Phase 4: Multi-Provider AI Architecture ✅ [Completed]
- [x] Hybrid routing architecture:
  - **Smart Offline Simulator**: Rule-based heuristic matching technical terms, STAR methodology keywords, and answer length.
  - **OpenAI API Integration**: Real-time integration supporting `gpt-3.5-turbo` and `gpt-4o`.
  - **Google Gemini API Integration**: Real-time integration supporting `gemini-1.5-flash`.
- [x] Secure client-side credential storage in browser `localStorage`.
- [x] Modal settings interface with immediate Navbar badge synchronization.

### Phase 5: Stability Hardening & Bug Remediation ✅ [Completed]
- [x] **Chromium Garbage Collection Fix**: Prevented Chrome from prematurely cutting off speech synthesis by pinning active utterances.
- [x] **Speech Recognition Buffer Preservation**: Ensured trailing interim speech is never lost when stopping speech recognition.
- [x] **Zero-Score Accuracy Guard**: Fixed misleading baseline score of 60/55 when candidate submits zero speech or skips all questions. Zero answers now correctly evaluate to `0/100` with appropriate incomplete session indicators.
- [x] **React State Immutability**: Removed direct mutations on `transcriptHistory` arrays.
- [x] **Light Mode Visual Consistency**: Restructured StateIndicator and Question Breakdown surfaces to eliminate illegible dark-on-dark contrast artifacts.

---

## 🚀 Upcoming Engineering Initiatives

### Phase 6: Hardware-Level Web Audio API Analyser ⏳ [Scheduled Next]
- **Objective**: Supplement procedural sine waves with real microphone frequency data using `AudioContext` and `AnalyserNode`.
- **Key Deliverables**:
  - Web Audio input stream tap to capture real-time decibel levels.
  - Dynamic volume indicator LED bar during candidate speech.
  - Automatic silence threshold detection (stops listening after 3.5 seconds of silence).

### Phase 7: Local Whisper Web (WASM) Speech-to-Text ⏳ [Q1]
- **Objective**: Provide browser-based offline AI transcription using Hugging Face Transformers.js / Whisper ONNX runtime as a fallback for browsers lacking native Web Speech API (e.g. Firefox desktop).
- **Key Deliverables**:
  - Optional quantized model download (`whisper-tiny-en`).
  - Web Worker background processing for zero main-thread UI blockage.

### Phase 8: Custom Question Bank & Job Importer ⏳ [Q2]
- **Objective**: Allow enterprise interviewers, recruiters, and candidates to upload their own customized interview syllabi.
- **Key Deliverables**:
  - CSV / JSON question bank parser.
  - Custom persona authoring tool (define greeting, tone, prompt instructions, and avatar gradient).

