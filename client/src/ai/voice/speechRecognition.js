import { useVoiceStore } from '../../store/useVoiceStore';

// Initialize SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class VoiceRecognizer {
  constructor() {
    this.recognition = null;
    this.isInitialized = false;
    this.isManualStop = false;
    this.onResultCallback = null;
    this.onWakeWordCallback = null;
  }

  init() {
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return false;
    }
    
    if (this.isInitialized) return true;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      // Started
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      let confidence = 0;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          confidence = Math.round(result[0].confidence * 100);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const textToProcess = finalTranscript || interimTranscript;
      const cleanText = textToProcess.trim().toLowerCase();

      const state = useVoiceStore.getState();
      
      // Passively listening for Wake Word
      if (state.alwaysListening && !state.isOverlayOpen) {
        if (
          cleanText.includes('hey portfolio') || 
          cleanText.includes('hey soham') || 
          cleanText.includes('hello copilot')
        ) {
          if (this.onWakeWordCallback) this.onWakeWordCallback();
        }
      } 
      // Actively listening for Commands
      else if (state.isOverlayOpen) {
        useVoiceStore.getState().setTranscript(textToProcess, confidence);
        if (finalTranscript && this.onResultCallback) {
          this.onResultCallback(finalTranscript.trim(), confidence);
        }
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
         this.isManualStop = true;
      }
    };

    this.recognition.onend = () => {
      const state = useVoiceStore.getState();
      // Auto-restart logic
      if (!this.isManualStop && (state.alwaysListening || state.isOverlayOpen)) {
        try {
          this.recognition.start();
        } catch(e) {}
      } else {
        useVoiceStore.getState().setListening(false);
      }
    };

    this.isInitialized = true;
    return true;
  }

  start() {
    if (!this.init()) return;
    this.isManualStop = false;
    try {
      this.recognition.start();
    } catch(e) {
      // Already started
    }
  }

  stop() {
    if (!this.recognition) return;
    this.isManualStop = true;
    this.recognition.stop();
  }

  onResult(callback) {
    this.onResultCallback = callback;
  }

  onWakeWord(callback) {
    this.onWakeWordCallback = callback;
  }
}

export const speechRecognizer = new VoiceRecognizer();
