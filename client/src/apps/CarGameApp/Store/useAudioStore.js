// ============================================
// Car Experience — Audio Store
// ============================================
import { create } from 'zustand';

export const useAudioStore = create((set) => ({
  isMuted: false,
  currentTrack: null,
  isPlaying: false,

  // Per-channel mute
  musicMuted: false,
  uiMuted: false,
  vehicleMuted: false,
  environmentMuted: false,

  setMuted: (v) => set({ isMuted: v }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  stop: () => set({ isPlaying: false, currentTrack: null }),

  toggleMusicMute: () => set((s) => ({ musicMuted: !s.musicMuted })),
  toggleUIMute: () => set((s) => ({ uiMuted: !s.uiMuted })),
  toggleVehicleMute: () => set((s) => ({ vehicleMuted: !s.vehicleMuted })),
  toggleEnvironmentMute: () => set((s) => ({ environmentMuted: !s.environmentMuted })),
}));
