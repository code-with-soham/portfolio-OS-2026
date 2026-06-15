// ============================================
// Portfolio OS 2026 — UI State Store
// ============================================
// Tracks transient UI state that affects global keyboard shortcuts.
// Used by useKeyboardShortcuts to decide whether Esc should close
// the active window or be swallowed by an input/modal.
//
// NOT persisted — resets on page reload (intentional).

import { create } from 'zustand';

/**
 * UI Store — manages global UI interaction state
 *
 * Usage:
 *   const { inputFocused, setInputFocused } = useUIStore();
 */
export const useUIStore = create((set) => ({
  // Whether a text input or textarea is currently focused
  inputFocused: false,

  // Whether a modal dialog is open
  modalOpen: false,

  // Whether a dropdown menu is open
  dropdownOpen: false,

  // Whether the Start Menu search bar is focused
  startMenuSearchFocused: false,

  // Actions
  setInputFocused: (value) => set({ inputFocused: value }),
  setModalOpen: (value) => set({ modalOpen: value }),
  setDropdownOpen: (value) => set({ dropdownOpen: value }),
  setStartMenuSearchFocused: (value) => set({ startMenuSearchFocused: value }),

  /**
   * Check if any UI element is capturing keyboard input.
   * When true, global shortcuts like Esc should NOT close windows.
   */
  isCapturingInput: () => {
    const state = useUIStore.getState();
    return state.inputFocused || state.modalOpen || state.dropdownOpen || state.startMenuSearchFocused;
  },
}));
