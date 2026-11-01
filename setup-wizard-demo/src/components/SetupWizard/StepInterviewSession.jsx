import React, { useState, useEffect } from 'react';
import { INTERVIEW_QUESTIONS } from '../../data/interviewQuestions';
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  Award,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

export default function StepInterviewSession({ 
  jobData, 
  selectedPersona, 
  onCompleteSession,
  onCancelSession 
}) {
  // Get questions for current job or fallback to frontend
  const questionsList = INTERVIEW_QUESTIONS[jobData.id] || INTERVIEW_QUESTIONS['frontend-engineer'];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [userAnswersHistory, setUserAnswersHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const currentQ = questionsList[currentQuestionIndex];

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Voice recording timer simulation
  useEffect(() => {
    let recTimer;
    if (isRecording) {
      recTimer = setInterval(() => setRecordingSeconds(prev => prev + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(recTimer);
  }, [isRecording]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate live transcription speech
      if (!userAnswer) {
        setUserAnswer("In my experience, the key strategy involves optimizing the initial load phase through code-splitting and leveraging virtualized rendering lists to keep DOM nodes minimal...");
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    setCurrentFeedback(null);

    setTimeout(() => {
      setIsEvaluating(false);
      const feedback = currentQ.sampleFeedback || {
        score: Math.floor(Math.random() * 15) + 82,
        strengths: "Well structured answer addressing primary architectural principles.",
        tips: "Try adding quantitative metrics or benchmark results to strengthen impact."
      };

      setCurrentFeedback(feedback);

      setUserAnswersHistory(prev => [
        ...prev,
        {
          question: currentQ,
          answer: userAnswer,
          feedback: feedback
        }
      ]);
    }, 1400);
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setCurrentFeedback(null);
    setShowHint(false);
    
    if (currentQuestionIndex + 1 < questionsList.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finished all questions! Complete session with recorded history
      onCompleteSession({
        history: userAnswersHistory,
        totalTime: sessionTime,
        jobData,
        selectedPersona
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Session Top Bar Header */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--gradient-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: 'var(--shadow-glow-purple)'
          }}>
            {selectedPersona.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {selectedPersona.name}
              <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                {selectedPersona.role}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Interviewing for: <strong style={{ color: 'var(--text-primary)' }}>{jobData.title}</strong>
            </div>
          </div>
        </div>

        {/* Status Indicators & Session Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Animated Speech Equalizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0, 242, 254, 0.08)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            <Volume2 size={15} color="var(--color-cyan)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
              Persona Audio Active
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px', marginLeft: '4px' }}>
              <div className="audio-wave-bar" style={{ animationDelay: '0s' }}></div>
              <div className="audio-wave-bar" style={{ animationDelay: '0.2s' }}></div>
              <div className="audio-wave-bar" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Clock size={16} />
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>{formatTime(sessionTime)}</span>
          </div>

          <button className="btn btn-secondary" onClick={onCancelSession} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
            End Early
          </button>
        </div>
      </div>

      {/* Persona Greeting Banner */}
      {currentQuestionIndex === 0 && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--color-purple)', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} /> Persona Greeting
          </div>
          <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            "{selectedPersona.greeting}"
          </p>
        </div>
      )}

      {/* Active Question Box */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-cyan">Question {currentQuestionIndex + 1} of {questionsList.length}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• {currentQ.topic}</span>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
            {currentQ.difficulty}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.45 }}>
          {currentQ.question}
        </h3>

        {/* Hint toggle */}
        {currentQ.hint && (
          <div>
            <button 
              onClick={() => setShowHint(!showHint)} 
              style={{ background: 'none', border: 'none', color: 'var(--color-amber)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: 0 }}
            >
              <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'Need a hint?'}
            </button>
            {showHint && (
              <div style={{ marginTop: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#FCD34D' }}>
                💡 <strong>Hint:</strong> {currentQ.hint}
              </div>
            )}
          </div>
        )}

        {/* Answer Input Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="input-label">Your Technical Response</label>
            
            {/* Voice Rec Button */}
            <button 
              onClick={handleToggleRecord}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isRecording ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: isRecording ? '1px solid var(--color-rose)' : '1px solid var(--border-glass)',
                color: isRecording ? 'var(--color-rose)' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isRecording ? (
                <>
                  <MicOff size={14} /> Recording ({recordingSeconds}s)...
                </>
              ) : (
                <>
                  <Mic size={14} /> Record Answer (Voice STT)
                </>
              )}
            </button>
          </div>

          <textarea
            className="textarea-field"
            rows={5}
            placeholder="Type or speak your answer here... Be specific with technical examples, architectures, and performance tradeoffs."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={isEvaluating}
            style={{ resize: 'vertical' }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            {!currentFeedback ? (
              <button 
                className="btn btn-primary" 
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isEvaluating}
                style={{ padding: '0.75rem 1.75rem', opacity: (!userAnswer.trim() || isEvaluating) ? 0.6 : 1 }}
              >
                {isEvaluating ? (
                  <>Evaluating with AI...</>
                ) : (
                  <>
                    <Send size={16} /> Submit Answer for AI Review
                  </>
                )}
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={handleNextQuestion}
                style={{ padding: '0.75rem 1.75rem', background: 'var(--gradient-emerald)' }}
              >
                {currentQuestionIndex + 1 < questionsList.length ? (
                  <>
                    Next Question <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    Complete & View Results <Award size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* AI Real-Time Feedback Card */}
        {currentFeedback && (
          <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-emerald)', fontWeight: 700, fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} /> AI Evaluation Feedback
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-emerald)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '0.85rem' }}>
                Score: {currentFeedback.score} / 100
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Strengths:</strong> {currentFeedback.strengths}
            </div>

            <div style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#FCD34D' }}>Growth Suggestion:</strong> {currentFeedback.tips}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
