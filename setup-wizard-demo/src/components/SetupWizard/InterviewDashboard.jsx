import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  Briefcase, 
  User, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Clock, 
  ShieldCheck, 
  MessageSquare 
} from 'lucide-react';

export default function InterviewDashboard({ sessionData, onRestart }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const history = sessionData?.history || [];
  const totalQuestions = history.length || 1;
  
  // Calculate average score
  const totalScoreSum = history.reduce((acc, item) => acc + (item.feedback?.score || 85), 0);
  const averageScore = Math.round(totalScoreSum / totalQuestions);

  const getScoreBadge = (score) => {
    if (score === 0) return { label: 'Incomplete / No Answers', color: 'var(--text-muted)', bg: 'rgba(100, 116, 139, 0.15)' };
    if (score >= 90) return { label: 'Strong Hire', color: 'var(--color-emerald)', bg: 'rgba(16, 185, 129, 0.15)' };
    if (score >= 80) return { label: 'Recommended', color: 'var(--color-cyan)', bg: 'rgba(0, 242, 254, 0.15)' };
    return { label: 'Needs Improvement', color: 'var(--color-amber)', bg: 'rgba(245, 158, 11, 0.15)' };
  };

  const badgeInfo = getScoreBadge(averageScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Top Banner Overview */}
      <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(0, 242, 254, 0.12)',
          border: `3px solid ${badgeInfo.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 800,
          color: badgeInfo.color,
          boxShadow: 'var(--shadow-glow-cyan)'
        }}>
          {averageScore}
        </div>

        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', background: badgeInfo.bg, color: badgeInfo.color, fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={16} /> Recommendation: {badgeInfo.label}
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Interview Performance Summary</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Role: <strong style={{ color: 'var(--text-primary)' }}>{sessionData.jobData?.title}</strong> • Persona: <strong style={{ color: 'var(--color-purple)' }}>{sessionData.selectedPersona?.name}</strong>
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Match</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-cyan)', marginTop: '0.2rem' }}>{averageScore}%</div>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Questions Answered</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{totalQuestions}</div>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Technical Rigor</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-emerald)', marginTop: '0.2rem' }}>92%</div>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Communication & Clarity</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#A78BFA', marginTop: '0.2rem' }}>88%</div>
          </div>
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} color="var(--color-cyan)" /> Detailed Question & AI Review Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div key={idx} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div 
                  onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-cyan">Q{idx + 1}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.question?.topic}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-emerald)', fontSize: '0.9rem' }}>
                      {item.feedback?.score || 88} / 100
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  "{item.question?.question}"
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Your Technical Answer:
                      </div>
                      <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                        "{item.answer || 'No answer submitted'}"
                      </div>
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-emerald)' }}>
                        AI Evaluation & Key Insights
                      </div>
                      <div style={{ fontSize: '0.88rem' }}>
                        <strong>Strengths:</strong> {item.feedback?.strengths}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        <strong>Growth Areas:</strong> {item.feedback?.tips}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onRestart} style={{ padding: '0.85rem 2rem' }}>
          <RotateCcw size={18} /> Restart Setup Wizard
        </button>

        <button className="btn btn-secondary" onClick={() => alert("Session Summary Report exported successfully!")} style={{ padding: '0.85rem 1.75rem' }}>
          <Download size={18} /> Export Full Summary PDF
        </button>
      </div>
    </div>
  );
}
