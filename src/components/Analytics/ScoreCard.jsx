import React from 'react';
import { Award, Zap, MessageCircle, ShieldCheck, Download, AlertCircle } from 'lucide-react';

export default function ScoreCard({ report, onExport }) {
  const hasSpoken = report.totalWords > 0 && report.overallScore > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '2rem',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Main Score Ring */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: 'var(--radius-full)',
            background: '#FFFFFF',
            border: `4px solid ${hasSpoken ? 'var(--color-cyan)' : '#CBD5E1'}`,
            boxShadow: hasSpoken ? '0 8px 25px rgba(2, 132, 199, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 1)' : '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: hasSpoken ? 'var(--color-cyan)' : 'var(--text-muted)' }}>
              {report.overallScore}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OUT OF 100</span>
          </div>

          <div>
            {hasSpoken ? (
              <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                <Award size={13} /> Performance Evaluated
              </div>
            ) : (
              <div className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
                <AlertCircle size={13} /> Incomplete Session — No Answers Recorded
              </div>
            )}
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Interview Evaluation Report</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', marginTop: '0.25rem' }}>
              {report.summaryRecommendation}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onExport}>
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Sub-Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* Technical Score */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: hasSpoken ? 'rgba(0, 242, 254, 0.12)' : '#F1F5F9', color: hasSpoken ? 'var(--color-cyan)' : 'var(--text-muted)' }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Technical Depth</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{report.technicalScore}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span></div>
          </div>
        </div>

        {/* Communication Score */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: hasSpoken ? 'rgba(124, 58, 237, 0.15)' : '#F1F5F9', color: hasSpoken ? '#A78BFA' : 'var(--text-muted)' }}>
            <MessageCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Communication Clarity</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{report.communicationScore}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span></div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: hasSpoken ? 'rgba(16, 185, 129, 0.12)' : '#F1F5F9', color: hasSpoken ? 'var(--color-emerald)' : 'var(--text-muted)' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{report.confidenceScore}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
