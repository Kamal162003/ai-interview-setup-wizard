import React from 'react';
import { Sliders, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2.25rem',
      background: 'rgba(12, 18, 32, 0.55)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: '1px solid var(--border-glass-light)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.35), inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow-cyan)'
        }}>
          <Sliders size={20} color="#07090E" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1.1 }}>
            Setup<span className="gradient-text">Wizard</span> Demo
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standalone Configuration Component</p>
        </div>
      </div>

      <div className="badge badge-purple">
        <Sparkles size={13} /> Standalone Setup Wizard Demo
      </div>
    </header>
  );
}
