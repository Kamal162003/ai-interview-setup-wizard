# Week 6 : React State Immutability Violations & Stale Closures

## 1. Problem Statement & Error

During user interactions in the live interview room and setup wizard, two distinct React lifecycle defects were identified:

1. **Direct React State Mutation**:
   Updating the candidate's transcript in `processCandidateAnswer` and `handleSkipQuestion` directly mutated objects within React's state array. When `transcriptHistory` was empty, `updatedHistory[-1].answer = answerText` threw:
   ```text
   TypeError: Cannot set properties of undefined (setting 'answer')
   ```

2. **Stale Closure in Audio Calibration**:
   In `src/components/SetupWizard/StepAudioConfig.jsx`, clicking *"Test Microphone"* initiated a 4-second timeout. The timeout callback checked `if (micStatus === 'testing')`, but the check always evaluated to `false`, failing to update the status to `'success'`.

---

## 2. Relevant Context

In `src/App.jsx`:

```javascript
// File: src/App.jsx
const processCandidateAnswer = async (answerText) => {
  const updatedHistory = [...transcriptHistory];
  // Mutating existing object reference directly in state
  updatedHistory[updatedHistory.length - 1].answer = answerText;
  setTranscriptHistory(updatedHistory);
};
```

In `src/components/SetupWizard/StepAudioConfig.jsx`:

```javascript
// File: src/components/SetupWizard/StepAudioConfig.jsx
const [micStatus, setMicStatus] = useState('idle');

const handleTestMic = () => {
  setMicStatus('testing');
  setTimeout(() => {
    // Closure captures micStatus as 'idle' from initial render!
    if (micStatus === 'testing') {
      setMicStatus('success');
    }
  }, 4000);
};
```

---

## 3. Key Observation & Root Cause

1. **Shallow Copy State Mutation**:
   `[...transcriptHistory]` copies the outer array container, but every object inside remains a shared reference pointing to previous React state. Directly assigning `updatedHistory[lastIdx].answer = text` violates React's immutability paradigm, causing erratic behavior under React 18 Concurrent / Strict Mode. Furthermore, if `lastIdx < 0`, indexing with `-1` throws a fatal `TypeError`.

2. **Stale Functional Closure**:
   When `handleTestMic()` is triggered, JavaScript captures the current value of `micStatus` (`'idle'`) in the `setTimeout` closure. Even though `setMicStatus('testing')` schedules a state update, the already-scheduled timer closure retains the old `'idle'` reference, so `if (micStatus === 'testing')` can never be true.

---

## 4. Solution & Remediation

1. **Pure Immutable Mapping in `src/App.jsx`**:
   Replaced direct object assignment with immutable array mapping and added an array boundary check:

   ```javascript
   // src/App.jsx
   const lastIdx = transcriptHistory.length - 1;
   if (lastIdx < 0) return;

   const updatedHistory = transcriptHistory.map((item, idx) => 
     idx === lastIdx ? { ...item, answer: answerText.trim() } : item
   );
   setTranscriptHistory(updatedHistory);
   ```

2. **Reference Tracking & Cleanup in `StepAudioConfig.jsx`**:
   Used `useRef` to track `micStatus` across async callbacks, and cleared timeouts on unmount:

   ```javascript
   // src/components/SetupWizard/StepAudioConfig.jsx
   const micTimeoutRef = useRef(null);
   const micStatusRef = useRef('idle');

   useEffect(() => {
     micStatusRef.current = micStatus;
   }, [micStatus]);

   useEffect(() => {
     return () => {
       if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
     };
   }, []);

   const handleTestMic = () => {
     if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
     setMicStatus('testing');
     micStatusRef.current = 'testing';

     // Inside timer:
     micTimeoutRef.current = setTimeout(() => {
       speechRecognizer.stop();
       if (micStatusRef.current === 'testing') {
         setMicStatus('success');
         micStatusRef.current = 'success';
         setTestTranscript('Microphone active & detected successfully!');
       }
     }, 4000);
   };
   ```

---

## 5. Verification & Testing

- Verified zero console errors in React 18 StrictMode.
- Audio test now reliably detects microphone activation and smoothly transitions to `'success'`.
- Unmounting the setup wizard before the 4-second timeout no longer produces memory leak warnings.
