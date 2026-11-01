class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.activeUtterance = null;
    this.voiceChangeListeners = new Set();

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.addEventListener('voiceschanged', () => this.loadVoices());
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    const allVoices = this.synth.getVoices() || [];
    const enVoices = allVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
    this.voices = enVoices.length > 0 ? enVoices : allVoices;

    if (this.voices.length > 0) {
      if (!this.selectedVoice || !this.voices.some(v => v.name === this.selectedVoice.name)) {
        this.selectedVoice = this.voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.default) || this.voices[0];
      }
    }

    this.voiceChangeListeners.forEach(listener => {
      try { listener(this.voices); } catch (e) { console.warn('Error in voice listener:', e); }
    });
  }

  onVoicesChanged(cb) {
    this.voiceChangeListeners.add(cb);
    return () => this.voiceChangeListeners.delete(cb);
  }

  getAvailableVoices() {
    if (this.voices.length === 0) this.loadVoices();
    return this.voices;
  }

  setVoiceByName(name) {
    const v = this.voices.find(voice => voice.name === name);
    if (v) this.selectedVoice = v;
  }

  speak(text, { onEnd } = {}) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }
    this.stop();

    if (this.synth.paused) {
      this.synth.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;

    if (this.selectedVoice) utterance.voice = this.selectedVoice;

    const cleanup = () => {
      this.activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onend = cleanup;
    utterance.onerror = cleanup;

    setTimeout(() => {
      if (this.synth && this.activeUtterance === utterance) {
        this.synth.speak(utterance);
      }
    }, 40);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.activeUtterance = null;
  }
}

export const speechSynthesizer = new SpeechSynthesisService();
