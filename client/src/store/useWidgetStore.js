import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWidgetStore = create(
  persist(
    (set, get) => ({
      isWidgetPanelOpen: false,
      
      // List of active widgets 
      activeWidgets: ['ai_suggestions', 'recruiter_ready', 'learning_progress', 'daily_focus', 'quick_actions', 'weather_pro', 'github_pro', 'music', 'smart_clock', 'system_monitor'],
      
      // Widget configurations: { [id]: { x, y, pinned, transparency, refreshInterval } }
      widgetPositions: {},

      toggleWidgetPanel: () => {
        set((state) => ({ isWidgetPanelOpen: !state.isWidgetPanelOpen }));
      },

      closeWidgetPanel: () => {
        set({ isWidgetPanelOpen: false });
      },

      setWidgetVisibility: (id, visible) => {
        set((state) => {
          const { activeWidgets } = state;
          if (visible && !activeWidgets.includes(id)) {
            return { activeWidgets: [...activeWidgets, id] };
          } else if (!visible && activeWidgets.includes(id)) {
            return { activeWidgets: activeWidgets.filter((w) => w !== id) };
          }
          return state;
        });
      },

      updateWidgetConfig: (id, configUpdate) => {
        set((state) => {
          const currentConfig = state.widgetPositions[id] || {};
          return {
            widgetPositions: {
              ...state.widgetPositions,
              [id]: { ...currentConfig, ...configUpdate },
            },
          };
        });
      },

      updateWidgetPosition: (id, x, y) => {
        get().updateWidgetConfig(id, { x, y });
      },
    }),
    {
      name: 'portfolio-os-widgets-v2', // bump version to reset state for v2
      partialize: (state) => ({
        activeWidgets: state.activeWidgets,
        widgetPositions: state.widgetPositions,
      }),
    }
  )
);
