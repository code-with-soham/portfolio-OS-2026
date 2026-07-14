// ============================================
// Car Experience — Settings Store
// ============================================
import { create } from 'zustand';
import { QUALITY_PRESETS } from '../Core/constants';

const savedQuality = typeof localStorage !== 'undefined' 
  ? localStorage.getItem('carGame_quality') || 'HIGH' 
  : 'HIGH';

export const useSettingsStore = create((set, get) => ({
  qualityPreset: savedQuality,
  quality: QUALITY_PRESETS[savedQuality] || QUALITY_PRESETS.HIGH,

  // Audio volumes (0-1)
  masterVolume: 0.8,
  musicVolume: 0.5,
  uiVolume: 0.7,
  vehicleVolume: 0.9,
  environmentVolume: 0.6,

  // Accessibility
  colorBlindMode: false,
  reducedMotion: false,
  cameraShake: true,
  brightness: 100,
  fieldOfView: 50,

  setQuality: (preset) => {
    const quality = QUALITY_PRESETS[preset];
    if (quality) {
      set({ qualityPreset: preset, quality });
      try { localStorage.setItem('carGame_quality', preset); } catch(e) {}
      window.dispatchEvent(new CustomEvent('velocity:settings:changed', { detail: { qualityPreset: preset } }));
    }
  },

  setMasterVolume: (v) => {
    set({ masterVolume: v });
    window.dispatchEvent(new CustomEvent('velocity:settings:changed', { detail: { masterVolume: v } }));
  },
  setMusicVolume: (v) => set({ musicVolume: v }),
  setUIVolume: (v) => set({ uiVolume: v }),
  setVehicleVolume: (v) => set({ vehicleVolume: v }),
  setEnvironmentVolume: (v) => set({ environmentVolume: v }),

  setColorBlindMode: (v) => set({ colorBlindMode: v }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setBrightness: (v) => set({ brightness: v }),
  setFieldOfView: (v) => set({ fieldOfView: v }),

  showDeveloperOverlay: false,
  showAssetInspector: false,
  toggleDeveloperOverlay: () => set((s) => ({ showDeveloperOverlay: !s.showDeveloperOverlay })),
  toggleAssetInspector: () => set((s) => ({ showAssetInspector: !s.showAssetInspector })),
}));
