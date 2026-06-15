// ============================================
// Portfolio OS 2026 — Notification Store
// ============================================
// Manages system notifications (toasts and history).
// Toasts are displayed temporarily, while history remains
// visible in the Notification Center until cleared.

import { create } from 'zustand';

const generateId = () => `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const useNotificationStore = create((set, get) => ({
  // Transient toasts displayed on screen
  toasts: [],
  // Historical notifications for the Notification Center
  history: [],

  /**
   * Add a new notification
   * @param {string} title
   * @param {string} message
   * @param {string} icon (emoji)
   * @param {number} duration ms (default 4000)
   */
  addNotification: (title, message, icon = '🔔', duration = 4000) => {
    const id = generateId();
    const newNotif = { id, title, message, icon, timestamp: Date.now() };

    set((state) => ({
      toasts: [...state.toasts, newNotif],
      history: [newNotif, ...state.history], // Newest first
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  /**
   * Remove a toast from the screen (keep in history)
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  /**
   * Clear all notifications from history
   */
  clearHistory: () => {
    set({ history: [] });
  },
}));
