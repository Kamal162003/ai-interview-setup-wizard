import React, { useState } from 'react';
import { Download, Copy, Check, X, FileText, Code } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, report, job, persona }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const generateMarkdownReport = () => {
    return `# Interview Evaluation Report - ${job.title}
**Date:** ${new Date().toLocaleDateString()}
**Interviewer Persona:** ${persona.name} (${persona.role})
**Overall Score:** ${report.overallScore}/100

---

## Performance Summary
- **Technical Depth:** ${report.technicalScore}/100
- **Communication Clarity:** ${report.communicationScore}/100
- **Confidence Rating:** ${report.confidenceScore}/100
- **Total Words Spoken:** ${report.totalWords}
- **Vocal Pauses / Filler Words:** ${report.totalFillerWords}

### Recommendation
${report.summaryRecommendation}

---

## Question & Answer Breakdown
${report.questions.map(q => `
### Q${q.id}: ${q.question}
**Score:** ${q.score}/100

**Candidate Response:**
> "${q.userAnswer}"

**Strengths:**
${q.strengths.map(s => `- ${s}`).join('\n')}

**Improvements:**
${q.improvements.map(imp => `- ${imp}`).join('\n')}

**Model Answer Recommendation:**
${q.modelAnswer}
`).join('\n\n---\n\n')}
`;
  };

  const handleDownloadMd = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_Report_${job.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMd = () => {
    const md = generateMarkdownReport();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
        maxWidth: '580px',
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
            <FileText size={20} color="var(--color-cyan)" />
            Export Interview Scorecard
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Download your complete interview transcript, score breakdown, and improvement tips in formatted Markdown.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={handleDownloadMd} style={{ flex: 1 }}>
            <Download size={18} /> Download Markdown (.md)
          </button>
          <button className="btn btn-secondary" onClick={handleCopyMd} style={{ flex: 1 }}>
            {copied ? <><Check size={18} color="var(--color-emerald)" /> Copied!</> : <><Copy size={18} /> Copy to Clipboard</>}
          </button>
        </div>
      </div>
    </div>
  );
}
