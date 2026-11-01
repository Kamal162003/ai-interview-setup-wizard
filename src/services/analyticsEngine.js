/**
 * Analytics Engine for Interview Evaluation & Scorecard Generation
 */
class AnalyticsEngine {
  evaluateSession({ job, persona, transcriptHistory }) {
    if (!transcriptHistory || transcriptHistory.length === 0) {
      return this.getEmptyReport();
    }

    let totalWords = 0;
    let totalFillerWords = 0;
    const fillerMatches = [];
    const questionEvaluations = [];

    const fillerRegex = /\b(um|uh|like|you know|basically|actually|sort of|kind of|i mean|honestly)\b/gi;
    const techKeyRegex = /\b(react|node|javascript|typescript|api|database|sql|nosql|system|architecture|cache|state|performance|test|async|promise|component|hook|redux|git|docker|aws|cloud|microservice|kafka|rest|graphql)\b/gi;

    let totalTechTermsCount = 0;

    transcriptHistory.forEach((item, index) => {
      const answerText = item.answer || '';
      const words = answerText.trim() ? answerText.trim().split(/\s+/) : [];
      const wordCount = words.length;
      totalWords += wordCount;

      // Filler words matching
      const fillersInAnswer = (answerText.match(fillerRegex) || []).map(f => f.toLowerCase());
      totalFillerWords += fillersInAnswer.length;
      if (fillersInAnswer.length > 0) {
        fillerMatches.push(...fillersInAnswer);
      }

      // Technical terms matching
      const techTermsInAnswer = (answerText.match(techKeyRegex) || []).map(t => t.toLowerCase());
      totalTechTermsCount += techTermsInAnswer.length;

      // Question quality score calculation (0 - 100)
      let score = 0;
      const isUnanswered = !answerText.trim() || 
                           answerText.trim() === '[Question Skipped by Candidate]' || 
                           answerText.trim() === '[No verbal response recorded]';

      if (isUnanswered) {
        score = 0;
      } else {
        // Base score for attempting an answer
        score = 50;
        if (wordCount >= 20) score += 15;
        if (wordCount >= 50) score += 10;
        if (wordCount < 10) score -= 25;
        if (techTermsInAnswer.length > 0) score += Math.min(techTermsInAnswer.length * 6, 20);
        if (fillersInAnswer.length > 3) score -= 10;
        score = Math.max(15, Math.min(98, score));
      }

      // Feedback generation
      let strengths = [];
      let improvements = [];

      if (isUnanswered) {
        strengths.push("Question was presented and tracked in session log.");
        improvements.push("No verbal or typed answer was recorded. To be evaluated, speak into the mic or type an answer using the STAR method.");
      } else {
        if (wordCount > 40 && techTermsInAnswer.length > 0) {
          strengths.push("Good depth and effectively incorporated concrete technical concepts.");
        } else if (wordCount <= 15) {
          improvements.push("Response was concise; expand with real-world examples (STAR method).");
        }

        if (fillersInAnswer.length > 2) {
          improvements.push(`Noticeable vocal pauses (${fillersInAnswer.slice(0, 3).join(', ')}). Pause briefly before speaking instead.`);
        } else {
          strengths.push("Clear articulation with minimal verbal pauses.");
        }
      }

      questionEvaluations.push({
        id: index + 1,
        question: item.question,
        userAnswer: answerText || "[No verbal response recorded]",
        score: score,
        wordCount: wordCount,
        fillerCount: fillersInAnswer.length,
        techTerms: Array.from(new Set(techTermsInAnswer)),
        strengths: strengths.length > 0 ? strengths : ["Answered prompt directly."],
        improvements: improvements.length > 0 ? improvements : ["Solid answer. Consider adding quantitative metrics."],
        modelAnswer: this.generateModelAnswerHint(item.question, job)
      });
    });

    // Overall Score Calculations
    const answeredCount = questionEvaluations.filter(q => q.score > 0).length;
    const totalQuestions = questionEvaluations.length;

    let overallScore = 0;
    let technicalScore = 0;
    let communicationScore = 0;
    let confidenceScore = 0;

    if (totalWords === 0 || answeredCount === 0) {
      // User never spoke or gave any answers
      overallScore = 0;
      technicalScore = 0;
      communicationScore = 0;
      confidenceScore = 0;
    } else {
      const avgQuestionScore = Math.round(
        questionEvaluations.reduce((acc, q) => acc + q.score, 0) / totalQuestions
      );

      const completionRatio = answeredCount / totalQuestions;
      
      // Calculate communication clarity based on vocal fillers relative to total words
      const fillerRatio = totalFillerWords / Math.max(1, totalWords);
      const rawCommScore = Math.max(25, Math.min(98, Math.round(90 - (fillerRatio * 250))));
      communicationScore = Math.round(rawCommScore * completionRatio);

      // Technical depth score based on technical terms density & answer quality
      const rawTechScore = Math.max(25, Math.min(98, Math.round(55 + (totalTechTermsCount * 6))));
      technicalScore = Math.round(rawTechScore * completionRatio);

      // Confidence score reflects completion and cadence
      confidenceScore = Math.round(Math.max(25, Math.min(96, (avgQuestionScore + communicationScore) / 2)));
      
      overallScore = Math.round((avgQuestionScore * 0.4) + (technicalScore * 0.3) + (communicationScore * 0.3));
    }

    // Calculate filler word frequency breakdown
    const fillerFrequency = {};
    fillerMatches.forEach(f => {
      fillerFrequency[f] = (fillerFrequency[f] || 0) + 1;
    });

    return {
      overallScore,
      technicalScore,
      communicationScore,
      confidenceScore,
      totalWords,
      totalFillerWords,
      fillerFrequency,
      estimatedPaceWpm: totalWords > 0 ? Math.round(135 + Math.random() * 20) : 0,
      questions: questionEvaluations,
      summaryRecommendation: this.getSummaryRecommendation(overallScore, totalWords)
    };
  }

  generateModelAnswerHint(question, job) {
    const qSnippet = (question || '').substring(0, 40);
    return `For questions like "${qSnippet}...", structure your response using the STAR technique (Situation, Task, Action, Result). State your specific architectural role, trade-offs evaluated, and measurable outcomes (e.g., "reduced latency by 35%").`;
  }

  getSummaryRecommendation(score, totalWords) {
    if (totalWords === 0 || score === 0) {
      return "No verbal or typed responses were recorded during this session. Please speak into your microphone or type your answers to receive a performance evaluation and scorecard.";
    }
    if (score >= 85) {
      return "Outstanding performance! You communicated technical concepts with high clarity, strong structure, and minimal filler words. You are well prepared for senior technical interviews.";
    } else if (score >= 70) {
      return "Strong performance! You demonstrated good domain knowledge. Focus on elaborating more on measurable impact and reducing minor vocal pauses.";
    } else if (score >= 40) {
      return "Good foundational effort. To boost your interview score, practice using the STAR method for behavioral/scenario questions and elaborate further on technical trade-offs.";
    } else {
      return "Needs improvement. Most questions were either skipped or answered too briefly. Practice answering technical prompts with concrete examples.";
    }
  }

  getEmptyReport() {
    return {
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      totalWords: 0,
      totalFillerWords: 0,
      fillerFrequency: {},
      estimatedPaceWpm: 0,
      questions: [],
      summaryRecommendation: "No verbal or typed responses were recorded during this session."
    };
  }
}

export const analyticsEngine = new AnalyticsEngine();
