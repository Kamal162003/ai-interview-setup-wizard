/**
 * Web Speech Recognition Service wrapper
 */
class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = typeof window !== 'undefined' 
      ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
      : null;
    this.isSupported = !!SpeechRecognition;
    
    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
    
    this.isListening = false;
    this.onTranscriptCallback = null;
    this.onStatusCallback = null;
    this.finalTranscript = '';
    this.interimTranscript = '';
  }

  init({ onTranscript, onStatusChange }) {
    this.onTranscriptCallback = onTranscript;
    this.onStatusCallback = onStatusChange;

    if (!this.isSupported) {
      if (this.onStatusCallback) this.onStatusCallback('unsupported');
      return false;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStatusCallback) this.onStatusCallback('listening');
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      // Rebuild completely from event.results to prevent duplicate phrases on interim-to-final transitions
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      
      this.finalTranscript = final;
      this.interimTranscript = interim;

      const fullText = (this.finalTranscript + (interim ? ' ' + interim : '')).trim();
      if (this.onTranscriptCallback) {
        this.onTranscriptCallback({
          final: this.finalTranscript.trim(),
          interim: interim.trim(),
          full: fullText
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech recognition event warning:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.isListening = false;
        if (this.onStatusCallback) this.onStatusCallback('denied');
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Automatically restart if still intended to be listening
        try {
          this.recognition.start();
        } catch (e) {
          this.isListening = false;
          if (this.onStatusCallback) this.onStatusCallback('stopped');
        }
      } else {
        if (this.onStatusCallback) this.onStatusCallback('stopped');
      }
    };

    return true;
  }

  start() {
    if (!this.isSupported) return false;
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.isListening = true;
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Recognition already started:', e);
      return false;
    }
  }

  stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
    }
    // Return full text including any pending interim text so trailing speech is never dropped
    const fullText = (this.finalTranscript + (this.interimTranscript ? ' ' + this.interimTranscript : '')).trim();
    return fullText;
  }

  reset() {
    this.finalTranscript = '';
    this.interimTranscript = '';
  }
}

export const speechRecognizer = new SpeechRecognitionService();
