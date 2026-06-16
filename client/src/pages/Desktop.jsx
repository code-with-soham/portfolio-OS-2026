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
import { useWindowStore } from '../store/useWindowStore';
import { DESKTOP_APPS } from '../constants';
import Taskbar from '../components/desktop/Taskbar';
import StartMenu from '../components/desktop/StartMenu';
import NotificationCenter from '../components/system/notification/NotificationCenter';
import QuickSettings from '../components/system/quicksettings/QuickSettings';
import DesktopIcon from '../components/desktop/DesktopIcon';
import ContextMenu from '../components/desktop/ContextMenu';
import ToastContainer from '../components/desktop/ToastContainer';
import Window from '../components/desktop/Window';
import WidgetsPanel from '../components/widgets/WidgetsPanel';
import { useWidgetStore } from '../store/useWidgetStore';
import {
  EyeRegular,
  ArrowSortRegular,
  ArrowClockwiseRegular,
  BoardRegular,
  PaintBrushRegular,
  InfoRegular,
} from '@fluentui/react-icons';

export default function Desktop() {
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels);
  const openContextMenu = useDesktopStore((s) => s.openContextMenu);
  const windows = useWindowStore((s) => s.windows);
  const setActiveWindow = useWindowStore((s) => s.setActiveWindow);

  const toggleWidgetPanel = useWidgetStore((s) => s.toggleWidgetPanel);
  const isWidgetPanelOpen = useWidgetStore((s) => s.isWidgetPanelOpen);

  const handleContextMenu = (e) => {
    e.preventDefault();
    
    // Standard Windows 11 desktop context menu items
    const items = [
      { label: 'View', icon: <EyeRegular />, disabled: false },
      { label: 'Sort by', icon: <ArrowSortRegular />, disabled: false },
      { label: 'Refresh', icon: <ArrowClockwiseRegular />, onClick: () => window.location.reload() },
      { divider: true },
      { label: isWidgetPanelOpen ? 'Hide Widgets' : 'Show Widgets', icon: <BoardRegular />, onClick: toggleWidgetPanel },
      { divider: true },
      { label: 'Personalize', icon: <PaintBrushRegular />, disabled: true },
      { label: 'About OS', icon: <InfoRegular />, disabled: true },
    ];
    
    openContextMenu(e.clientX, e.clientY, items);
  };

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
      {/* Subtle desktop ambience overlay */}
      <div className="desktop-ambient" />

      {/* Desktop icon area — click background to close panels */}
      <div
        id="desktop-area"
        onClick={() => {
          closeAllPanels();
          setActiveWindow(null); // Deselect window focus when clicking desktop
        }}
        onContextMenu={handleContextMenu}
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



      {/* Render open windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win} />
      ))}

      {/* Start Menu overlay */}
      <ToastContainer />
      <StartMenu />

      {/* Context Menu overlay */}
      <ContextMenu />

      {/* Widgets Panel overlay */}
      <WidgetsPanel />

      {/* Notification Center overlay */}
      <NotificationCenter />
      
      {/* Quick Settings overlay */}
      <QuickSettings />

      {/* Taskbar — always at bottom */}
      <Taskbar />
    </motion.div>
  );
}
