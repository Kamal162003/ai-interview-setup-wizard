import React from 'react';
import { Mic, MicOff, Lightbulb, SkipForward, Square, CheckSquare } from 'lucide-react';

export default function ControlToolbar({ 
  isListening, 
  onToggleMic, 
  onGetHint, 
  onSkipQuestion, 
  onEndSession 
}) {
  return (
    <div className="glass-panel" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2rem',
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* Quick Assist Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button className="btn btn-secondary" onClick={onGetHint} title="Get structural hint for answering">
          <Lightbulb size={16} color="var(--color-amber)" />
          Request Hint
        </button>

        <button className="btn btn-secondary" onClick={onSkipQuestion} title="Skip to next question">
          <SkipForward size={16} />
          Skip Question
        </button>
      </div>

      {/* Main Microphone Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
        <button 
          onClick={onToggleMic}
          className={`btn ${isListening ? 'btn-danger animate-pulse-rose' : 'btn-primary animate-mic-breath'}`}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            padding: 0,
            boxShadow: isListening ? 'var(--shadow-glow-rose)' : 'var(--shadow-glow-cyan)'
          }}
        >
          {isListening ? <MicOff size={28} color="#fff" /> : <Mic size={28} color="#FFFFFF" />}
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {isListening ? 'Click to Stop Speaking' : 'Click Mic to Answer'}
        </span>
      </div>

      {/* Complete Interview Button */}
      <div>
        <button className="btn btn-danger" onClick={onEndSession}>
          <Square size={16} />
          Finish & View Scorecard
        </button>
      </div>
    </div>
  );
}
