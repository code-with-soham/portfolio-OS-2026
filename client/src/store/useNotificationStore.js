// ============================================
// Portfolio OS 2026 — Notification Store
// ============================================
// Manages system notifications (toasts and history).
// Toasts are displayed temporarily, while history remains
// visible in the Notification Center until cleared.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () => `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // Transient toasts displayed on screen
      toasts: [],
      // Historical notifications for the Notification Center
      history: [],

      /**
       * Add a new notification
       * @param {string} title
       * @param {string} message
       * @param {string} category - 'achievement', 'system', 'download', 'settings', 'ai'
       * @param {number} duration ms (default 4000)
       * @param {string} actionLabel
       * @param {Function} action
       */
      addNotification: (title, message, category = 'system', duration = 4000, actionLabel = null, action = null) => {
        const id = generateId();
        const newNotif = { 
          id, 
          title, 
          message, 
          category, 
          timestamp: Date.now(),
          read: false,
          actionLabel,
          action
        };

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
       * Remove a notification from history
       */
      removeHistoryItem: (id) => {
        set((state) => ({
          history: state.history.filter((t) => t.id !== id),
        }));
      },

      /**
       * Mark a specific notification as read
       */
      markAsRead: (id) => {
        set((state) => ({
          history: state.history.map((t) => (t.id === id ? { ...t, read: true } : t)),
        }));
      },

      /**
       * Mark all notifications as read
       */
      markAllAsRead: () => {
        set((state) => ({
          history: state.history.map((t) => ({ ...t, read: true })),
        }));
      },

      /**
       * Clear all notifications from history
       */
      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'portfolio-os-notifications', // unique name for localStorage
      // We only want to persist the history. Toasts are transient.
      partialize: (state) => ({ history: state.history }),
    }
  )
);
