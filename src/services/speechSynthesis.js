class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices().filter(v => v.lang.startsWith('en'));
    if (this.voices.length > 0 && !this.selectedVoice) {
      this.selectedVoice = this.voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.default) || this.voices[0];
    }
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
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    utterance.onend = () => { if (onEnd) onEnd(); };
    utterance.onerror = () => { if (onEnd) onEnd(); };
    this.synth.speak(utterance);
  }
}

export const speechSynthesizer = new SpeechSynthesisService();
