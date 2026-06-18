import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORE_KEYS } from '../utils/backupUtils';

// Helper to get raw store keys
const RAW_STORE_KEYS = [
  'portfolio-os-theme',
  'portfolio-os-desktop-storage',
  'portfolio-os-widget-storage',
  'portfolio-os-sound-storage',
  'portfolio-os-fs'
];

export const useProfileStore = create(
  persist(
    (set, get) => ({
      activeProfileId: 'default',
      profiles: [
        { id: 'default', name: 'Soham', avatar: null }
      ],
      profileData: {}, // { [profileId]: { 'portfolio-os-theme': {...}, ... } }

      addProfile: (name, avatar) => set((state) => ({
        profiles: [...state.profiles, { id: `profile_${Date.now()}`, name, avatar }]
      })),

      switchProfile: (profileId) => {
        const state = get();
        if (state.activeProfileId === profileId) return;
        
        const currentProfileId = state.activeProfileId;
        
        // 1. Save current state to profileData
        const currentData = {};
        RAW_STORE_KEYS.forEach(key => {
          const data = localStorage.getItem(key);
          if (data) currentData[key] = JSON.parse(data);
        });

        // 2. Load new profile data or initialize empty
        const newData = state.profileData[profileId] || {};

        set((state) => ({
          activeProfileId: profileId,
          profileData: {
            ...state.profileData,
            [currentProfileId]: currentData
          }
        }));

        // 3. Write new data to localStorage
        RAW_STORE_KEYS.forEach(key => {
          if (newData[key]) {
            localStorage.setItem(key, JSON.stringify(newData[key]));
          } else {
            // If it's a new profile, we remove existing config so it starts fresh
            localStorage.removeItem(key);
          }
        });

        // 4. Hard reload to mount stores with new localStorage data
        window.location.reload();
      }
    }),
    {
      name: 'portfolio-os-profiles'
    }
  )
);
