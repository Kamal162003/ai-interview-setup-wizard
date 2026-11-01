import React from 'react';
import { JOB_PRESETS } from '../../data/presets';
import { Briefcase, Building, Layers, Sparkles, ArrowRight } from 'lucide-react';

export default function StepJobInput({ jobData, setJobData, onNext }) {
  const handleSelectPreset = (preset) => {
    setJobData({
      id: preset.id,
      title: preset.title,
      company: preset.company,
      level: preset.level,
      description: preset.description,
      defaultQuestions: preset.defaultQuestions
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Choose Your Target <span className="gradient-text">Interview Role</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Select a role template below or paste a custom job description to tailor your mock interview.
        </p>
      </div>

      {/* Role Preset Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {JOB_PRESETS.map((preset, idx) => {
          const isSelected = jobData.id === preset.id;
          return (
            <div
              key={preset.id}
              className={`glass-card animate-scale-in ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelectPreset(preset)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem', animationDelay: `${idx * 0.08}s` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-cyan">{preset.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{preset.level}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{preset.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building size={13} /> {preset.company}
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {preset.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Custom Job Inputs */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={18} color="var(--color-cyan)" />
          Job Specification Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Job Title / Position</label>
            <input 
              className="input-field" 
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value, id: 'custom' })}
              placeholder="e.g. Senior Fullstack Engineer"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Target Seniority Level</label>
            <select 
              className="select-field"
              value={jobData.level}
              onChange={(e) => setJobData({ ...jobData, level: e.target.value })}
            >
              <option value="Junior">Junior (0-2 YOE)</option>
              <option value="Mid-Level">Mid-Level (2-5 YOE)</option>
              <option value="Senior">Senior (5-8 YOE)</option>
              <option value="Staff / Lead">Staff / Principal (8+ YOE)</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Job Description / Requirements (Optional - Priming AI)</label>
          <textarea 
            className="textarea-field"
            value={jobData.description}
            onChange={(e) => setJobData({ ...jobData, description: e.target.value, id: 'custom' })}
            placeholder="Paste job description, required technical stack, responsibilities..."
            rows={4}
          />
        </div>
      </div>

      {/* Continue Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={onNext} style={{ padding: '0.85rem 2rem' }}>
          Next: Choose Persona <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
