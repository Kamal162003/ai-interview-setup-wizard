# Week 5 : Trailing Speech Loss & Word Duplication in Speech Recognition

## 1. Problem Statement & Error

During voice mock interviews using continuous Speech-to-Text (`SpeechRecognition`), two distinct data integrity issues emerged:

1. **Trailing Word Loss**: When the candidate finished speaking and immediately clicked *"Click to Stop Speaking"*, the last 1 to 3 words of their sentence were missing from their answer transcript.
2. **Word & Phrase Duplication**: In answers spanning multiple sentences, earlier phrases were intermittently duplicated in the transcript feed (e.g., *"In my last project in my last project I worked on React"*).
3. **Infinite Reconnection**: Denying microphone permission in the browser triggered continuous auto-restart loops in `onend`.

---

## 2. Relevant Context

In `src/services/speechRecognition.js`, the recognition results and stopping logic were handled as follows:

```javascript
// File: src/services/speechRecognition.js
this.recognition.onresult = (event) => {
  let interimTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      this.finalTranscript += event.results[i][0].transcript + ' ';
    } else {
      interimTranscript += event.results[i][0].transcript;
    }
  }
  // ...
};

stop() {
  this.isListening = false;
  this.recognition.stop();
  return this.finalTranscript.trim(); // Flaw: only returns final
}
```

In `src/App.jsx`, the candidate's answer was extracted via:
```javascript
const candidateAnswer = speechRecognizer.stop();
const answerText = candidateAnswer || currentInterimText;
```

---

## 3. Key Observation & Root Cause

1. **Trailing Interim Drop**:
   When `continuous = true`, the browser engine processes spoken words through an `interimResults` stage before finalizing them. When the candidate presses Stop, `this.finalTranscript` does not yet contain the last phrase because it is still stored as interim text.
   Because `candidateAnswer` was truthy (containing earlier finalized sentences), `candidateAnswer || currentInterimText` chose `candidateAnswer` and completely dropped the trailing interim words.

2. **Index Mutation & Duplication**:
   When using `this.finalTranscript += event.results[i][0].transcript` starting at `event.resultIndex`, any internal revisions by the browser's acoustic model re-appended previously finalized text into the running string.

3. **Unhandled Permission Rejection**:
   In `onerror`, when `event.error === 'not-allowed'`, the service did not set `this.isListening = false`. Subsequently, `this.recognition.onend` triggered:
   `if (this.isListening) this.recognition.start();`
   creating an infinite restart loop on denied access.

---

## 4. Solution & Remediation

1. **Clean Array Iteration**:
   Rebuilt the text cleanly across all results from index `0` to `event.results.length - 1` rather than accumulating incrementally:

   ```javascript
   this.recognition.onresult = (event) => {
     let interim = '';
     let final = '';

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
   ```

2. **Unified Buffer on Stop**:
   Updated `stop()` to concatenate finalized and pending interim text:

   ```javascript
   stop() {
     this.isListening = false;
     if (this.recognition) {
       try { this.recognition.stop(); } catch (e) {}
     }
     return (this.finalTranscript + (this.interimTranscript ? ' ' + this.interimTranscript : '')).trim();
   }
   ```

3. **Permission Denial Reset**:
   In `onerror`, reset `this.isListening = false` when `event.error === 'not-allowed'` or `'service-not-allowed'` to halt the restart loop.

---

## 5. Verification & Testing

- Tested spoken answers containing trailing technical terminology (e.g. *"using Redux Toolkit and WebSocket streams"*).
- Clicked Stop immediately after speaking.
- Verified that 100% of the spoken words were preserved in the candidate transcript with zero dropped syllables or duplicated phrases.
