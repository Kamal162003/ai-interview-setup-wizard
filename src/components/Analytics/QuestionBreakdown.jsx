import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Lightbulb, Code } from 'lucide-react';

export default function QuestionBreakdown({ questions }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleOpen = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Question-by-Question Analysis</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {questions.map((q, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              style={{
                border: '1px solid var(--border-glass-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Question Header Bar */}
              <div 
                onClick={() => toggleOpen(idx)}
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: isOpen ? 'rgba(255, 255, 255, 0.06)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-purple">Q{q.id}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {q.question}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`badge ${q.score === 0 ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '0.8rem' }}>
                    Score: {q.score}/100
                  </span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Expandable Details */}
              {isOpen && (
                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FFFFFF' }}>
                  {/* Candidate Transcript */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>CANDIDATE ANSWER TRANSCRIPT</div>
                    <div style={{
                      padding: '0.85rem 1rem',
                      background: '#F8FAFC',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      fontStyle: 'italic'
                    }}>
                      "{q.userAnswer}"
                    </div>
                  </div>

                  {/* Strengths & Improvements Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                        <CheckCircle size={14} /> Strengths
                      </div>
                      <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem' }}>
                        {q.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-amber)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                        <AlertTriangle size={14} /> Recommended Improvements
                      </div>
                      <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem' }}>
                        {q.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Key Tech Terms Identified */}
                  {q.techTerms && q.techTerms.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Code size={14} color="var(--color-cyan)" />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Key Terms Mentioned:</span>
                      {q.techTerms.map((t, i) => (
                        <span key={i} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Ideal Model Answer Tip */}
                  <div style={{
                    background: 'rgba(0, 242, 254, 0.05)',
                    border: '1px solid rgba(0, 242, 254, 0.2)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong style={{ color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <Lightbulb size={14} /> Ideal Model Answer Structure:
                    </strong>
                    {q.modelAnswer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
