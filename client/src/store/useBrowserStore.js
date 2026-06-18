import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBrowserStore = create(
  persist(
    (set, get) => ({
      tabs: [{ id: '1', title: 'New Tab', url: 'chrome://newtab', icon: '🌎' }],
      activeTabId: '1',
      history: [],
      bookmarks: [
        { id: 'b1', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
        { id: 'b2', title: 'Portfolio', url: 'portfolio://about', icon: '🌐' },
        { id: 'b3', title: 'LinkedIn', url: 'https://linkedin.com', icon: '🔗' },
        { id: 'b4', title: 'CampusHub', url: 'portfolio://projects', icon: '🎓' },
        { id: 'b5', title: 'Interview Prep', url: 'portfolio://skills', icon: '💡' },
        { id: 'b6', title: 'LeetCode', url: 'https://leetcode.com', icon: '💻' },
      ],
      downloads: [
        { id: 'd1', name: 'Resume.pdf', url: 'portfolio://resume', size: '1.2 MB', date: new Date().toISOString() },
        { id: 'd2', name: 'Certificates.zip', url: 'portfolio://skills', size: '5.4 MB', date: new Date().toISOString() },
        { id: 'd3', name: 'Portfolio_Backup.zip', url: 'portfolio://projects', size: '15.2 MB', date: new Date().toISOString() },
      ],
      theme: 'chrome-light',

      // Tab Actions
      addTab: (url = 'chrome://newtab') => {
        const newId = Date.now().toString();
        set((state) => ({
          tabs: [...state.tabs, { id: newId, title: 'New Tab', url, icon: '🌎' }],
          activeTabId: newId,
        }));
      },
      closeTab: (id) => {
        set((state) => {
          const filtered = state.tabs.filter((t) => t.id !== id);
          if (filtered.length === 0) {
            const newId = Date.now().toString();
            return {
              tabs: [{ id: newId, title: 'New Tab', url: 'chrome://newtab', icon: '🌎' }],
              activeTabId: newId,
            };
          }
          if (id === state.activeTabId) {
            return {
              tabs: filtered,
              activeTabId: filtered[filtered.length - 1].id,
            };
          }
          return { tabs: filtered };
        });
      },
      setActiveTab: (id) => set({ activeTabId: id }),
      
      // Navigation Actions
      navigateTo: (url) => {
        if (!url) return;
        let finalUrl = url;
        
        // Smart Routing Logic
        if (!finalUrl.startsWith('http') && !finalUrl.includes('://')) {
          // If it looks like a domain, prepend https://
          if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
            finalUrl = `https://${finalUrl}`;
          } else {
            // Otherwise, it's a Google search
            finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`;
          }
        }

        const title = finalUrl.includes('://') 
          ? finalUrl.split('://')[1]
          : finalUrl;

        set((state) => {
          const newTabs = state.tabs.map((t) =>
            t.id === state.activeTabId
              ? { ...t, url: finalUrl, title }
              : t
          );
          
          const newHistory = [...state.history];
          // Don't add internal chrome pages to history
          if (!finalUrl.startsWith('chrome://')) {
            newHistory.unshift({ url: finalUrl, title, timestamp: Date.now() });
          }

          return {
            tabs: newTabs,
            history: newHistory.slice(0, 500), // Keep last 500
          };
        });
      },

      // Other Actions
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      addBookmark: (bookmark) => set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
      removeBookmark: (id) => set((state) => ({ bookmarks: state.bookmarks.filter(b => b.id !== id) })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'portfolio-browser-storage',
    }
  )
);
