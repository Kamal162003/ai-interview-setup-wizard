import React from 'react';
import { PERSONAS } from '../../data/presets';
import { UserCheck, ShieldAlert, Heart, Code2, ArrowLeft, ArrowRight, MessageSquareQuote } from 'lucide-react';

export default function StepPersona({ selectedPersona, setSelectedPersona, onBack, onNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Select Interviewer <span className="gradient-text-accent">Persona</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Different personas will test your technical depth, STAR behavioral structure, or edge-case reasoning under pressure.
        </p>
      </div>

      {/* Personas Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {PERSONAS.map((persona, idx) => {
          const isSelected = selectedPersona.id === persona.id;
          return (
            <div
              key={persona.id}
              className={`glass-card animate-scale-in ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedPersona(persona)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: `${idx * 0.08}s`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-md)',
                  background: `linear-gradient(135deg, ${persona.id === 'strict-architect' ? '#00F2FE, #7C3AED' : persona.id === 'friendly-hr' ? '#10B981, #059669' : persona.id === 'tech-lead' ? '#7C3AED, #EC4899' : '#F43F5E, #F59E0B'})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.25rem'
                }}>
                  {persona.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{persona.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', fontWeight: 600 }}>{persona.role}</p>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Tone:</strong> {persona.tone}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {persona.description}
              </p>

              <div style={{
                background: '#F8FAFC',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #E2E8F0',
                borderLeft: '3px solid var(--color-cyan)',
                fontSize: '0.82rem',
                fontStyle: 'italic',
                color: 'var(--text-secondary)'
              }}>
                <MessageSquareQuote size={14} color="var(--color-cyan)" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                "{persona.greeting.substring(0, 80)}..."
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <button className="btn btn-primary" onClick={onNext} style={{ padding: '0.85rem 2rem' }}>
          Next: Audio & Mic Setup <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
