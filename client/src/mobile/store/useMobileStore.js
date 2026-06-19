import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMobileStore = create(
  persist(
    (set, get) => ({
      // Navigation
      activeApp: null, // null means Home Screen
      activeTab: 'home', // For bottom nav: home, apps, search, ai, profile
      
      // Overlays
      isLocked: true,
      isAppDrawerOpen: false,
      isQuickSettingsOpen: false,
      isWidgetsScreenOpen: false,
      
      // Global device states (mocked for UI)
      batteryLevel: 85,
      isCharging: false,
      wifiStrength: 3, // 0-3
      cellularSignal: 4, // 0-4
      
      // Actions
      openApp: (appId) => set({ activeApp: appId, isAppDrawerOpen: false }),
      closeApp: () => set({ activeApp: null }),
      
      setBottomNavTab: (tab) => set({ activeTab: tab, activeApp: null }),
      
      unlockDevice: () => set({ isLocked: false }),
      lockDevice: () => set({ isLocked: true }),

      toggleAppDrawer: (isOpen) => set({ isAppDrawerOpen: isOpen ?? !get().isAppDrawerOpen }),
      toggleQuickSettings: (isOpen) => set({ isQuickSettingsOpen: isOpen ?? !get().isQuickSettingsOpen }),
      toggleWidgetsScreen: (isOpen) => set({ isWidgetsScreenOpen: isOpen ?? !get().isWidgetsScreenOpen }),
      
      // Device states updates
      updateBattery: (level, charging) => set({ batteryLevel: level, isCharging: charging }),
    }),
    {
      name: 'portfolio-os-mobile-storage',
      partialize: (state) => ({
        // only persist basic preferences, not overlay states
      }),
    }
  )
);
