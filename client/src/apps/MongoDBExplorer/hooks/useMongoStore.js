import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockCollections } from '../constants/mockData';

export const useMongoStore = create(
  persist(
    (set, get) => ({
      isConnected: true,
      databases: ['sample_mflix'],
      currentDatabase: 'sample_mflix',
      collections: Object.keys(mockCollections),
      currentCollection: null, // Default to null for Welcome Screen
      documents: [],
      searchQuery: '',
      
      setCurrentCollection: (collectionName) => set({
        currentCollection: collectionName,
        documents: mockCollections[collectionName] || [],
        searchQuery: '', // Reset search on collection change
      }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      refreshData: () => {
        // Simulate refresh by resetting documents to mock data
        const currentColl = get().currentCollection;
        if (currentColl) {
          set({ documents: mockCollections[currentColl] || [] });
        }
      },
    }),
    {
      name: 'mongo-explorer-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        currentCollection: state.currentCollection,
        searchQuery: state.searchQuery,
      }), // Persist only these fields
      onRehydrateStorage: () => (state) => {
        // After hydration, ensure documents are loaded for the persisted collection
        if (state && state.currentCollection) {
          state.setCurrentCollection(state.currentCollection);
        }
      },
    }
  )
);
