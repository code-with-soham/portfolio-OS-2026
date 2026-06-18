import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APPS } from '../config/apps';

/**
 * Generates a unique ID for a new window instance
 */
const generateWindowId = (appId) => `${appId}-${Date.now()}`;

export const useWindowStore = create(
  persist(
    (set, get) => ({
      // Array of window objects
      windows: [],
      // ID of the currently focused window
      activeWindowId: null,
      // Tracks window stacking order for Alt+Tab groundwork
      windowOrder: [],
      // Remembers the previous focused window
      lastActiveWindowId: null,
      // Recent apps opened (for Start Menu — max 5)
      recentApps: [],
      // Virtual Desktops (VS-25)
      currentDesktop: 1,
      totalDesktops: 3,

      setDesktop: (index) => set({ currentDesktop: index }),

      /**
       * Open a new window for the given appId.
       * If it's already open, focus it (single instance per app for now).
       */
      openWindow: (appId, props = {}) => {
        const { windows } = get();
        
        // Track achievements
        import('./useAchievementStore').then(({ useAchievementStore }) => {
          const totalApps = Object.keys(APPS).length;
          useAchievementStore.getState().trackAppOpened(appId, totalApps);
          useAchievementStore.getState().trackEvent(`opened-${appId}`);
        });

        // Find if this app is already open
        const existingWindow = windows.find((w) => w.appId === appId);
        
        if (existingWindow) {
          // If the app is on a different desktop, switch to it
          if (existingWindow.desktop !== get().currentDesktop) {
            set({ currentDesktop: existingWindow.desktop });
          }

          // If minimized, restore it
          if (existingWindow.isMinimized) {
            set((state) => ({
              windows: state.windows.map((w) =>
                w.id === existingWindow.id ? { ...w, isMinimized: false, props: { ...w.props, ...props } } : w
              ),
              activeWindowId: existingWindow.id,
            }));
          } else {
            // Just focus it and update props
            set((state) => ({
              windows: state.windows.map((w) =>
                w.id === existingWindow.id ? { ...w, props: { ...w.props, ...props } } : w
              ),
              activeWindowId: existingWindow.id
            }));
          }
          return;
        }

        // Create new window
        const appConfig = APPS[appId];
        if (!appConfig) return; // App doesn't exist in registry

        const newWindow = {
          id: generateWindowId(appId),
          appId,
          title: appConfig.title,
          icon: appConfig.icon,
          desktop: get().currentDesktop,
          isMinimized: false,
          isMaximized: false,
          bounds: {
            // Cascade new windows slightly
            x: 100 + (windows.length * 30) % 300,
            y: 50 + (windows.length * 30) % 200,
            width: appConfig.defaultWidth || 800,
            height: appConfig.defaultHeight || 600,
          },
          previousBounds: null,
          zIndex: Date.now(), // Initial high z-index
          props, // Pass initial props
        };

        set((state) => {
          // Track in recent apps (unique, max 5)
          const newRecent = [appId, ...state.recentApps.filter((a) => a !== appId)].slice(0, 5);
          return {
            windows: [...state.windows, newWindow],
            activeWindowId: newWindow.id,
            lastActiveWindowId: state.activeWindowId,
            windowOrder: [...state.windowOrder, newWindow.id],
            recentApps: newRecent,
          };
        });
      },

      /**
       * Close a window by its unique instance ID
       */
      closeWindow: (id) => {
        set((state) => {
          const newWindows = state.windows.filter((w) => w.id !== id);
          const newOrder = state.windowOrder.filter((wId) => wId !== id);
          let newActiveId = state.activeWindowId;
          
          if (state.activeWindowId === id) {
            // Focus the top-most remaining window
            if (newWindows.length > 0) {
              const topWindow = [...newWindows].sort((a, b) => b.zIndex - a.zIndex)[0];
              newActiveId = topWindow.id;
            } else {
              newActiveId = null;
            }
          }

          return {
            windows: newWindows,
            activeWindowId: newActiveId,
            lastActiveWindowId: state.activeWindowId,
            windowOrder: newOrder,
          };
        });
      },

      /**
       * Minimize a window
       */
      minimizeWindow: (id) => {
        set((state) => {
          const newWindows = state.windows.map((w) =>
            w.id === id ? { ...w, isMinimized: true } : w
          );
          
          let newActiveId = state.activeWindowId;
          if (state.activeWindowId === id) {
            // Focus the next top-most non-minimized window
            const visibleWindows = newWindows.filter((w) => !w.isMinimized);
            if (visibleWindows.length > 0) {
              const topWindow = visibleWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
              newActiveId = topWindow.id;
            } else {
              newActiveId = null;
            }
          }

          return { windows: newWindows, activeWindowId: newActiveId };
        });
      },

      /**
       * Restore a minimized window
       */
      restoreWindow: (id) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMinimized: false, zIndex: Date.now() } : w
          ),
          activeWindowId: id,
        }));
      },

      /**
       * Toggle Maximize state
       */
      toggleMaximize: (id) => {
        set((state) => {
          return {
            windows: state.windows.map((w) => {
              if (w.id !== id) return w;

              if (w.isMaximized) {
                // Restore to previous bounds
                return {
                  ...w,
                  isMaximized: false,
                  bounds: w.previousBounds ? { ...w.previousBounds } : w.bounds,
                };
              } else {
                // Maximize and save current bounds
                return {
                  ...w,
                  isMaximized: true,
                  previousBounds: { ...w.bounds },
                };
              }
            }),
            activeWindowId: id,
          };
        });
      },

      /**
       * Prepare for Snap Layouts
       */
      snapWindow: (id, direction) => {
        // Future feature: Windows + Left / Windows + Right
        console.log(`Snapping window ${id} to ${direction}`);
      },

      /**
       * Focus a window (bring to front)
       */
      focusWindow: (id) => {
        set((state) => {
          if (state.activeWindowId === id) return state; // Already focused
          
          const winToFocus = state.windows.find(w => w.id === id);
          if (!winToFocus) return state;
          
          // Switch desktop if necessary
          const newDesktop = winToFocus.desktop !== state.currentDesktop ? winToFocus.desktop : state.currentDesktop;

          // Bring to front by updating zIndex and update order
          const newOrder = [...state.windowOrder.filter((wId) => wId !== id), id];
          return {
            windows: state.windows.map((w) =>
              w.id === id ? { ...w, zIndex: Date.now() } : w
            ),
            activeWindowId: id,
            lastActiveWindowId: state.activeWindowId,
            windowOrder: newOrder,
            currentDesktop: newDesktop,
          };
        });
      },

      /**
       * Update window position and size (from dragging/resizing)
       */
      updateWindowBounds: (id, bounds) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, bounds: { ...w.bounds, ...bounds } } : w
          ),
        }));
      },
      
      /**
       * Set active window directly
       */
      setActiveWindow: (id) => set({ activeWindowId: id }),

    }),
    {
      name: 'portfolio-os-windows-storage',
      // We only want to persist windows array and activeWindowId
      // However, we can't persist components. Since the registry (APPS) 
      // holds the component references based on appId, we are fine as long as 
      // we only store plain JSON data in the store.
      partialize: (state) => ({
        windows: state.windows,
        activeWindowId: state.activeWindowId,
        recentApps: state.recentApps,
      }),
    }
  )
);
