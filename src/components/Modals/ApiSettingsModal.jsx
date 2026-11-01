import React, { useState } from 'react';
import { aiEngine } from '../../services/aiEngine';
import { Key, Sparkles, X, Check } from 'lucide-react';

export default function ApiSettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const currentSettings = aiEngine.getSettings();
  const [provider, setProvider] = useState(currentSettings.provider);
  const [openaiKey, setOpenaiKey] = useState(currentSettings.openaiKey);
  const [geminiKey, setGeminiKey] = useState(currentSettings.geminiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    aiEngine.saveSettings({ provider, openaiKey, geminiKey });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-scale-in" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        background: '#FFFFFF',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} color="var(--color-cyan)" />
            AI Intelligence Provider Settings
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="input-group">
          <label className="input-label">Select AI Engine Mode</label>
          <select className="select-field" value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="simulator">Smart Built-in Simulator (Free - No API Key Required)</option>
            <option value="openai">OpenAI API Key (GPT-3.5 / GPT-4o)</option>
            <option value="gemini">Google Gemini API Key (Gemini 1.5 Flash)</option>
          </select>
        </div>

        {provider === 'openai' && (
          <div className="input-group">
            <label className="input-label">OpenAI API Key (`sk-...`)</label>
            <input 
              type="password"
              className="input-field" 
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stored strictly in your local browser localStorage.</span>
          </div>
        )}

        {provider === 'gemini' && (
          <div className="input-group">
            <label className="input-label">Google Gemini API Key (`AIzaSy...`)</label>
            <input 
              type="password"
              className="input-field" 
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stored strictly in your local browser localStorage.</span>
          </div>
        )}

        {provider === 'simulator' && (
          <div style={{ background: 'rgba(0, 242, 254, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 242, 254, 0.2)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Sparkles size={16} color="var(--color-cyan)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            The Smart Simulator allows instant full testing without entering any paid API keys. Perfect for GitHub repository visitors!
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {savedSuccess ? <><Check size={16} /> Saved!</> : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
