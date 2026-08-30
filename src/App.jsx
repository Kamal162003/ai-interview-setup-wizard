import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StepJobInput from './components/SetupWizard/StepJobInput';
import StepPersona from './components/SetupWizard/StepPersona';
import StepAudioConfig from './components/SetupWizard/StepAudioConfig';
import { JOB_PRESETS, PERSONAS } from './data/presets';
import { CheckCircle2, RotateCcw, Briefcase, User, Volume2 } from 'lucide-react';

export default function App() {
  const [subStep, setSubStep] = useState(1); // 1: Job, 2: Persona, 3: Audio, 4: Summary
  const [jobData, setJobData] = useState(JOB_PRESETS[0]);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);

  const handleRestart = () => {
    setSubStep(1);
    setJobData(JOB_PRESETS[0]);
    setSelectedPersona(PERSONAS[0]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1.5rem', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
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

        {/* Completion Summary View */}
        {subStep === 4 && (
          <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--color-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-emerald)'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Setup Wizard Completed!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                Your mock interview configuration is ready.
              </p>
            </div>

            {/* Selected Settings Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', width: '100%', marginTop: '1rem', textAlign: 'left' }}>
              <div className="glass-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <Briefcase size={14} color="var(--color-cyan)" /> Selected Job Role
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{jobData.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)' }}>{jobData.level} • {jobData.company || 'Custom'}</div>
              </div>

              <div className="glass-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <User size={14} color="var(--color-purple)" /> AI Interviewer Persona
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedPersona.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#A78BFA' }}>{selectedPersona.role}</div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleRestart} style={{ marginTop: '1rem', padding: '0.85rem 2rem' }}>
              <RotateCcw size={18} /> Test Setup Wizard Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
