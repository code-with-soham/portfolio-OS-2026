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
export const APP_NAME = 'Portfolio OS 2026';
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
