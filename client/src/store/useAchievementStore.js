// ============================================
// Portfolio OS 2026 — Achievement Store (Event Driven)
// ============================================
// Tracks OS events and unlocks achievements based on conditions.
// Uses useNotificationStore to display toasts upon unlocking.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationStore } from './useNotificationStore';

export const ACHIEVEMENTS = {
  power_user: {
    id: 'power_user',
    title: 'Power User',
    description: 'Opened Terminal',
    icon: '🏆',
  },
  explorer: {
    id: 'explorer',
    title: 'Explorer',
    description: 'Opened File Explorer',
    icon: '🏆',
  },
  recruiter_mode: {
    id: 'recruiter_mode',
    title: 'Recruiter Mode',
    description: 'Viewed Resume',
    icon: '🏆',
  },
  customizer: {
    id: 'customizer',
    title: 'Customizer',
    description: 'Changed Theme',
    icon: '🏆',
  },
  deep_diver: {
    id: 'deep_diver',
    title: 'Deep Diver',
    description: 'Viewed Projects',
    icon: '🏆',
  },
  full_tour: {
    id: 'full_tour',
    title: 'Full Tour',
    description: 'Opened Every App',
    icon: '🏆',
  },
  terminal_wizard: {
    id: 'terminal_wizard',
    title: 'Terminal Wizard',
    description: 'Execute 25 terminal commands',
    icon: '🏆',
  },
  curious_mind: {
    id: 'curious_mind',
    title: 'Curious Mind',
    description: 'Open About OS',
    icon: '🏆',
  },
  hidden_gem: {
    id: 'hidden_gem',
    title: 'Hidden Gem',
    description: 'Found the recruiter easter egg',
    icon: '💎',
  },
};

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      // State structure: { [achievementId]: { unlocked: boolean, timestamp: number } }
      unlocked: {},

      // Event counters: { 'opened-terminal': 1, 'terminal-command': 25 }
      events: {},

      // Tracks unique apps opened to trigger 'Full Tour'
      appsOpened: [],

      /**
       * Primary Engine: Tracks an event and evaluates achievement conditions
       */
      trackEvent: (eventName) => {
        const { events, unlockAchievement } = get();
        
        const count = (events[eventName] || 0) + 1;
        
        // Update event counter
        set((state) => ({
          events: {
            ...state.events,
            [eventName]: count,
          },
        }));

        // Condition Engine
        if (eventName === 'opened-terminal') unlockAchievement('power_user');
        if (eventName === 'opened-fileexplorer') unlockAchievement('explorer');
        if (eventName === 'opened-resume') unlockAchievement('recruiter_mode');
        if (eventName === 'opened-projects') unlockAchievement('deep_diver');
        if (eventName === 'opened-aboutos') unlockAchievement('curious_mind');
        if (eventName === 'changed-theme') unlockAchievement('customizer');
        if (eventName === 'sudo-hire-soham') unlockAchievement('hidden_gem');
        
        if (eventName === 'terminal-command' && count >= 25) {
          unlockAchievement('terminal_wizard');
        }
      },

      /**
       * Internal helper to unlock an achievement
       */
      unlockAchievement: (id) => {
        const { unlocked } = get();
        
        // Already unlocked or invalid achievement
        if (unlocked[id] || !ACHIEVEMENTS[id]) return;

        // Update state
        set((state) => ({
          unlocked: {
            ...state.unlocked,
            [id]: {
              unlocked: true,
              timestamp: Date.now(),
            },
          },
        }));

        // Fire notification
        const ach = ACHIEVEMENTS[id];
        useNotificationStore.getState().addNotification(
          'Achievement Unlocked',
          `${ach.title}: ${ach.description}`,
          ach.icon,
          5000 // 5 seconds
        );
      },

      /**
       * Tracks an opened app to check for Full Tour achievement
       */
      trackAppOpened: (appId, totalApps) => {
        const { appsOpened, unlocked, unlockAchievement } = get();
        
        // Only track if Full Tour isn't unlocked yet and it's a new app
        if (!unlocked['full_tour'] && !appsOpened.includes(appId)) {
          const newAppsOpened = [...appsOpened, appId];
          set({ appsOpened: newAppsOpened });

          // If we reached the total count, unlock Full Tour!
          if (newAppsOpened.length >= totalApps) {
            unlockAchievement('full_tour');
          }
        }
      },
      
      /**
       * Clear all achievements (for debugging/testing)
       */
      resetAchievements: () => {
        set({ unlocked: {}, events: {}, appsOpened: [] });
      }
    }),
    {
      name: 'portfolio-os-achievements',
    }
  )
);
