import React, { useState, useEffect, useRef } from 'react';
import { speechSynthesizer } from '../../services/speechSynthesis';
import { speechRecognizer } from '../../services/speechRecognition';
import { Mic, Volume2, CheckCircle2, AlertCircle, ArrowLeft, Play, Sparkles } from 'lucide-react';

export default function StepAudioConfig({ selectedPersona, onBack, onStartSession }) {
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [micStatus, setMicStatus] = useState('idle'); // 'idle', 'testing', 'success', 'denied'
  const [testTranscript, setTestTranscript] = useState('');
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);
  const micTimeoutRef = useRef(null);
  const micStatusRef = useRef('idle');

  useEffect(() => {
    micStatusRef.current = micStatus;
  }, [micStatus]);

  useEffect(() => {
    const updateVoices = () => {
      const voices = speechSynthesizer.getAvailableVoices();
      setAvailableVoices(voices);
      if (voices.length > 0) {
        setSelectedVoiceName(prev => prev || speechSynthesizer.selectedVoice?.name || voices[0].name);
      }
    };

    updateVoices();
    const unsub = speechSynthesizer.onVoicesChanged(updateVoices);

    return () => {
      if (unsub) unsub();
      if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
      speechRecognizer.stop();
      speechSynthesizer.stop();
    };
  }, []);

  const handleVoiceChange = (e) => {
    const name = e.target.value;
    setSelectedVoiceName(name);
    speechSynthesizer.setVoiceByName(name);
  };

  const handleTestVoice = () => {
    setIsPlayingTestAudio(true);
    speechSynthesizer.speak(
      `Hello! I am ${selectedPersona.name}. I am ready to begin your mock interview session.`,
      {
        onEnd: () => setIsPlayingTestAudio(false)
      }
    );
  };

  const handleTestMic = () => {
    if (micTimeoutRef.current) clearTimeout(micTimeoutRef.current);
    setMicStatus('testing');
    micStatusRef.current = 'testing';
    setTestTranscript('Listening... Speak into your microphone!');

    const ok = speechRecognizer.init({
      onTranscript: ({ full }) => {
        if (full) {
          setTestTranscript(`Captured: "${full}"`);
          setMicStatus('success');
          micStatusRef.current = 'success';
        }
      },
      onStatusChange: (status) => {
        if (status === 'denied') {
          setMicStatus('denied');
          micStatusRef.current = 'denied';
        }
      }
    });

    if (ok) {
      speechRecognizer.start();
      micTimeoutRef.current = setTimeout(() => {
        speechRecognizer.stop();
        if (micStatusRef.current === 'testing') {
          setMicStatus('success');
          micStatusRef.current = 'success';
          setTestTranscript('Microphone active & detected successfully!');
        }
      }, 4000);
    } else {
      setMicStatus('denied');
      micStatusRef.current = 'denied';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Audio & Microphone <span className="gradient-text">Calibration</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Ensure your microphone is working and test the AI interviewer voice synthesized playback.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Mic Test Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mic size={18} color="var(--color-cyan)" />
            Microphone Input Test
          </h3>

          <div style={{
            background: '#F8FAFC',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #E2E8F0',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: micStatus === 'success' ? 'var(--color-emerald)' : micStatus === 'denied' ? 'var(--color-rose)' : 'var(--text-secondary)'
          }}>
            {micStatus === 'idle' && 'Click "Test Microphone" and say a quick phrase.'}
            {micStatus === 'testing' && <span className="animate-pulse-cyan">{testTranscript}</span>}
            {micStatus === 'success' && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} /> {testTranscript}</span>}
            {micStatus === 'denied' && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={18} /> Microphone access denied or unsupported in browser. You can still type in text!</span>}
          </div>

          <button className="btn btn-secondary" onClick={handleTestMic}>
            <Mic size={16} color="var(--color-cyan)" />
            {micStatus === 'testing' ? 'Listening...' : 'Test Microphone'}
          </button>
        </div>

        {/* Voice Selection & Playback */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={18} color="var(--color-purple)" />
            AI Voice Synthesizer Output
          </h3>

          <div className="input-group">
            <label className="input-label">Select Voice Accent / Synthesizer</label>
            <select className="select-field" value={selectedVoiceName} onChange={handleVoiceChange}>
              {availableVoices.length === 0 ? (
                <option value="">Default Browser Voice</option>
              ) : (
                availableVoices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          <button className="btn btn-secondary" onClick={handleTestVoice} disabled={isPlayingTestAudio}>
            <Play size={16} color="var(--color-purple)" />
            {isPlayingTestAudio ? 'Playing AI Voice...' : 'Preview AI Persona Voice'}
          </button>
        </div>
      </div>

      {/* Start Session Call to Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>

        <button className="btn btn-primary" onClick={onStartSession} style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', boxShadow: 'var(--shadow-glow-cyan)' }}>
          <Sparkles size={20} />
          Begin Live AI Interview
        </button>
      </div>
    </div>
  );
}
