// ============================================
// Car Experience — Camera Store
// ============================================
import { create } from 'zustand';
import { CAMERA_MODES } from '../Core/constants';

export const useCameraStore = create((set) => ({
  mode: CAMERA_MODES.ORBIT,
  activeShot: 'HERO',
  fov: 50,
  shake: 0,
  targetPosition: [0, 1, 0],
  orbitSpeed: 0.15,
  isAnimating: false,

  setMode: (mode) => set({ mode }),
  setShot: (shot) => set({ activeShot: shot }),
  setFov: (fov) => set({ fov }),
  setShake: (shake) => set({ shake }),
  setTargetPosition: (pos) => set({ targetPosition: pos }),
  setOrbitSpeed: (speed) => set({ orbitSpeed: speed }),
  setIsAnimating: (val) => set({ isAnimating: val }),
}));
