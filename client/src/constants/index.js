// ============================================
// Portfolio OS 2026 — Constants
// ============================================
// Application-wide constants and configuration values.
// Centralized here to avoid magic strings/numbers across components.

/**
 * API base URL — points to the Express backend
 * In production, this would be the deployed server URL
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * App metadata
 */
export const APP_NAME = 'Portfolio OS';
export const APP_VERSION = '1.0.0';
export const APP_AUTHOR = 'Soham Kundu';

/**
 * Theme options
 */
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

/**
 * Window states — used by the future window manager
 */
export const WINDOW_STATES = {
  NORMAL: 'normal',
  MINIMIZED: 'minimized',
  MAXIMIZED: 'maximized',
};

/**
 * Desktop icon sizes
 */
export const ICON_SIZES = {
  SMALL: 32,
  MEDIUM: 48,
  LARGE: 64,
};

/**
 * Taskbar configuration
 */
export const TASKBAR = {
  HEIGHT: 48,
  POSITION: 'bottom', // 'bottom' | 'top'
};

/**
 * Animation duration constants (in seconds)
 */
export const ANIMATION = {
  FAST: 0.12,
  NORMAL: 0.2,
  SMOOTH: 0.3,
  WINDOW_OPEN: 0.25,
  WINDOW_CLOSE: 0.2,
  BOOT_DURATION: 3, // seconds
  LOCK_TRANSITION: 0.6,
};

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

/**
 * OS States — the desktop shell lifecycle
 */
export const OS_STATES = {
  BOOTING: 'booting',
  LOCKED: 'locked',
  DESKTOP: 'desktop',
};

/**
 * Desktop Applications — the apps shown on desktop and start menu
 * Each app has an id, display label, emoji icon, and description.
 * In Phase 5 these will launch actual window components.
 */
export const DESKTOP_APPS = [
  {
    id: 'about',
    label: 'About Me',
    icon: '👤',
    description: 'Profile & Bio',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '💼',
    description: 'My work',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: '⚡',
    description: 'Tech stack',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: '⬛',
    description: 'Command line',
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: '📄',
    description: 'Download CV',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    description: 'Preferences',
  },
];

/**
 * Start menu recommended items (decorative for Phase 3)
 */
export const RECOMMENDED_ITEMS = [
  {
    id: 'rec-1',
    label: 'portfolio-os-2026',
    detail: 'Recently opened',
    icon: '📁',
  },
  {
    id: 'rec-2',
    label: 'README.md',
    detail: 'Yesterday',
    icon: '📝',
  },
  {
    id: 'rec-3',
    label: 'architecture.md',
    detail: '2 days ago',
    icon: '📝',
  },
];

/**
 * Quick settings for the notification center (decorative)
 */
export const QUICK_SETTINGS = [
  { id: 'wifi', label: 'Wi-Fi', icon: '📶', active: true },
  { id: 'bluetooth', label: 'Bluetooth', icon: '🔷', active: false },
  { id: 'airplane', label: 'Airplane', icon: '✈️', active: false },
  { id: 'nightlight', label: 'Night light', icon: '🌙', active: false },
  { id: 'focus', label: 'Focus', icon: '🎯', active: false },
  { id: 'accessibility', label: 'Accessible', icon: '♿', active: false },
];
