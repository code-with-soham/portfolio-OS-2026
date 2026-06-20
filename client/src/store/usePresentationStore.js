import { create } from 'zustand';

// Types of presentation modes
export const MODE_NONE = 'NONE';
export const MODE_F9_PRESENTATION = 'PRESENTATION';
export const MODE_F10_DEMO = 'DEMO';

export const usePresentationStore = create((set, get) => ({
  activeMode: MODE_NONE,
  currentStep: 0,
  totalSteps: 0,
  overlayText: '',
  isHealthScoreVisible: false,

  startPresentation: () => {
    set({
      activeMode: MODE_F9_PRESENTATION,
      currentStep: 1,
      totalSteps: 5,
      overlayText: 'Welcome Recruiter 👋\nLet me show you my work...',
      isHealthScoreVisible: false,
    });
  },

  startDemo: () => {
    set({
      activeMode: MODE_F10_DEMO,
      currentStep: 1,
      totalSteps: 6,
      overlayText: 'Welcome to Portfolio OS\nI am Soham Kundu.\nLet me show you around...',
      isHealthScoreVisible: false,
    });
  },

  stopAll: () => {
    set({
      activeMode: MODE_NONE,
      currentStep: 0,
      overlayText: '',
      isHealthScoreVisible: false,
    });
  },

  setStep: (step, text) => {
    set({
      currentStep: step,
      overlayText: text,
    });
  },

  showHealthScore: () => {
    set({ isHealthScoreVisible: true });
  }
}));
