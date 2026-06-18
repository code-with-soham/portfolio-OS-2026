import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * AI Analytics Store — Tracks usage of the Portfolio AI Expert Brain.
 */
export const useAIAnalyticsStore = create(
  persist(
    (set, get) => ({
      totalQueries: 0,
      intentsTriggered: {},
      mostAskedIntent: 'None',
      averageResponseTimeMs: 0,
      totalResponseTimeMs: 0,
      recentQueries: [],

      // Track a new query event
      trackQuery: (intent, text, responseTime) => {
        set((state) => {
          const newTotal = state.totalQueries + 1;
          const newTotalTime = state.totalResponseTimeMs + responseTime;
          const newAvgTime = Math.round(newTotalTime / newTotal);
          
          const newIntents = { ...state.intentsTriggered };
          newIntents[intent] = (newIntents[intent] || 0) + 1;

          // Calculate most asked intent
          let mostAsked = state.mostAskedIntent;
          let maxCount = 0;
          for (const [key, val] of Object.entries(newIntents)) {
            if (val > maxCount) {
              maxCount = val;
              mostAsked = key;
            }
          }

          // Update recent queries
          const newRecents = [{ text, intent, time: Date.now() }, ...state.recentQueries].slice(0, 50);

          return {
            totalQueries: newTotal,
            totalResponseTimeMs: newTotalTime,
            averageResponseTimeMs: newAvgTime,
            intentsTriggered: newIntents,
            mostAskedIntent: mostAsked,
            recentQueries: newRecents
          };
        });
      },

      clearAnalytics: () => set({
        totalQueries: 0,
        intentsTriggered: {},
        mostAskedIntent: 'None',
        averageResponseTimeMs: 0,
        totalResponseTimeMs: 0,
        recentQueries: []
      })
    }),
    {
      name: 'portfolio-ai-analytics-v1', // persist to local storage
    }
  )
);
