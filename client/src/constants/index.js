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
  SHUTDOWN: 'shutdown',
};

import userIco from '../assets/icons/system/User.ico';
import projectsIco from '../assets/icons/system/Briefcase.ico';
import terminalIco from '../assets/icons/system/Windows_Terminal_logo.svg.ico';
import fileExplorerIco from '../assets/icons/system/Explorer.ico';
import settingsIco from '../assets/icons/system/Settings.ico';
import infoIco from '../assets/icons/system/Info.ico';

import pcIco from '../assets/icons/system/Computer.ico';
import controlPanelIco from '../assets/icons/system/Control Panel.ico';
import downloadsIco from '../assets/icons/system/Folder Downloads.ico';
import musicIco from '../assets/icons/system/Folder Music.ico';
import videosIco from '../assets/icons/system/Folder Videos.ico';
import oneDriveIco from '../assets/icons/system/One Drive.ico';
import trashIco from '../assets/icons/system/Trash Empty.ico';
import vscodeIco from '../assets/icons/apps/vscode.svg';
import recycleBinIco from '../assets/icons/system/Trash Empty.ico';

// New Custom Icons
import aboutIco from '../assets/icons/apps/icons8-about-me-48.png';
import skillsIco from '../assets/icons/apps/icons8-skill-48.png';
import resumeIco from '../assets/icons/apps/icons8-resume-64.png';
import browserIco from '../assets/icons/apps/icons8-chrome-48.png';
import mailIco from '../assets/icons/apps/icons8-gmail-48.png';
import photosIco from '../assets/icons/apps/icons8-photos-48.png';
import calculatorIco from '../assets/icons/apps/icons8-calculator-94.png';
import documentIco from '../assets/icons/apps/icons8-notepad-48.png';
import calendarIco from '../assets/icons/apps/icons8-google-calendar-100.png';
import paintIco from '../assets/icons/apps/icons8-paint-94.png';
import aiDashboardIco from '../assets/icons/apps/icons8-dashboard-60.png';
import aiAssistantIco from '../assets/icons/apps/icons8-gemini-ai-48.png';
import aboutOsIco from '../assets/icons/apps/icons8-windows-defender-50.png';
import whatsappIco from '../assets/icons/apps/icons8-whatsapp-48.png';

import mongodbIco from '../assets/icons/apps/mongodb.svg';

/**
 * Desktop Applications — the apps shown on desktop and start menu
 * Each app has an id, display label, emoji icon, and description.
 * In Phase 5 these will launch actual window componexport const DESKTOP_APPS = [
  {
    id: 'mypc',
    label: 'My PC',
    icon: pcIco,
    description: 'Computer',
  },
  {
    id: 'about',
    label: 'About Me',
    icon: aboutIco,
    description: 'Profile & Bio',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: projectsIco,
    description: 'My work',
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: skillsIco,
    description: 'Tech stack',
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: resumeIco,
    description: 'Download CV',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: mailIco,
    description: 'Get in touch',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: terminalIco,
    description: 'Command line',
  },
  {
    id: 'vscode',
    label: 'VS Code',
    icon: vscodeIco,
    description: 'Code Editor',
  },
  {
    id: 'fileexplorer',
    label: 'File Explorer',
    icon: fileExplorerIco,
    description: 'Browse files',
  },
  {
    id: 'browser',
    label: 'Browser',
    icon: browserIco,
    description: 'Web Browser',
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: '🐙',
    description: 'GitHub Profile',
    action: () => window.open('https://github.com/code-with-soham', '_blank')
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: '🔗',
    description: 'LinkedIn Profile',
    action: () => window.open('https://linkedin.com/in/code-with-soham', '_blank')
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: settingsIco,
    description: 'Preferences',
  },
  {
    id: 'gamecenter',
    label: 'Game Center',
    icon: '🎮',
    description: 'Xbox Style Game Hub',
  },
  {
    id: 'chessarena',
    label: 'Chess Arena Pro',
    icon: '♟️',
    description: 'Premium Chess App',
  }
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

