// ============================================
// Portfolio OS 2026 — Theme Store
// ============================================
// Zustand store for managing the application theme.
// Persists the user's theme preference to localStorage.
//
// Zustand was chosen over Context API for:
// 1. No provider wrapper needed
// 2. Built-in persist middleware
// 3. Minimal boilerplate
// 4. Subscribable outside React components

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES } from '../constants';

/**
 * Theme store — manages dark/light mode and wallpaper
 *
 * Usage:
 *   const { theme, toggleTheme, wallpaper } = useThemeStore();
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme — defaults to dark (Windows 11 dark mode)
      theme: THEMES.DARK,

      /**
       * Toggle between dark and light themes
       */
      toggleTheme: () => {
        const newTheme = get().theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        set({ theme: newTheme });
        
        // Unlock customizer achievement
        import('./useAchievementStore').then(({ useAchievementStore }) => {
          useAchievementStore.getState().trackEvent('changed-theme');
        });
      },

      /**
       * Set a specific theme
       * @param {'dark' | 'light'} theme
       */
      setTheme: (theme) => {
        if (Object.values(THEMES).includes(theme)) {
          set({ theme });
          
          // Unlock customizer achievement
          import('./useAchievementStore').then(({ useAchievementStore }) => {
            useAchievementStore.getState().trackEvent('changed-theme');
          });
        }
      },

      // Current wallpaper — CSS class name referencing a gradient defined in index.css
      // 'default' maps to the Windows 11 Bloom-inspired gradient
      wallpaper: 'default',
      animatedWallpaper: null, // 'matrix' | 'particles' | 'bubbles' | null
      customWallpapers: [], // Array of { id, dataUrl }
      wallpaperSlideshow: false,
      slideshowInterval: 60, // minutes (e.g. 1, 5, 30)
      accentColor: '#0078d4',
      brightness: 100,

      /**
       * Set a custom wallpaper
       * @param {string} wallpaperId - The wallpaper identifier
       */
      setWallpaper: (wallpaperId) => {
        set({ wallpaper: wallpaperId });
      },

      addCustomWallpaper: (id, dataUrl) => {
        set((state) => ({
          customWallpapers: [...state.customWallpapers, { id, dataUrl }],
        }));
      },

      setWallpaperSlideshow: (enabled) => set({ wallpaperSlideshow: enabled }),
      setSlideshowInterval: (mins) => set({ slideshowInterval: mins }),
      setAccentColor: (color) => set({ accentColor: color }),
      setAnimatedWallpaper: (type) => set({ animatedWallpaper: type }),
      setBrightness: (val) => set({ brightness: val }),
    }),
    {
      // Persist config — saves to localStorage
      name: 'portfolio-os-theme',
      partialize: (state) => ({
        theme: state.theme,
        wallpaper: state.wallpaper,
        animatedWallpaper: state.animatedWallpaper,
        customWallpapers: state.customWallpapers,
        wallpaperSlideshow: state.wallpaperSlideshow,
        slideshowInterval: state.slideshowInterval,
        accentColor: state.accentColor,
        brightness: state.brightness,
      }),
    }
  )
);
