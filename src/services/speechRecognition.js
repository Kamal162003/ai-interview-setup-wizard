class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!SpeechRecognition;
    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  init({ onTranscript, onStatusChange }) {
    if (!this.isSupported) {
      if (onStatusChange) onStatusChange('unsupported');
      return false;
    }
    this.recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      if (onTranscript) onTranscript({ full: text });
    };
    this.recognition.onerror = () => {
      if (onStatusChange) onStatusChange('denied');
    };
    return true;
  }

  start() {
    if (!this.isSupported) return false;
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      return false;
    }
  }

  stop() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
  }
}

export const speechRecognizer = new SpeechRecognitionService();
