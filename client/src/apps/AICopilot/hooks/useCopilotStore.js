import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCopilotStore = create(
  persist(
    (set) => ({
      conversation: [],
      activePlan: null,
      isAwaitingApproval: false,
      
      addMessage: (message) => set((state) => ({
        conversation: [...state.conversation, message]
      })),
      
      setActivePlan: (plan) => set({ 
        activePlan: plan, 
        isAwaitingApproval: true 
      }),
      
      clearActivePlan: () => set({ 
        activePlan: null, 
        isAwaitingApproval: false 
      }),
      
      approvePlan: () => set({ 
        isAwaitingApproval: false 
      }),
      
      clearHistory: () => set({ conversation: [] })
    }),
    {
      name: 'portfolio-os-copilot-storage',
      partialize: (state) => ({ conversation: state.conversation }), // Only persist chat history
    }
  )
);
