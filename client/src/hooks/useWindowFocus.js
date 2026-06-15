// ============================================
// Portfolio OS 2026 — useWindowFocus Hook
// ============================================
// Returns whether a given window is the currently active (focused) window.
// Useful for apps that need to pause/resume behavior based on focus.

import { useWindowStore } from '../store/useWindowStore';

/**
 * Check if a specific window is currently focused.
 *
 * @param {string} windowId - The unique window instance ID
 * @returns {boolean} Whether the window is active
 *
 * Usage:
 *   const isFocused = useWindowFocus(windowId);
 */
export function useWindowFocus(windowId) {
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  return activeWindowId === windowId;
}
