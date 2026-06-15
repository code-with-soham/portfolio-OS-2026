// ============================================
// Portfolio OS 2026 — Root Application Component
// ============================================
// Manages the OS lifecycle via Zustand state machine:
//   booting → locked → desktop
//
// Uses Framer Motion AnimatePresence for smooth page transitions.
// Applies the theme via data-theme attribute on the root element.
// Registers global keyboard shortcuts (Esc to close windows).

import { AnimatePresence } from 'framer-motion';
import { useDesktopStore } from './store/useDesktopStore';
import { useThemeStore } from './store/useThemeStore';
import { OS_STATES } from './constants';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import BootScreen from './pages/BootScreen';
import LockScreen from './pages/LockScreen';
import Desktop from './pages/Desktop';

/**
 * App — Root component
 *
 * Renders the correct page based on the OS state.
 * No React Router needed — the desktop shell is state-driven.
 */
function App() {
  const osState = useDesktopStore((s) => s.osState);
  const theme = useThemeStore((s) => s.theme);

  // Register global keyboard shortcuts (Esc, etc.)
  useKeyboardShortcuts();

  return (
    <div
      data-theme={theme}
      id="os-root"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg-desktop)',
      }}
    >
      <AnimatePresence mode="wait">
        {osState === OS_STATES.BOOTING && <BootScreen key="boot" />}
        {osState === OS_STATES.LOCKED && <LockScreen key="lock" />}
        {osState === OS_STATES.DESKTOP && <Desktop key="desktop" />}
      </AnimatePresence>
    </div>
  );
}

export default App;
