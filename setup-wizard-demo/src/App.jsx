import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StepJobInput from './components/SetupWizard/StepJobInput';
import StepPersona from './components/SetupWizard/StepPersona';
import StepAudioConfig from './components/SetupWizard/StepAudioConfig';
import StepInterviewSession from './components/SetupWizard/StepInterviewSession';
import InterviewDashboard from './components/SetupWizard/InterviewDashboard';
import { JOB_PRESETS, PERSONAS } from './data/presets';
import { CheckCircle2, RotateCcw, Briefcase, User, Volume2, Play, Sparkles } from 'lucide-react';

export default function App() {
  // 1: Job, 2: Persona, 3: Audio Config, 4: Live Interview Session, 5: Post-Interview Analytics
  const [subStep, setSubStep] = useState(1);
  const [jobData, setJobData] = useState(JOB_PRESETS[0]);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [completedSessionData, setCompletedSessionData] = useState(null);

  const handleRestart = () => {
    setSubStep(1);
    setJobData(JOB_PRESETS[0]);
    setSelectedPersona(PERSONAS[0]);
    setCompletedSessionData(null);
  };

  const handleFinishInterview = (sessionResults) => {
    setCompletedSessionData(sessionResults);
    setSubStep(5);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Glassmorphism Background Light Orbs */}
      <div className="glass-orb-container">
        <div className="glass-orb glass-orb-1" />
        <div className="glass-orb glass-orb-2" />
        <div className="glass-orb glass-orb-3" />
      </div>

      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1.5rem', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        
        {/* Step Indicator Header for Wizard Steps */}
        {subStep <= 3 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                background: subStep >= 1 ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.08)',
                color: subStep >= 1 ? '#07090E' : 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>1</div>
              <span style={{ fontSize: '0.88rem', fontWeight: subStep === 1 ? 700 : 500, color: subStep === 1 ? 'var(--color-cyan)' : 'var(--text-muted)' }}>Job Input</span>
            </div>

            <div style={{ width: '40px', height: '2px', background: subStep >= 2 ? 'var(--color-cyan)' : 'rgba(255,255,255,0.1)' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                background: subStep >= 2 ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.08)',
                color: subStep >= 2 ? '#FFF' : 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>2</div>
              <span style={{ fontSize: '0.88rem', fontWeight: subStep === 2 ? 700 : 500, color: subStep === 2 ? '#A78BFA' : 'var(--text-muted)' }}>AI Persona</span>
            </div>

            <div style={{ width: '40px', height: '2px', background: subStep >= 3 ? 'var(--color-purple)' : 'rgba(255,255,255,0.1)' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                background: subStep >= 3 ? 'var(--gradient-emerald)' : 'rgba(255,255,255,0.08)',
                color: subStep >= 3 ? '#FFF' : 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>3</div>
              <span style={{ fontSize: '0.88rem', fontWeight: subStep === 3 ? 700 : 500, color: subStep === 3 ? 'var(--color-emerald)' : 'var(--text-muted)' }}>Audio & Mic</span>
            </div>
          </div>
        )}

        {/* Wizard Steps */}
        {subStep === 1 && (
          <StepJobInput 
            jobData={jobData} 
            setJobData={setJobData} 
            onNext={() => setSubStep(2)} 
          />
        )}

        {subStep === 2 && (
          <StepPersona 
            selectedPersona={selectedPersona} 
            setSelectedPersona={setSelectedPersona} 
            onBack={() => setSubStep(1)} 
            onNext={() => setSubStep(3)} 
          />
        )}

        {subStep === 3 && (
          <StepAudioConfig 
            selectedPersona={selectedPersona} 
            onBack={() => setSubStep(2)} 
            onCompleteWizard={() => setSubStep(4)} 
          />
        )}

        {/* Step 4: Live Mock Interview Session */}
        {subStep === 4 && (
          <StepInterviewSession
            jobData={jobData}
            selectedPersona={selectedPersona}
            onCompleteSession={handleFinishInterview}
            onCancelSession={() => setSubStep(3)}
          />
        )}

        {/* Step 5: Post-Interview Analytics & Dashboard */}
        {subStep === 5 && completedSessionData && (
          <InterviewDashboard
            sessionData={completedSessionData}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
