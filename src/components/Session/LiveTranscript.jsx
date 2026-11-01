import React, { useRef, useEffect, useState } from 'react';
import { User, Bot, Send, Edit3 } from 'lucide-react';

export default function LiveTranscript({ persona, transcriptHistory, currentInterim, onManualSubmitAnswer }) {
  const chatEndRef = useRef(null);
  const [manualText, setManualText] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptHistory, currentInterim]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    onManualSubmitAnswer(manualText.trim());
    setManualText('');
  };

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      height: '420px',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={18} color="var(--color-cyan)" />
          Live Interview Stream
        </h3>
        <span className="badge badge-cyan">{transcriptHistory.length} Exchanges</span>
      </div>

      {/* Transcript Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        paddingRight: '0.5rem'
      }}>
        {transcriptHistory.map((item, idx) => (
          <React.Fragment key={idx}>
            {/* AI Question Bubble */}
            <div className="animate-fade-in-up" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 800,
                flexShrink: 0
              }}>
                {persona.name.charAt(0)}
              </div>
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)',
                padding: '0.85rem 1.1rem',
                maxWidth: '82%',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                color: 'var(--text-primary)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cyan)', marginBottom: '0.25rem' }}>
                  {persona.name} ({persona.role})
                </div>
                {item.question}
              </div>
            </div>

            {/* Candidate Answer Bubble */}
            {item.answer && (
              <div className="animate-fade-in-up" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  You
                </div>
                <div style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: 'var(--radius-md) 0 var(--radius-md) var(--radius-md)',
                  padding: '0.85rem 1.1rem',
                  maxWidth: '82%',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cyan)', marginBottom: '0.25rem', textAlign: 'right' }}>
                    Candidate (You)
                  </div>
                  {item.answer}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Live Interim Speech Bubble */}
        {currentInterim && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 800,
              flexShrink: 0
            }}>
              You
            </div>
            <div style={{
              background: '#FFF1F2',
              border: '1px dashed #FECDD3',
              borderRadius: 'var(--radius-md) 0 var(--radius-md) var(--radius-md)',
              padding: '0.85rem 1.1rem',
              maxWidth: '82%',
              fontSize: '0.92rem',
              fontStyle: 'italic',
              color: 'var(--text-secondary)'
            }}>
              <span className="badge badge-amber" style={{ fontSize: '0.65rem', marginBottom: '0.25rem', display: 'inline-block' }}>Live Speech</span>
              <div>{currentInterim}...</div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Manual Input Fallback Bar */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input 
          className="input-field" 
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Type or refine your response manually..."
          style={{ fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
        />
        <button type="submit" className="btn btn-secondary" style={{ padding: '0.65rem 1rem' }}>
          <Send size={15} color="var(--color-cyan)" />
        </button>
      </form>
    </div>
  );
}
