import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { githubService } from '../services/githubService';

const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export const useGitHubStore = create(
  persist(
    (set, get) => ({
      data: null,
      lastFetched: null,
      isLoading: false,
      error: null,

      fetchData: async (force = false) => {
        const { lastFetched, data, isLoading } = get();
        
        if (isLoading) return;

        // Use cache if not forced and within cache time
        if (!force && data && lastFetched) {
          const now = Date.now();
          if (now - lastFetched < CACHE_TIME) {
            return; // Cache is still valid
          }
        }

        set({ isLoading: true, error: null });

        try {
          const profileData = await githubService.fetchProfile();
          if (profileData) {
            set({
              data: profileData,
              lastFetched: Date.now(),
              isLoading: false
            });
          } else {
            throw new Error("Failed to load GitHub data");
          }
        } catch (error) {
          set({ isLoading: false, error: error.message });
        }
      }
    }),
    {
      name: 'portfolio-os-github-cache',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
