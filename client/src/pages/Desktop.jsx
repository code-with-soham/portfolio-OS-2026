// ============================================
// Portfolio OS 2026 — Desktop
// ============================================
// The main desktop environment page.
// Renders wallpaper, desktop icon grid, taskbar, start menu,
// and notification center.
//
// Clicking the desktop background closes all open panels.
// Icons are arranged in a column-first grid (like Windows 11).

import { motion } from 'framer-motion';
import { useDesktopStore } from '../store/useDesktopStore';
import { DESKTOP_APPS } from '../constants';
import Taskbar from '../components/desktop/Taskbar';
import StartMenu from '../components/desktop/StartMenu';
import NotificationCenter from '../components/desktop/NotificationCenter';
import DesktopIcon from '../components/desktop/DesktopIcon';

export default function Desktop() {
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels);

  return (
    <motion.div
      className="no-select wallpaper-default"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Desktop icon area — click background to close panels */}
      <div
        id="desktop-area"
        onClick={closeAllPanels}
        style={{
          position: 'absolute',
          inset: 0,
          bottom: 'var(--taskbar-height)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: '4px',
        }}
      >
        {DESKTOP_APPS.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            label={app.label}
            icon={app.icon}
          />
        ))}
      </div>

      {/* Start Menu overlay */}
      <StartMenu />

      {/* Notification Center overlay */}
      <NotificationCenter />

      {/* Taskbar — always at bottom */}
      <Taskbar />
    </motion.div>
  );
}
