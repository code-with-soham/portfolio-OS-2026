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
      },

      /**
       * Set a specific theme
       * @param {'dark' | 'light'} theme
       */
      setTheme: (theme) => {
        if (Object.values(THEMES).includes(theme)) {
          set({ theme });
        }
      },

      // Current wallpaper — CSS class name referencing a gradient defined in index.css
      // 'default' maps to the Windows 11 Bloom-inspired gradient
      wallpaper: 'default',

      /**
       * Set a custom wallpaper
       * @param {string} wallpaperId - The wallpaper identifier
       */
      setWallpaper: (wallpaperId) => {
        set({ wallpaper: wallpaperId });
      },
    }),
    {
      // Persist config — saves to localStorage
      name: 'portfolio-os-theme',
    }
  )
);
