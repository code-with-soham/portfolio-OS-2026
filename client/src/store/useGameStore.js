import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationStore } from './useNotificationStore';

export const useGameStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      recentlyPlayed: [],
      playTime: {}, // { gameId: seconds }
      achievements: [],
      stats: {
        gamesPlayed: 0,
        totalPlayTime: 0,
        longestSession: 0,
        xp: 0,
        level: 1,
      },

      toggleFavorite: (gameId) => {
        set((state) => {
          const isFav = state.favorites.includes(gameId);
          return {
            favorites: isFav 
              ? state.favorites.filter((id) => id !== gameId)
              : [...state.favorites, gameId]
          };
        });
      },

      recordGamePlayed: (gameId) => {
        set((state) => {
          const newRecentlyPlayed = [
            gameId,
            ...state.recentlyPlayed.filter((id) => id !== gameId)
          ].slice(0, 10); // keep last 10
          
          return {
            recentlyPlayed: newRecentlyPlayed,
            stats: {
              ...state.stats,
              gamesPlayed: state.stats.gamesPlayed + 1,
            }
          };
        });
      },

      recordPlayTime: (gameId, timeInSeconds) => set((state) => {
        const total = state.stats.totalPlayTime + timeInSeconds;
        
        // Award XP: 10 XP per minute played
        const minutesPlayed = Math.floor(timeInSeconds / 60);
        const xpEarned = minutesPlayed * 10;
        
        let newXp = state.stats.xp + xpEarned;
        let newLevel = state.stats.level;
        let leveledUp = false;

        const nextLevelXP = state.stats.level * 100;
        if (newXp >= nextLevelXP) {
          newLevel += 1;
          newXp -= nextLevelXP;
          leveledUp = true;
        }

        if (leveledUp) {
          // Push notification outside the setter using the external store
          setTimeout(() => {
            useNotificationStore.getState().addNotification(
              'Level Up! 🎉',
              `You reached Gamer Level ${newLevel}!`,
              'achievement'
            );
          }, 0);
        }

        return {
          stats: {
            ...state.stats,
            totalPlayTime: total,
            xp: newXp,
            level: newLevel
          }
        };
      }),

      addXP: (amount) => {
        set((state) => {
          const newXP = state.stats.xp + amount;
          // Calculate level (every 100 XP is a level)
          const newLevel = Math.floor(newXP / 100) + 1;
          
          return {
            stats: {
              ...state.stats,
              xp: newXP,
              level: newLevel
            }
          };
        });
      },

      unlockAchievement: (achievementId) => {
        set((state) => {
          if (state.achievements.includes(achievementId)) return state;
          
          return {
            achievements: [...state.achievements, achievementId]
          };
        });
      }
    }),
    {
      name: 'portfolio-os-game-center-storage',
    }
  )
);
