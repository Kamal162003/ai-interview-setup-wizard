import React, { useState, useEffect } from 'react';
import { Mic, Key, Github, Sparkles, RefreshCw } from 'lucide-react';
import { aiEngine } from '../services/aiEngine';

export default function Navbar({ onOpenApiModal, onResetSession, currentStep }) {
  const [provider, setProvider] = useState(() => aiEngine.getSettings().provider);

  useEffect(() => {
    const unsubscribe = aiEngine.onSettingsChange((settings) => {
      setProvider(settings.provider);
    });
    return unsubscribe;
  }, []);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2.25rem',
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={onResetSession}>
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
          <Mic size={22} color="#FFFFFF" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1.1 }}>
            Interview<span className="gradient-text">AI</span> <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 6px', background: '#EFF6FF', color: '#2563EB', borderRadius: '4px', border: '1px solid #BFDBFE' }}>PRO</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive AI Voice Interview Simulator</p>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Engine Mode Badge */}
        <div className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
          <Sparkles size={13} />
          {provider === 'openai' ? 'OpenAI GPT-3.5' : provider === 'gemini' ? 'Gemini 1.5' : 'Smart AI Simulator'}
        </div>

        {/* API Settings Modal Trigger */}
        <button className="btn btn-secondary" onClick={onOpenApiModal} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
          <Key size={15} color="var(--color-cyan)" />
          API Keys
        </button>

        {currentStep !== 'setup' && (
          <button className="btn btn-secondary" onClick={onResetSession} style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
            <RefreshCw size={15} />
            New Session
          </button>
        )}

        {/* GitHub Link */}
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer" 
          className="btn btn-secondary btn-icon"
          title="View on GitHub"
        >
          <Github size={18} />
        </a>
      </div>
    </header>
  );
}
