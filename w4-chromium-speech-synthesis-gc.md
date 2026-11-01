# Week 4 : Chromium Speech Synthesis Premature Cutoff Bug (V8 GC)

## 1. Problem Statement & Error

During real-time voice interview sessions on Chromium browsers (Google Chrome, Microsoft Edge, Brave, Opera), the AI interviewer voice would frequently cut off abruptly mid-sentence during longer question prompts.

When this occurred:
1. Speech playback abruptly ceased through the user's speakers.
2. The `onend` callback on `SpeechSynthesisUtterance` never executed.
3. The application remained permanently stuck in `audioState: 'speaking'`, disabling the candidate's microphone controls and preventing the session from proceeding.

---

## 2. Relevant Context

In `src/services/speechSynthesis.js`, the `speak()` method created a local instance of `SpeechSynthesisUtterance`:

```javascript
// File: src/services/speechSynthesis.js
speak(text, { onStart, onEnd } = {}) {
  this.synth.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  if (this.selectedVoice) utterance.voice = this.selectedVoice;

  utterance.onend = () => {
    this.isPlaying = false;
    if (onEnd) onEnd();
  };

  this.synth.speak(utterance);
}
```

The `utterance` variable lived solely within the lexical execution frame of `speak()`.

---

## 3. Key Observation & Root Cause

### Why does this error occur? (Chromium V8 Engine Garbage Collection Quirk)

1. **V8 Generational Garbage Collector Sweep**:
   - In Chromium browsers, `window.speechSynthesis` is bridged to the underlying C++ audio engine.
   - When `speak()` finishes execution, no persistent JavaScript reference to the `utterance` object remains on the heap.
   - Chromium's V8 garbage collector flags `utterance` as unreachable and destroys it mid-speech.
   - Destroying the JavaScript wrapper tears down all associated event callbacks (`onend`, `onerror`), so the completion event is never dispatched to JavaScript.

2. **Immediate `cancel()` Glitch**:
   - Calling `synth.cancel()` in the exact same event cycle immediately before `synth.speak(utterance)` caused Chromium audio pipelines to cancel the newly enqueued utterance.

---

## 4. Solution & Remediation

1. **Class-Level Anchor (`this.activeUtterance`)**:
   Anchored the active utterance instance as a persistent member property on `SpeechSynthesisService`:

   ```javascript
   this.activeUtterance = utterance; // Pin to prevent GC collection
   ```

2. **Explicit Lifecycle Release**:
   Only release the reference (`this.activeUtterance = null;`) inside the terminal handlers (`onend` and `onerror`).

3. **Audio Queue Clearance Delay**:
   Introduced a small 40ms dispatch delay using `setTimeout` after `synth.cancel()` to allow the browser audio subsystem to flush:

   ```javascript
   // src/services/speechSynthesis.js
   speak(text, { pitch = 1, rate = 1, onStart, onEnd } = {}) {
     if (!this.synth) return;
     this.stop(); // Cancels previous playback

     if (this.synth.paused) {
       this.synth.resume();
     }

     const utterance = new SpeechSynthesisUtterance(text);
     this.activeUtterance = utterance; // Anchor reference

     const cleanup = () => {
       this.isPlaying = false;
       this.activeUtterance = null; // Release anchor
       this.stopSpectrum();
     };

     utterance.onend = () => { cleanup(); if (onEnd) onEnd(); };
     utterance.onerror = () => { cleanup(); if (onEnd) onEnd(); };

     setTimeout(() => {
       if (this.synth && this.activeUtterance === utterance) {
         this.synth.speak(utterance);
       }
     }, 40);
   }
   ```

---

## 5. Verification & Testing

- Tested long interview questions (>120 words) across Google Chrome and Microsoft Edge.
- Verified that speech completed naturally without interruption and `onend` fired reliably, returning `audioState` to `'standby'`.

