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
      
      // Detailed Analytics
      openedApps: {},
      viewedProjects: {},
      askedSkills: {},

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

      trackAppOpen: (appName) => {
        set((state) => ({
          openedApps: {
            ...state.openedApps,
            [appName]: (state.openedApps[appName] || 0) + 1
          }
        }));
      },

      trackProjectView: (projectName) => {
        if (!projectName) return;
        set((state) => ({
          viewedProjects: {
            ...state.viewedProjects,
            [projectName]: (state.viewedProjects[projectName] || 0) + 1
          }
        }));
      },

      trackSkillQuery: (skillName) => {
        if (!skillName) return;
        set((state) => ({
          askedSkills: {
            ...state.askedSkills,
            [skillName]: (state.askedSkills[skillName] || 0) + 1
          }
        }));
      },

      clearAnalytics: () => set({
        totalQueries: 0,
        intentsTriggered: {},
        mostAskedIntent: 'None',
        averageResponseTimeMs: 0,
        totalResponseTimeMs: 0,
        recentQueries: [],
        openedApps: {},
        viewedProjects: {},
        askedSkills: {}
      })
    }),
    {
      name: 'portfolio-ai-analytics-v2', // persist to local storage
    }
  )
);
