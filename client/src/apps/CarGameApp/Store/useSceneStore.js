// ============================================
// Car Experience — Scene Store
// ============================================
import { create } from 'zustand';
import { SCENES } from '../Core/constants';

export const useSceneStore = create((set, get) => ({
  activeScene: SCENES.SPLASH,
  previousScene: null,
  isTransitioning: false,
  transitionType: 'fade', // fade, zoom, blur
  
  introComplete: false,
  introAction: null, // Track current intro timeline action for UI to respond to
  lightingProfile: 'SHOWROOM', // Default lighting profile

  setScene: (scene, transitionType = 'fade') => {
    const current = get().activeScene;
    if (current === scene) return;
    set({
      isTransitioning: true,
      transitionType,
      previousScene: current,
    });
  },

  completeTransition: (scene) => {
    set({
      activeScene: scene,
      isTransitioning: false,
    });
  },

  forceScene: (scene) => {
    set({ activeScene: scene, isTransitioning: false, previousScene: null });
  },

  setIntroComplete: (val) => set({ introComplete: val }),
  setIntroAction: (action) => set({ introAction: action }),
  setLightingProfile: (profile) => set({ lightingProfile: profile }),
}));
