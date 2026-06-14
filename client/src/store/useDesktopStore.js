// ============================================
// Portfolio OS 2026 — Desktop Store
// ============================================
// Zustand store managing the OS shell state machine.
//
// Lifecycle: booting → locked → desktop
//
// Also manages UI panel states (start menu, notification center).
// No persistence — the OS always boots fresh on page reload.

import { create } from 'zustand';
import { OS_STATES } from '../constants';

/**
 * Desktop store — manages OS lifecycle and shell UI state
 *
 * Usage:
 *   const { osState, setOsState } = useDesktopStore();
 *   const { isStartMenuOpen, toggleStartMenu } = useDesktopStore();
 */
export const useDesktopStore = create((set, get) => ({
  // ========================
  // OS Lifecycle State
  // ========================

  /** Current OS state: 'booting' | 'locked' | 'desktop' */
  osState: OS_STATES.BOOTING,

  /**
   * Transition to the next OS state.
   * @param {'booting' | 'locked' | 'desktop'} state
   */
  setOsState: (state) => {
    if (Object.values(OS_STATES).includes(state)) {
      set({ osState: state });
    }
  },

  // ========================
  // Start Menu
  // ========================

  /** Whether the Start Menu is currently open */
  isStartMenuOpen: false,

  /** Toggle the Start Menu open/closed */
  toggleStartMenu: () => {
    const isOpen = get().isStartMenuOpen;
    set({
      isStartMenuOpen: !isOpen,
      // Close notification center when opening start menu
      isNotificationCenterOpen: false,
    });
  },

  /** Close the Start Menu */
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  // ========================
  // Notification Center
  // ========================

  /** Whether the Notification Center is currently open */
  isNotificationCenterOpen: false,

  /** Toggle the Notification Center open/closed */
  toggleNotificationCenter: () => {
    const isOpen = get().isNotificationCenterOpen;
    set({
      isNotificationCenterOpen: !isOpen,
      // Close start menu when opening notification center
      isStartMenuOpen: false,
    });
  },

  /** Close the Notification Center */
  closeNotificationCenter: () => set({ isNotificationCenterOpen: false }),

  // ========================
  // Utility
  // ========================

  /** Close all open panels (start menu + notification center) */
  closeAllPanels: () =>
    set({
      isStartMenuOpen: false,
      isNotificationCenterOpen: false,
    }),
}));
