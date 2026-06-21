import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useVoiceStore = create(
  persist(
    (set, get) => ({
      // Transient State
      isListening: false,
      isSpeaking: false,
      transcript: '',
      lastCommand: '',
      confidence: 0,
      isOrbOpen: true, // Always show orb by default when feature is present
      isOverlayOpen: false,

      // Settings (Persisted)
      voiceEnabled: true,
      alwaysListening: false, // Wake word support
      autoReadResponses: true,
      speechRate: 1,
      pitch: 1,
      volume: 1,
      voiceType: null, // URI of the selected voice
      
      // History (Persisted)
      history: [], // Array of { time, command, response, confidence }

      // State for Guided Interview
      interviewStep: 0,

      // Actions
      setListening: (val) => set({ isListening: val }),
      setSpeaking: (val) => set({ isSpeaking: val }),
      setTranscript: (text, conf = 0) => set({ transcript: text, confidence: conf }),
      setLastCommand: (cmd) => set({ lastCommand: cmd }),
      setOverlayOpen: (val) => set({ isOverlayOpen: val }),
      setOrbOpen: (val) => set({ isOrbOpen: val }),
      setInterviewStep: (step) => set({ interviewStep: step }),
      
      addHistory: (command, response, confidence) => set((state) => {
        const newEntry = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          command,
          response,
          confidence
        };
        return { history: [newEntry, ...state.history].slice(0, 100) }; // Keep last 100
      }),
      clearHistory: () => set({ history: [] }),

      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'portfolio-os-voice-store',
      partialize: (state) => ({
        voiceEnabled: state.voiceEnabled,
        alwaysListening: state.alwaysListening,
        autoReadResponses: state.autoReadResponses,
        speechRate: state.speechRate,
        pitch: state.pitch,
        volume: state.volume,
        voiceType: state.voiceType,
        history: state.history,
      }),
    }
  )
);
