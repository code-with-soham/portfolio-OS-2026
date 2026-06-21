import { useVoiceStore } from '../../store/useVoiceStore';

class VoiceSynthesizer {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    
    if (this.synth) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
      // Fetch immediately if already available
      this.voices = this.synth.getVoices();
    }
  }

  speak(text, onEndCallback = null) {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const state = useVoiceStore.getState();
    if (!state.voiceEnabled || !state.autoReadResponses) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply Settings
    utterance.rate = state.speechRate || 1;
    utterance.pitch = state.pitch || 1;
    utterance.volume = state.volume || 1;

    // Set Voice
    if (this.voices.length > 0) {
      const selectedVoice = this.voices.find(v => v.voiceURI === state.voiceType);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        // Fallback to a good default English voice if available
        const defaultVoice = this.voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Google') || v.name.includes('Microsoft')));
        if (defaultVoice) utterance.voice = defaultVoice;
      }
    }

    utterance.onstart = () => {
      useVoiceStore.getState().setSpeaking(true);
    };

    utterance.onend = () => {
      useVoiceStore.getState().setSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.error('SpeechSynthesis Error', e);
      useVoiceStore.getState().setSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      useVoiceStore.getState().setSpeaking(false);
    }
  }

  getAvailableVoices() {
    return this.voices;
  }
}

export const speechSynthesizer = new VoiceSynthesizer();
