import { speechRecognizer } from './speechRecognition';
import { speechSynthesizer } from './speechSynthesis';
import { processVoiceCommand } from './voiceCommands';
import { useVoiceStore } from '../../store/useVoiceStore';

class VoiceController {
  init() {
    speechRecognizer.onResult(this.handleTranscript.bind(this));
    speechRecognizer.onWakeWord(this.handleWakeWord.bind(this));
    
    // If always listening is enabled, start passively
    const state = useVoiceStore.getState();
    if (state.voiceEnabled && state.alwaysListening) {
      speechRecognizer.start();
    }
  }

  toggleListening() {
    const state = useVoiceStore.getState();
    if (!state.voiceEnabled) return;

    if (state.isOverlayOpen) {
      this.stopActiveListening();
    } else {
      this.startActiveListening();
    }
  }

  startActiveListening() {
    const state = useVoiceStore.getState();
    if (!state.voiceEnabled) return;

    speechSynthesizer.stop(); // Stop any ongoing speech
    useVoiceStore.getState().setOverlayOpen(true);
    useVoiceStore.getState().setListening(true);
    useVoiceStore.getState().setTranscript('', 0);
    speechRecognizer.start();
  }

  stopActiveListening() {
    useVoiceStore.getState().setOverlayOpen(false);
    
    // If we're not always listening, actually stop the recognizer
    const state = useVoiceStore.getState();
    if (!state.alwaysListening) {
      speechRecognizer.stop();
      useVoiceStore.getState().setListening(false);
    }
  }

  handleWakeWord() {
    // We heard "Hey Portfolio", so wake up and start actively listening
    this.startActiveListening();
  }

  async handleTranscript(text, confidence) {
    if (!text.trim()) return;
    
    useVoiceStore.getState().setLastCommand(text);
    this.stopActiveListening(); // Stop listening to process and speak

    // Log to history
    useVoiceStore.getState().addHistory(text, '...', confidence);

    // Process through Commands/Brain
    const responseText = await processVoiceCommand(text);

    // Update history with actual response
    const currentHistory = useVoiceStore.getState().history;
    if (currentHistory.length > 0) {
      // Modify the latest entry which we just pushed
      const newHistory = [...currentHistory];
      newHistory[0] = { ...newHistory[0], response: responseText };
      useVoiceStore.getState().updateSettings({ history: newHistory });
    }

    // Speak it
    speechSynthesizer.speak(responseText, () => {
      // Done speaking.
      // If we are in interview mode, or we have followups, we could auto-restart listening here.
      // For now, let it return to idle (or passive always-listening).
    });
  }
}

export const voiceController = new VoiceController();
