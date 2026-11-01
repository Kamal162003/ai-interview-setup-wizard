import React from 'react';
import { PERSONAS } from '../../data/presets';
import { ArrowLeft, ArrowRight, MessageSquareQuote } from 'lucide-react';

export default function StepPersona({ selectedPersona, setSelectedPersona, onBack, onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Step 2 of 3</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Select Interviewer <span className="gradient-text-accent">Persona</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Choose the personality and difficulty level for your AI interviewer.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {PERSONAS.map((persona) => {
          const isSelected = selectedPersona.id === persona.id;
          return (
            <div
              key={persona.id}
              className={`glass-card ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedPersona(persona)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.2rem'
                }}>
                  {persona.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{persona.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', fontWeight: 600 }}>{persona.role}</p>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {persona.description}
              </p>

              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--color-cyan)',
                fontSize: '0.8rem',
                fontStyle: 'italic',
                color: 'var(--text-secondary)'
              }}>
                <MessageSquareQuote size={14} color="var(--color-cyan)" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                "{persona.greeting.substring(0, 75)}..."
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <button className="btn btn-primary" onClick={onNext} style={{ padding: '0.85rem 2rem' }}>
          Next: Audio & Mic Test <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
