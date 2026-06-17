import { create } from 'zustand';

export const useWidgetStore = create((set, get) => ({
  isWidgetPanelOpen: false,
  
  // Future-proof: list of active widgets to allow customization later
  activeWidgets: ['github', 'placement', 'quote'],

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
}));
