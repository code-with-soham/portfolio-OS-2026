import { create } from 'zustand';

export const useSystemAudioStore = create((set, get) => ({
  volume: 0.75, // Default volume 75%
  isMuted: false,
  showOSD: false,
  osdTimeout: null,

  setVolume: (volume) => {
    // If it was muted and we change volume, unmute it
    const { isMuted, osdTimeout } = get();
    
    // Clear previous timeout for OSD
    if (osdTimeout) {
      clearTimeout(osdTimeout);
    }

    const newTimeout = setTimeout(() => {
      set({ showOSD: false });
    }, 2000); // Hide after 2 seconds

    set({ 
      volume, 
      isMuted: volume > 0 ? false : isMuted,
      showOSD: true,
      osdTimeout: newTimeout
    });
  },

  toggleMute: () => {
    const { osdTimeout } = get();
    
    if (osdTimeout) {
      clearTimeout(osdTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      set({ showOSD: false });
    }, 2000);

    set((state) => ({ 
      isMuted: !state.isMuted,
      showOSD: true,
      osdTimeout: newTimeout
    }));
  },
}));
