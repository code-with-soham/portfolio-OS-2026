import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSoundStore = create(
  persist(
    (set, get) => ({
      soundEnabled: true,
      soundTheme: 'windows11', // 'windows11', 'macos', 'cyberpunk', 'silent'
      volume: 80,

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSoundTheme: (theme) => set({ soundTheme: theme }),
      setVolume: (vol) => set({ volume: vol }),

      playSound: (eventName) => {
        const { soundEnabled, soundTheme, volume } = get();
        if (!soundEnabled || soundTheme === 'silent') return;

        // In a real app, you'd map these to actual audio files.
        // For Portfolio OS, we'll simulate it or use browser beeps
        // Or if you have actual mp3 files in public/assets/sounds, load them:
        // const audio = new Audio(`/assets/sounds/${soundTheme}/${eventName}.mp3`);
        // audio.volume = volume / 100;
        // audio.play().catch(e => console.log('Audio play prevented', e));
      }
    }),
    {
      name: 'portfolio-os-sound',
    }
  )
);
