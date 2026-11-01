import React from 'react';
import { VolumeX, Gauge, MessageSquare, Check, MicOff } from 'lucide-react';

export default function FillerWordsAnalysis({ report }) {
  const fillerEntries = Object.entries(report.fillerFrequency || {});
  const hasSpoken = report.totalWords > 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
      {/* Filler Words Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <VolumeX size={18} color={hasSpoken ? "var(--color-rose)" : "var(--text-muted)"} />
          Vocal Pauses & Filler Words
        </h3>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            color: !hasSpoken ? 'var(--text-muted)' : (report.totalFillerWords === 0 ? 'var(--color-emerald)' : 'var(--color-rose)')
          }}>
            {report.totalFillerWords}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>total vocal pauses detected</span>
        </div>

        {!hasSpoken ? (
          <div style={{ padding: '0.75rem', background: '#F1F5F9', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MicOff size={16} /> No verbal speech was recorded during this session.
          </div>
        ) : fillerEntries.length === 0 ? (
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-emerald)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} /> Exceptional speech control! Zero filler words detected.
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {fillerEntries.map(([word, count]) => (
              <span key={word} className="badge badge-amber" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                "{word}" ({count}x)
              </span>
            ))}
          </div>
        )}

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tip: Replace vocal fillers with a silent 1-second pause to project confidence and authority during technical interviews.
        </p>
      </div>

      {/* Speech Pace & Volume Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gauge size={18} color="var(--color-cyan)" />
          Speech Cadence & Pace
        </h3>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: hasSpoken ? 'var(--color-cyan)' : 'var(--text-muted)' }}>
            {report.estimatedPaceWpm}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Words Per Minute (WPM)</span>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {!hasSpoken ? (
            <span>No verbal response detected. Target interview conversational speech cadence is <strong>130 - 150 WPM</strong>.</span>
          ) : (
            <span>Target interview cadence is <strong>130 - 150 WPM</strong>. Your pace allows interviewers to digest technical architecture easily.</span>
          )}
        </div>
      </div>
    </div>
  );
}
