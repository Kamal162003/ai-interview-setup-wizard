/**
 * AI Engine Service (OpenAI API / Gemini API / Built-in Smart Simulator)
 */
class AIEngine {
  constructor() {
    this.provider = (typeof localStorage !== 'undefined' ? localStorage.getItem('ai_provider') : null) || 'simulator'; // 'simulator', 'openai', 'gemini'
    this.openaiKey = (typeof localStorage !== 'undefined' ? localStorage.getItem('openai_api_key') : null) || '';
    this.geminiKey = (typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') : null) || '';
    this.listeners = new Set();
  }

  onSettingsChange(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  saveSettings({ provider, openaiKey, geminiKey }) {
    this.provider = provider || 'simulator';
    this.openaiKey = (openaiKey || '').trim();
    this.geminiKey = (geminiKey || '').trim();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ai_provider', this.provider);
      localStorage.setItem('openai_api_key', this.openaiKey);
      localStorage.setItem('gemini_api_key', this.geminiKey);
    }
    this.listeners.forEach(cb => {
      try { cb(this.getSettings()); } catch (e) { console.warn('Error in settings listener:', e); }
    });
  }

  getSettings() {
    return {
      provider: this.provider,
      openaiKey: this.openaiKey,
      geminiKey: this.geminiKey
    };
  }

  async generateNextQuestion({ jobDescription, persona, questionHistory, userResponse }) {
    if (this.provider === 'openai' && this.openaiKey) {
      try {
        return await this.callOpenAI({ jobDescription, persona, questionHistory, userResponse });
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to smart simulator:', err);
      }
    } else if (this.provider === 'gemini' && this.geminiKey) {
      try {
        return await this.callGemini({ jobDescription, persona, questionHistory, userResponse });
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart simulator:', err);
      }
    }

    // Default Smart Simulator fallback
    return this.smartSimulatedResponse({ jobDescription, persona, questionHistory, userResponse });
  }

  async callOpenAI({ jobDescription, persona, questionHistory, userResponse }) {
    const systemPrompt = `You are an expert interviewer with the following persona: ${persona.name} (${persona.role}). Tone: ${persona.tone}.
Job Description Context: ${jobDescription}
Conduct a realistic voice interview. Respond with brief, natural conversational dialogue (max 3-4 sentences).
Acknowledge the candidate's last response, provide a quick micro-feedback, and ask the next insightful question.`;

    // Construct clean conversation messages without duplicating the latest user response
    const messages = [{ role: 'system', content: systemPrompt }];

    questionHistory.forEach((q, idx) => {
      messages.push({ role: 'assistant', content: q.question });
      if (q.answer) {
        messages.push({ role: 'user', content: q.answer });
      }
    });

    // If the latest userResponse wasn't already at the end of questionHistory, append it
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userResponse) {
      if (userResponse && userResponse.trim()) {
        messages.push({ role: 'user', content: userResponse });
      }
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message || 'OpenAI API request failed');
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Unexpected OpenAI response format');
    }
    return data.choices[0].message.content.trim();
  }

  async callGemini({ jobDescription, persona, questionHistory, userResponse }) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(this.geminiKey)}`;
    
    const prompt = `You are ${persona.name} (${persona.role}). Tone: ${persona.tone}.
Job Description: ${jobDescription}
Candidate just answered: "${userResponse}"
Provide a natural, brief response (3-4 sentences maximum). Acknowledge their response, give brief constructive micro-feedback, and ask the next relevant interview question.`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message || 'Gemini API call returned an error');
    }
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error('Gemini API response format error');
  }

  smartSimulatedResponse({ jobDescription, persona, questionHistory, userResponse }) {
    const questionIndex = (questionHistory && questionHistory.length) ? questionHistory.length : 1;
    const cleanResp = (userResponse || '').trim();
    const lowerResp = cleanResp.toLowerCase();
    const words = cleanResp ? cleanResp.split(/\s+/).filter(Boolean) : [];

    // Check key concepts in user response
    const hasTechnicalTerms = /react|node|api|database|system|component|state|scale|cache|auth|architecture|test|git|ci\/cd|pipeline|performance/.test(lowerResp);
    const hasStarTerms = /situation|task|action|result|project|team|disagreed|learned|metric|impact|challenge/.test(lowerResp);
    const isBrief = words.length < 15;

    let microFeedback = "";
    if (words.length === 0) {
      microFeedback = "Let's move on to the next topic.";
    } else if (isBrief) {
      microFeedback = "Thank you for that initial overview. I'd love a bit more specific detail on your implementation.";
    } else if (hasTechnicalTerms || hasStarTerms) {
      microFeedback = "Excellent explanation. You clearly highlighted relevant trade-offs and practical experience.";
    } else {
      microFeedback = "I see. Thanks for sharing that perspective.";
    }

    // Dynamic follow-up question bank based on question index & persona
    const followUps = [
      `Building on what you mentioned, how would you handle a situation where system load spikes by 10x unexpectedly during peak traffic?`,
      `That's a solid point. Could you elaborate on how you measure and validate the technical or business impact of that decision?`,
      `Interesting approach. If a junior developer on your team disagreed with this strategy, how would you walk them through your reasoning?`,
      `Great insight. Moving to system design and reliability, how do you handle monitoring, error tracking, and graceful fallback when third-party services fail?`,
      `To wrap up our technical discussion, what is one major architectural trade-off you made in a recent project that you would do differently today?`
    ];

    const safeIndex = Math.max(0, questionIndex - 1);
    const nextQ = followUps[safeIndex % followUps.length] || "Thank you. Is there any technical question you have for me about our architecture or engineering culture?";

    return `${microFeedback} ${nextQ}`;
  }
}

export const aiEngine = new AIEngine();
