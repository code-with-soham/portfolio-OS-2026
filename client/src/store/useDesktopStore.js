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
  // Context Menu
  // ========================

  /** Context Menu state */
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    items: [],
  },

  /** Open context menu at coordinates with items */
  openContextMenu: (x, y, items) => {
    set({
      contextMenu: { isOpen: true, x, y, items },
      isStartMenuOpen: false,
      isNotificationCenterOpen: false,
    });
  },

  /** Close context menu */
  closeContextMenu: () => {
    set((state) => ({
      contextMenu: { ...state.contextMenu, isOpen: false },
    }));
  },

  // ========================
  // Desktop Icons
  // ========================

  /** Icon positions keyed by app ID: { [id]: { x, y } } */
  iconPositions: {},

  /** Update icon position */
  updateIconPosition: (id, x, y) => {
    set((state) => ({
      iconPositions: {
        ...state.iconPositions,
        [id]: { x, y },
      },
    }));
  },

  /** Selected desktop icon ID */
  selectedIconId: null,

  /** Set selected desktop icon */
  setSelectedIconId: (id) => set({ selectedIconId: id }),

  // ========================
  // Utility
  // ========================

  /** Close all open panels (start menu + notification center) */
  closeAllPanels: () =>
    set((state) => ({
      isStartMenuOpen: false,
      isNotificationCenterOpen: false,
      contextMenu: { ...state.contextMenu, isOpen: false },
      selectedIconId: null, // Deselect icons when clicking background
    })),
    
  // ========================
  // System Telemetry
  // ========================
  bootTime: Date.now(),
}));
