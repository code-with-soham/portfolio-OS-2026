import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLearningStore = create(
  persist(
    (set) => ({
      progress: {
        docker: 50,
        dsa: 72,
        aptitude: 65,
        verbal: 80,
        projects: 90
      },
      updateProgress: (subject, value) => set((state) => ({
        progress: {
          ...state.progress,
          [subject]: Math.min(100, Math.max(0, value))
        }
      }))
    }),
    {
      name: 'portfolio-os-learning-storage'
    }
  )
);
