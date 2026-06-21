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
import { useMusicStore } from '../store/useMusicStore';
import { usePresentationController } from './usePresentationController';

/**
 * Register global keyboard shortcuts.
 * Call once in App.jsx or Desktop.jsx.
 *
 * Supported shortcuts:
 *   Esc — Close the active window (only if no inputs are focused)
 */
export function useKeyboardShortcuts() {
  const { runF9Sequence, runF10Sequence, killSequence } = usePresentationController();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input field (to prevent intercepting spacebar, etc.)
      const activeTagName = document.activeElement?.tagName;
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTagName) || document.activeElement?.isContentEditable;
      const isCapturing = useUIStore.getState().isCapturingInput() || isInputFocused;

      // Windows key (Meta) — toggle start menu
      if (e.key === 'Meta' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        // Only toggle if just Meta is pressed
        const { toggleStartMenu } = useDesktopStore.getState();
        toggleStartMenu();
        setTimeout(() => document.getElementById('start-menu-search')?.focus(), 100);
        return;
      }

      // Win + S to open Global Search (VS-33)
      if ((e.metaKey || e.key === 'Meta') && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const { toggleGlobalSearch, isStartMenuOpen, closeStartMenu } = useDesktopStore.getState();
        if (isStartMenuOpen) closeStartMenu();
        toggleGlobalSearch();
        return;
      }

      // Ctrl + Shift + P to open Command Palette (VS-33)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        const { toggleCommandPalette } = useDesktopStore.getState();
        toggleCommandPalette();
        return;
      }

      // Alt + Space for Universal Spotlight / Copilot (VS-33.25)
      if (e.altKey && e.code === 'Space') {
        e.preventDefault();
        const { toggleUniversalSpotlight } = useDesktopStore.getState();
        toggleUniversalSpotlight();
        return;
      }

      // Ctrl + Shift + V to toggle Voice Assistant (VS-36)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        import('../ai/voice/voiceController').then(({ voiceController }) => {
          voiceController.toggleListening();
        });
        return;
      }

      // Win + Space to open AI Assistant
      if ((e.metaKey || e.key === 'Meta') && e.code === 'Space') {
        e.preventDefault();
        const { toggleAIAssistant } = useDesktopStore.getState();
        toggleAIAssistant();
        return;
      }

      // Win + L to lock screen
      if ((e.metaKey || e.key === 'Meta') && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        import('../constants').then(({ OS_STATES }) => {
          useDesktopStore.getState().setOsState(OS_STATES.LOCKED);
        });
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
        return;
      }

      // F9 — Guided Presentation Mode
      if (e.key === 'F9') {
        e.preventDefault();
        runF9Sequence();
        return;
      }

      // F10 — Auto Demo Mode
      if (e.key === 'F10') {
        e.preventDefault();
        runF10Sequence();
        return;
      }

      // F11 — Emergency Exit for Presentations
      if (e.key === 'F11') {
        // We only prevent default if we are stopping a presentation, otherwise let browser fullscreen work
        // but the user wants F11 to stop it immediately
        e.preventDefault();
        killSequence();
        return;
      }

      // Media Controls
      if (!isCapturing) {
        if (e.code === 'Space') {
          // Only trigger if we aren't in an input field (isCapturing handles this)
          // Also check if active element is not a button to avoid double triggers
          if (document.activeElement?.tagName !== 'BUTTON') {
            e.preventDefault();
            useMusicStore.getState().togglePlayPause();
          }
        }
        if (e.ctrlKey && e.code === 'ArrowRight') {
          e.preventDefault();
          useMusicStore.getState().nextSong();
        }
        if (e.ctrlKey && e.code === 'ArrowLeft') {
          e.preventDefault();
          useMusicStore.getState().prevSong();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [runF9Sequence, runF10Sequence, killSequence]);
}
