import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMongoStore = create(
  persist(
    (set, get) => ({
      isConnected: true,
      databases: ['sample_mflix'],
      currentDatabase: 'sample_mflix',
      currentCollection: null,
      searchQuery: '',
      
      // Pagination & Sorting State
      page: 1,
      limit: 25,
      sort: '_id',
      order: 'asc',

      // Phase 4 State
      viewMode: 'grid', // 'grid' | 'table' | 'json'
      activeTab: 'documents', // 'documents' | 'aggregation' | 'schema' | 'indexes'
      queryHistory: [],
      favorites: {
        collections: [],
        queries: [],
      },
      
      setCurrentCollection: (collectionName) => set({
        currentCollection: collectionName,
        searchQuery: '', // Reset search on collection change
        page: 1, // Reset to first page
        activeTab: 'documents', // Reset to default tab
      }),

      setSearchQuery: (query) => set((state) => {
        // Simple distinct logic to add to history if it's a substantive search
        const newHistory = query && query.length > 2 && !state.queryHistory.includes(query) 
          ? [query, ...state.queryHistory].slice(0, 10) 
          : state.queryHistory;
          
        return { searchQuery: query, page: 1, queryHistory: newHistory };
      }),
      setPage: (page) => set({ page }),
      setLimit: (limit) => set({ limit, page: 1 }),
      setSort: (sort, order) => set({ sort, order, page: 1 }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveTab: (tab) => set({ activeTab: tab }),

    }),
    {
      name: 'mongo-explorer-storage',
      partialize: (state) => ({ 
        currentCollection: state.currentCollection,
        searchQuery: state.searchQuery,
        limit: state.limit,
        sort: state.sort,
        order: state.order,
        viewMode: state.viewMode,
        queryHistory: state.queryHistory,
        favorites: state.favorites
      }),
    }
  )
);
