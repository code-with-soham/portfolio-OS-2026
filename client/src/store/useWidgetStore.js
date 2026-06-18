import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWidgetStore = create(
  persist(
    (set, get) => ({
      isWidgetPanelOpen: false,
      
      // Future-proof: list of active widgets to allow customization later
      activeWidgets: ['github', 'placement', 'quote'],
      
      // Widget positions for free dragging: { [id]: { x, y } }
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

      updateWidgetPosition: (id, x, y) => {
        set((state) => ({
          widgetPositions: {
            ...state.widgetPositions,
            [id]: { x, y },
          },
        }));
      },
    }),
    {
      name: 'portfolio-os-widgets',
      partialize: (state) => ({
        activeWidgets: state.activeWidgets,
        widgetPositions: state.widgetPositions,
      }),
    }
  )
);
