/**
 * Browser Speech Synthesis (TTS) Engine
 */
class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.isPlaying = false;
    this.onAudioFrameCallback = null;
    this.animationFrameId = null;
    this.activeUtterance = null; // Reference prevents Chromium garbage collection bug
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
    // Fall back to all voices if no en-* voices found
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

  speak(text, { pitch = 1, rate = 1, onStart, onEnd } = {}) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stop(); // Cancel any ongoing speech

    // Ensure audio subsystem is active in Chrome
    if (this.synth.paused) {
      this.synth.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance; // Retain reference to prevent GC cutting speech short

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => {
      this.isPlaying = true;
      if (onStart) onStart();
      this.simulateAudioSpectrum();
    };

    const cleanup = () => {
      this.isPlaying = false;
      this.activeUtterance = null;
      this.stopSpectrum();
    };

    utterance.onend = () => {
      cleanup();
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      cleanup();
      if (onEnd) onEnd();
    };

    // Small timeout ensures speechSynthesis queue is clear after cancel
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
    this.isPlaying = false;
    this.activeUtterance = null;
    this.stopSpectrum();
  }

  setAudioFrameCallback(cb) {
    this.onAudioFrameCallback = cb;
  }

  simulateAudioSpectrum() {
    if (!this.isPlaying) return;

    // Generate procedural speech frequency spectrum data for canvas visualizer
    const animate = () => {
      if (!this.isPlaying) return;
      
      const bufferLength = 32;
      const dataArray = new Uint8Array(bufferLength);
      
      for (let i = 0; i < bufferLength; i++) {
        // Create natural conversational wave pattern
        const base = Math.sin(Date.now() * 0.01 + i * 0.3) * 0.5 + 0.5;
        const jitter = Math.random() * 0.4;
        dataArray[i] = Math.floor((base * 0.6 + jitter * 0.4) * 220);
      }

      if (this.onAudioFrameCallback) {
        this.onAudioFrameCallback(dataArray);
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  stopSpectrum() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.onAudioFrameCallback) {
      const zeros = new Uint8Array(32);
      this.onAudioFrameCallback(zeros);
    }
  }
}

export const speechSynthesizer = new SpeechSynthesisService();
