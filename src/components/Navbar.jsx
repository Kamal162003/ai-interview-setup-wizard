import React from 'react';
import { Sliders, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
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
