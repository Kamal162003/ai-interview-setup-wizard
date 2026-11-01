import React from 'react';
import { JOB_PRESETS } from '../../data/presets';
import { Briefcase, Building, ArrowRight } from 'lucide-react';

export default function StepJobInput({ jobData, setJobData, onNext }) {
  const handleSelectPreset = (preset) => {
    setJobData({
      id: preset.id,
      title: preset.title,
      company: preset.company,
      level: preset.level,
      description: preset.description
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Step 1 of 3</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Choose Target <span className="gradient-text">Role Template</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Select a pre-configured role template or enter custom job details for the setup wizard.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
        {JOB_PRESETS.map((preset) => {
          const isSelected = jobData.id === preset.id;
          return (
            <div
              key={preset.id}
              className={`glass-card ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelectPreset(preset)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-cyan">{preset.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{preset.level}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{preset.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building size={13} /> {preset.company}
              </p>
            </div>
          );
        })}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={18} color="var(--color-cyan)" />
          Job Specification Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Job Title</label>
            <input 
              className="input-field" 
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value, id: 'custom' })}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Seniority Level</label>
            <select 
              className="select-field"
              value={jobData.level}
              onChange={(e) => setJobData({ ...jobData, level: e.target.value })}
            >
              <option value="Junior">Junior (0-2 YOE)</option>
              <option value="Mid-Level">Mid-Level (2-5 YOE)</option>
              <option value="Senior">Senior (5-8 YOE)</option>
              <option value="Staff / Lead">Staff / Lead (8+ YOE)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={onNext} style={{ padding: '0.85rem 2rem' }}>
          Next: Choose Persona <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
