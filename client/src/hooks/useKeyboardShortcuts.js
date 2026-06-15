// ============================================
// Portfolio OS 2026 — useKeyboardShortcuts Hook
// ============================================
// Centralized global keyboard shortcut handler.
// Attaches a single keydown listener to document.
// Checks useUIStore to prevent shortcuts when inputs are focused.

import { useEffect } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { useDesktopStore } from '../store/useDesktopStore';
import { useUIStore } from '../store/useUIStore';

/**
 * Register global keyboard shortcuts.
 * Call once in App.jsx or Desktop.jsx.
 *
 * Supported shortcuts:
 *   Esc — Close the active window (only if no inputs are focused)
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCapturing = useUIStore.getState().isCapturingInput();

      // Windows key (Meta) — toggle start menu
      if (e.key === 'Meta') {
        const { toggleStartMenu } = useDesktopStore.getState();
        toggleStartMenu();
        return;
      }

      // Esc — close active window
      if (e.key === 'Escape') {
        // If start menu is open, close it first
        const { isStartMenuOpen, closeStartMenu, isNotificationCenterOpen, closeNotificationCenter } =
          useDesktopStore.getState();

        if (isStartMenuOpen) {
          closeStartMenu();
          return;
        }

        if (isNotificationCenterOpen) {
          closeNotificationCenter();
          return;
        }

        // Don't close windows if an input/modal is capturing input
        if (isCapturing) return;

        // Close the active window
        const { activeWindowId, closeWindow } = useWindowStore.getState();
        if (activeWindowId) {
          closeWindow(activeWindowId);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
