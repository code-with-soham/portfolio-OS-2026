// ============================================
// Portfolio OS 2026 — Desktop Store
// ============================================
// Zustand store managing the OS shell state machine.
//
// Lifecycle: booting → locked → desktop
//
// Also manages UI panel states (start menu, notification center).
// No persistence — the OS always boots fresh on page reload.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OS_STATES } from '../constants';
import { useWidgetStore } from './useWidgetStore';

/**
 * Desktop store — manages OS lifecycle and shell UI state
 *
 * Usage:
 *   const { osState, setOsState } = useDesktopStore();
 *   const { isStartMenuOpen, toggleStartMenu } = useDesktopStore();
 */
export const useDesktopStore = create(
  persist(
    (set, get) => ({
  // ========================
  // OS Lifecycle State
  // ========================

  /** Current OS state: 'booting' | 'locked' | 'desktop' */
  osState: OS_STATES.BOOTING,

  /**
   * Transition to the next OS state.
   * @param {'booting' | 'locked' | 'desktop'} state
   */
  setOsState: (state) => {
    if (Object.values(OS_STATES).includes(state)) {
      set({ osState: state });
    }
  },

  // ========================
  // Start Menu
  // ========================

  /** Whether the Start Menu is currently open */
  isStartMenuOpen: false,

  /** Toggle the Start Menu open/closed */
  toggleStartMenu: () => {
    const isOpen = get().isStartMenuOpen;
    set({
      isStartMenuOpen: !isOpen,
      // Close other panels
      isNotificationCenterOpen: false,
      isQuickSettingsOpen: false,
      isAIAssistantOpen: false,
    });
  },

  /** Close the Start Menu */
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  /** Open the Start Menu explicitly */
  openStartMenu: () => set({ 
    isStartMenuOpen: true,
    isNotificationCenterOpen: false,
    isQuickSettingsOpen: false,
    isAIAssistantOpen: false,
  }),

  // ========================
  // AI Assistant
  // ========================
  // Global Overlays (VS-33)
  isGlobalSearchOpen: false,
  toggleGlobalSearch: () => set((state) => ({ isGlobalSearchOpen: !state.isGlobalSearchOpen, isStartMenuOpen: false })),
  closeGlobalSearch: () => set({ isGlobalSearchOpen: false }),

  isCommandPaletteOpen: false,
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),

  isUniversalSpotlightOpen: false,
  toggleUniversalSpotlight: () => set((state) => ({ isUniversalSpotlightOpen: !state.isUniversalSpotlightOpen })),
  closeUniversalSpotlight: () => set({ isUniversalSpotlightOpen: false }),

  // AI Assistant
  isAIAssistantOpen: false,
  toggleAIAssistant: () => {
    const isOpen = get().isAIAssistantOpen;
    set({ 
      isAIAssistantOpen: !isOpen, 
      isStartMenuOpen: false, 
      isNotificationCenterOpen: false 
    });
  },
  closeAIAssistant: () => set({ isAIAssistantOpen: false }),

  // ========================
  // Notification Center
  // ========================

  /** Whether the Notification Center is currently open */
  isNotificationCenterOpen: false,

  /** Toggle the Notification Center open/closed */
  toggleNotificationCenter: () => {
    const isOpen = get().isNotificationCenterOpen;
    set({
      isNotificationCenterOpen: !isOpen,
      // Close other panels
      isStartMenuOpen: false,
      isQuickSettingsOpen: false,
    });
  },

  /** Close the Notification Center */
  closeNotificationCenter: () => set({ isNotificationCenterOpen: false }),

  // ========================
  // Quick Settings
  // ========================

  /** Whether the Quick Settings is currently open */
  isQuickSettingsOpen: false,

  /** Toggle the Quick Settings open/closed */
  toggleQuickSettings: () => {
    const isOpen = get().isQuickSettingsOpen;
    set({
      isQuickSettingsOpen: !isOpen,
      // Close other panels
      isStartMenuOpen: false,
      isNotificationCenterOpen: false,
    });
  },

  /** Close the Quick Settings */
  closeQuickSettings: () => set({ isQuickSettingsOpen: false }),

  // ========================
  // Context Menu
  // ========================

  /** Context Menu state */
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    items: [],
  },

  /** Open context menu at coordinates with items */
  openContextMenu: (x, y, items) => {
    set({
      contextMenu: { isOpen: true, x, y, items },
      isStartMenuOpen: false,
      isNotificationCenterOpen: false,
      isQuickSettingsOpen: false,
    });
  },

  /** Close context menu */
  closeContextMenu: () => {
    set((state) => ({
      contextMenu: { ...state.contextMenu, isOpen: false },
    }));
  },

  // ========================
  // Desktop Icons
  // ========================

  /** Icon size */
  iconSize: 'medium', // 'small' | 'medium' | 'large'
  setIconSize: (size) => set({ iconSize: size }),

  /** Icon sort order */
  sortOrder: 'name', // 'name' | 'default'
  setSortOrder: (order) => set({ sortOrder: order }),

  /** Icon positions keyed by app ID: { [id]: { x, y } } */
  iconPositions: {},

  /** Update icon position */
  updateIconPosition: (id, x, y) => {
    set((state) => ({
      iconPositions: {
        ...state.iconPositions,
        [id]: { x, y },
      },
    }));
  },

  /** Selected desktop icon ID */
  selectedIconId: null,

  /** Set selected desktop icon */
  setSelectedIconId: (id) => set({ selectedIconId: id }),

  // ========================
  // Spotlight Search
  // ========================

  isSpotlightOpen: false,

  toggleSpotlight: () => {
    const isOpen = get().isSpotlightOpen;
    set({
      isSpotlightOpen: !isOpen,
      isStartMenuOpen: false,
      isNotificationCenterOpen: false,
      isQuickSettingsOpen: false,
      isAIAssistantOpen: false,
    });
  },

  closeSpotlight: () => set({ isSpotlightOpen: false }),
  // Overlays (Run Dialog, Power Menu, Desktop Switcher)
  // ========================

  isRunDialogOpen: false,
  toggleRunDialog: () => set((state) => ({ isRunDialogOpen: !state.isRunDialogOpen, isPowerUserMenuOpen: false })),
  closeRunDialog: () => set({ isRunDialogOpen: false }),

  isPowerUserMenuOpen: false,
  togglePowerUserMenu: () => set((state) => ({ isPowerUserMenuOpen: !state.isPowerUserMenuOpen, isRunDialogOpen: false })),
  closePowerUserMenu: () => set({ isPowerUserMenuOpen: false }),

  isDesktopSwitcherOpen: false,
  toggleDesktopSwitcher: () => set((state) => ({ isDesktopSwitcherOpen: !state.isDesktopSwitcherOpen })),
  closeDesktopSwitcher: () => set({ isDesktopSwitcherOpen: false }),

  // ========================
  // Utility
  // ========================

  /** Close all open panels (start menu + notification center + quick settings) */
  closeAllPanels: () => {
    set((state) => ({
      isStartMenuOpen: false,
      isNotificationCenterOpen: false,
      isQuickSettingsOpen: false,
      isAIAssistantOpen: false,
      isSpotlightOpen: false,
      isRunDialogOpen: false,
      isPowerUserMenuOpen: false,
      isDesktopSwitcherOpen: false,
      contextMenu: { ...state.contextMenu, isOpen: false },
      selectedIconId: null, // Deselect icons when clicking background
    }));
    useWidgetStore.getState().closeWidgetPanel();
  },
    
  // ========================
  // System Telemetry
  // ========================
  bootTime: Date.now(),

  // ========================
  // VS-21: Taskbar Settings
  // ========================
  taskbarAlignment: 'center', // 'left' | 'center'
  taskbarSize: 'medium', // 'small' | 'medium' | 'large'
  taskbarAutoHide: false,
  showSeconds: false,
  showWeather: true,

  setTaskbarAlignment: (val) => set({ taskbarAlignment: val }),
  setTaskbarSize: (val) => set({ taskbarSize: val }),
  setTaskbarAutoHide: (val) => set({ taskbarAutoHide: val }),
  setShowSeconds: (val) => set({ showSeconds: val }),
  setShowWeather: (val) => set({ showWeather: val }),

  // ========================
  // VS-21: Accessibility
  // ========================
  textSize: 100, // 100, 125, 150
  windowAnimations: true,
  reduceMotion: false,
  highContrast: false,

  setTextSize: (val) => set({ textSize: val }),
  setWindowAnimations: (val) => set({ windowAnimations: val }),
  setReduceMotion: (val) => set({ reduceMotion: val }),
  setHighContrast: (val) => set({ highContrast: val }),

  // ========================
  // VS-21: Lock Screen
  // ========================
  lockScreenWallpaper: 'default',
  lockScreenAvatar: null, // base64 string
  lockScreenText: 'Welcome Back, Soham 🚀',

  setLockScreenWallpaper: (val) => set({ lockScreenWallpaper: val }),
  setLockScreenAvatar: (val) => set({ lockScreenAvatar: val }),
  setLockScreenText: (val) => set({ lockScreenText: val }),

  // ========================
  // VS-22: Startup Apps
  // ========================
  startupApps: ['vscode'], // IDs of apps to launch on boot
  
  toggleStartupApp: (appId) => set((state) => {
    if (state.startupApps.includes(appId)) {
      return { startupApps: state.startupApps.filter(id => id !== appId) };
    }
    return { startupApps: [...state.startupApps, appId] };
  }),

    }),
    {
      name: 'portfolio-os-desktop-storage',
      partialize: (state) => ({
        iconPositions: state.iconPositions,
        iconSize: state.iconSize,
        sortOrder: state.sortOrder,
        taskbarAlignment: state.taskbarAlignment,
        taskbarSize: state.taskbarSize,
        taskbarAutoHide: state.taskbarAutoHide,
        showSeconds: state.showSeconds,
        showWeather: state.showWeather,
        textSize: state.textSize,
        windowAnimations: state.windowAnimations,
        reduceMotion: state.reduceMotion,
        highContrast: state.highContrast,
        lockScreenWallpaper: state.lockScreenWallpaper,
        lockScreenAvatar: state.lockScreenAvatar,
        lockScreenText: state.lockScreenText,
        startupApps: state.startupApps,
      }),
    }
  )
);
