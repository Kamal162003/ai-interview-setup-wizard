import React from 'react';
import { Mic, Volume2, Loader2, Radio } from 'lucide-react';

export default function StateIndicator({ audioState }) {
  // audioState: 'standby' | 'listening' | 'thinking' | 'speaking'

  const getStateDetails = () => {
    switch (audioState) {
      case 'listening':
        return {
          label: 'Microphone Active — Listening to candidate',
          badgeClass: 'badge-amber',
          borderColor: 'var(--color-rose)',
          pulseClass: 'animate-pulse-rose',
          icon: <Radio size={16} color="var(--color-rose)" />
        };
      case 'thinking':
        return {
          label: 'AI Analyzing Response & Generating Follow-up...',
          badgeClass: 'badge-purple',
          borderColor: 'var(--color-purple)',
          pulseClass: 'animate-pulse-purple',
          icon: <Loader2 size={16} className="animate-spin" color="var(--color-purple)" />
        };
      case 'speaking':
        return {
          label: 'AI Persona Speaking — Listen carefully',
          badgeClass: 'badge-purple',
          borderColor: 'var(--color-purple)',
          pulseClass: 'animate-pulse-purple',
          icon: <Volume2 size={16} color="var(--color-purple)" />
        };
      case 'standby':
      default:
        return {
          label: 'Standby — Press Microphone button to speak',
          badgeClass: 'badge-cyan',
          borderColor: 'var(--color-cyan)',
          pulseClass: 'animate-pulse-cyan',
          icon: <Mic size={16} color="var(--color-cyan)" />
        };
    }
  };

  const details = getStateDetails();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.6rem 1.25rem',
      background: '#FFFFFF',
      borderRadius: 'var(--radius-full)',
      border: `1.5px solid ${details.borderColor}`,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease'
    }} className={details.pulseClass}>
      {details.icon}
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {details.label}
      </span>
    </div>
  );
}
