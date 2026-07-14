// ============================================
// Car Experience — World Store
// ============================================
import { create } from 'zustand';

export const useWorldStore = create((set) => ({
  timeOfDay: 'day', // 'dawn', 'day', 'sunset', 'night'
  weather: 'clear', // 'clear', 'cloudy', 'fog', 'rain'
  activeRegion: 'coast', // 'coast', 'mountain', 'forest', 'town'
  
  // Track unlocked viewpoints/landmarks for the Exploration Director
  discoveredLandmarks: new Set(),

  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setWeather: (weather) => set({ weather }),
  setActiveRegion: (region) => set({ activeRegion: region }),
  
  discoverLandmark: (id) => set((state) => {
    if (state.discoveredLandmarks.has(id)) return state;
    const nextSet = new Set(state.discoveredLandmarks);
    nextSet.add(id);
    
    // OS Event
    window.dispatchEvent(new CustomEvent('portfolio:achievement:unlocked', {
      detail: {
        app: 'velocity_racing',
        title: 'Landmark Discovered',
        landmarkId: id
      }
    }));
    
    return { discoveredLandmarks: nextSet };
  }),
}));
