import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StepJobInput from './components/SetupWizard/StepJobInput';
import StepPersona from './components/SetupWizard/StepPersona';
import StepAudioConfig from './components/SetupWizard/StepAudioConfig';
import StateIndicator from './components/Session/StateIndicator';
import AudioVisualizer from './components/Session/AudioVisualizer';
import LiveTranscript from './components/Session/LiveTranscript';
import ControlToolbar from './components/Session/ControlToolbar';
import ScoreCard from './components/Analytics/ScoreCard';
import QuestionBreakdown from './components/Analytics/QuestionBreakdown';
import FillerWordsAnalysis from './components/Analytics/FillerWordsAnalysis';
import ApiSettingsModal from './components/Modals/ApiSettingsModal';
import ExportModal from './components/Modals/ExportModal';

import { JOB_PRESETS, PERSONAS } from './data/presets';
import { speechRecognizer } from './services/speechRecognition';
import { speechSynthesizer } from './services/speechSynthesis';
import { aiEngine } from './services/aiEngine';
import { analyticsEngine } from './services/analyticsEngine';

export default function App() {
  // Navigation State: 'setup' | 'session' | 'analytics'
  const [currentStep, setCurrentStep] = useState('setup');
  const [setupSubStep, setSetupSubStep] = useState(1); // 1: Job, 2: Persona, 3: Audio

  // Configuration State
  const [jobData, setJobData] = useState(JOB_PRESETS[0]);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);

  // Session & Audio State
  // audioState: 'standby' | 'listening' | 'thinking' | 'speaking'
  const [audioState, setAudioState] = useState('standby');
  const [isListening, setIsListening] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [currentInterimText, setCurrentInterimText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Modals
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Analytics Report State
  const [evaluationReport, setEvaluationReport] = useState(null);

  // Initialize Speech Recognizer listeners
  useEffect(() => {
    speechRecognizer.init({
      onTranscript: ({ full, interim }) => {
        setCurrentInterimText(full);
      },
      onStatusChange: (status) => {
        if (status === 'listening') {
          setIsListening(true);
          setAudioState('listening');
        } else if (status === 'stopped') {
          setIsListening(false);
        }
      }
    });

    speechSynthesizer.setAudioFrameCallback(() => {
      // Audio frequency frame update handled inside canvas visualizer
    });
  }, []);

  const handleStartSession = () => {
    setCurrentStep('session');
    const defaultQs = jobData.defaultQuestions || [];
    const initialQ = (defaultQs.length > 0 && defaultQs[0]) 
      ? defaultQs[0] 
      : "Can you introduce yourself and walk me through a key technical project you led recently?";
    
    const initialHistory = [{
      question: `${selectedPersona.greeting} ${initialQ}`,
      answer: ''
    }];
    setTranscriptHistory(initialHistory);
    setCurrentQuestionIndex(0);

    // Speak initial question
    setAudioState('speaking');
    speechSynthesizer.speak(initialHistory[0].question, {
      onEnd: () => setAudioState('standby')
    });
  };

  const handleToggleMic = () => {
    if (isListening) {
      // Stop listening and process candidate response
      const candidateAnswer = speechRecognizer.stop();
      setIsListening(false);
      const answerText = candidateAnswer || currentInterimText;
      processCandidateAnswer(answerText);
    } else {
      // Start listening
      speechSynthesizer.stop();
      setCurrentInterimText('');
      speechRecognizer.start();
      setIsListening(true);
      setAudioState('listening');
    }
  };

  const handleManualSubmitAnswer = (text) => {
    speechSynthesizer.stop();
    speechRecognizer.stop();
    setIsListening(false);
    processCandidateAnswer(text);
  };

  const processCandidateAnswer = async (answerText) => {
    if (!answerText || !answerText.trim()) return;

    setAudioState('thinking');
    
    // Immutably update transcript with user's answer
    const lastIdx = transcriptHistory.length - 1;
    if (lastIdx < 0) return;

    const updatedHistory = transcriptHistory.map((item, idx) => 
      idx === lastIdx ? { ...item, answer: answerText.trim() } : item
    );

    setTranscriptHistory(updatedHistory);
    setCurrentInterimText('');

    // Generate AI Next Question
    const nextAiSpeech = await aiEngine.generateNextQuestion({
      jobDescription: jobData.description,
      persona: selectedPersona,
      questionHistory: updatedHistory,
      userResponse: answerText.trim()
    });

    // Append new question to history
    const nextHistory = [
      ...updatedHistory,
      { question: nextAiSpeech, answer: '' }
    ];
    setTranscriptHistory(nextHistory);
    setCurrentQuestionIndex(nextHistory.length - 1);

    // Speak AI response
    setAudioState('speaking');
    speechSynthesizer.speak(nextAiSpeech, {
      onEnd: () => setAudioState('standby')
    });
  };

  const handleGetHint = () => {
    const hint = "Tip: Structure your response using STAR: Situation, Task, Action, and Result. Mention specific technical tools & metrics!";
    speechSynthesizer.speak(hint);
  };

  const handleSkipQuestion = () => {
    speechSynthesizer.stop();
    speechRecognizer.stop();
    setIsListening(false);

    const defaultQs = jobData.defaultQuestions || [];
    const nextQIndex = currentQuestionIndex + 1;
    const fallbackQ = (defaultQs.length > 0 && defaultQs[nextQIndex % defaultQs.length])
      ? defaultQs[nextQIndex % defaultQs.length]
      : "Let's move forward. How do you handle conflict or technical disagreements within your engineering team?";

    const lastIdx = transcriptHistory.length - 1;
    const updated = transcriptHistory.map((item, idx) => {
      if (idx === lastIdx && !item.answer) {
        return { ...item, answer: "[Question Skipped by Candidate]" };
      }
      return item;
    });

    updated.push({ question: fallbackQ, answer: '' });

    setTranscriptHistory(updated);
    setCurrentQuestionIndex(updated.length - 1);

    setAudioState('speaking');
    speechSynthesizer.speak(fallbackQ, {
      onEnd: () => setAudioState('standby')
    });
  };

  const handleEndSession = () => {
    speechSynthesizer.stop();
    speechRecognizer.stop();
    setIsListening(false);

    // Generate analytics evaluation report
    const report = analyticsEngine.evaluateSession({
      job: jobData,
      persona: selectedPersona,
      transcriptHistory: transcriptHistory
    });

    setEvaluationReport(report);
    setCurrentStep('analytics');
  };

  const handleResetSession = () => {
    speechSynthesizer.stop();
    speechRecognizer.stop();
    setIsListening(false);
    setCurrentStep('setup');
    setSetupSubStep(1);
    setTranscriptHistory([]);
    setCurrentInterimText('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Glassmorphism Background Light Orbs */}
      <div className="glass-orb-container">
        <div className="glass-orb glass-orb-1" />
        <div className="glass-orb glass-orb-2" />
        <div className="glass-orb glass-orb-3" />
      </div>

      <Navbar 
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onResetSession={handleResetSession}
        currentStep={currentStep}
      />

      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* Step 1: Setup Wizard */}
        {currentStep === 'setup' && (
          <div className="animate-fade-in-up">
            {setupSubStep === 1 && (
              <StepJobInput 
                jobData={jobData} 
                setJobData={setJobData} 
                onNext={() => setSetupSubStep(2)} 
              />
            )}

            {setupSubStep === 2 && (
              <StepPersona 
                selectedPersona={selectedPersona} 
                setSelectedPersona={setSelectedPersona} 
                onBack={() => setSetupSubStep(1)} 
                onNext={() => setSetupSubStep(3)} 
              />
            )}

            {setupSubStep === 3 && (
              <StepAudioConfig 
                selectedPersona={selectedPersona} 
                onBack={() => setSetupSubStep(2)} 
                onStartSession={handleStartSession} 
              />
            )}
          </div>
        )}

        {/* Step 2: Live Interview Session */}
        {currentStep === 'session' && (
          <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {jobData.title} <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}>({selectedPersona.name})</span>
                </h2>
              </div>
              <StateIndicator audioState={audioState} />
            </div>

            <AudioVisualizer audioState={audioState} />

            <LiveTranscript 
              persona={selectedPersona} 
              transcriptHistory={transcriptHistory} 
              currentInterim={currentInterimText} 
              onManualSubmitAnswer={handleManualSubmitAnswer} 
            />

            <ControlToolbar 
              isListening={isListening} 
              onToggleMic={handleToggleMic} 
              onGetHint={handleGetHint} 
              onSkipQuestion={handleSkipQuestion} 
              onEndSession={handleEndSession} 
            />
          </div>
        )}

        {/* Step 3: Post-Interview Analytics Report */}
        {currentStep === 'analytics' && evaluationReport && (
          <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ScoreCard 
              report={evaluationReport} 
              onExport={() => setIsExportModalOpen(true)} 
            />
            <FillerWordsAnalysis report={evaluationReport} />
            <QuestionBreakdown questions={evaluationReport.questions} />
          </div>
        )}
      </main>

      {/* Modals */}
      <ApiSettingsModal 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
      />

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        report={evaluationReport} 
        job={jobData} 
        persona={selectedPersona} 
      />
    </div>
  );
}
