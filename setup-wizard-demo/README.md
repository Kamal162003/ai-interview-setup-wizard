# 🧙‍♂️ Setup Wizard Standalone Demo

> **A lightweight, standalone React application running ONLY the 3-step Interview Setup Wizard (Role Selection ➔ Persona Selection ➔ Audio & Mic Test).**

---

## 📋 What is This Subfolder?

This subfolder (`setup-wizard-demo`) isolates the **Setup Wizard** portion of the application so you can test, showcase, or embed the configuration component independently without triggering the full live voice interview session or analytics reports.

---

## 🛠️ Step-by-Step Flow

1. **Step 1: Role & Job Specification**
   * Pick target role presets (*Senior Frontend Engineer*, *Fullstack Developer*, *System Architect*, *Product Manager*).
   * Customize job title and seniority level.
2. **Step 2: Interviewer Persona Selection**
   * Choose interviewer difficulty and tone (*Dr. Evelyn Vance - Strict Architect*, *Marcus Chen - Friendly HR*, *Sarah Jenkins - Tech Lead*).
3. **Step 3: Audio & Microphone Calibration**
   * Perform live browser microphone testing (`SpeechRecognition`).
   * Test AI voice synthesis playback accents (`SpeechSynthesis`).
4. **Completion Summary**
   * Displays the final configured configuration card with an option to restart the wizard.

---

## 🚀 How to Run Standalone

```bash
# Navigate to subfolder
cd setup-wizard-demo

# Install dependencies (if not already done)
npm install

# Start dev server on port 3001
npm run dev
```

Open `http://localhost:3001` in Google Chrome or Microsoft Edge.
