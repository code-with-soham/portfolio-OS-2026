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
import { useEffect, useRef } from 'react';
import { useDesktopStore } from '../store/useDesktopStore';
import { useWindowStore } from '../store/useWindowStore';
import { useFileSystemStore } from '../store/useFileSystemStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { DESKTOP_APPS } from '../constants';
import trashFullIco from '../assets/icons/system/Trash Full.ico';
import Taskbar from '../components/desktop/Taskbar';
import StartMenu from '../components/desktop/StartMenu';
import NotificationCenter from '../components/system/notification/NotificationCenter';
import QuickSettings from '../components/system/quicksettings/QuickSettings';
import DesktopIcon from '../components/desktop/DesktopIcon';
import ContextMenu from '../components/desktop/ContextMenu';
import ToastContainer from '../components/desktop/ToastContainer';
import Window from '../components/desktop/Window';
import WidgetsPanel from '../components/widgets/WidgetsPanel';
import AIAssistant from '../components/desktop/AIAssistant';
import VolumeOSD from '../components/system/osd/VolumeOSD';
import { useWidgetStore } from '../store/useWidgetStore';
import {
  EyeRegular,
  ArrowSortRegular,
  ArrowClockwiseRegular,
  BoardRegular,
  PaintBrushRegular,
  InfoRegular,
  DocumentRegular,
  FolderRegular,
} from '@fluentui/react-icons';

export default function Desktop() {
  const closeAllPanels = useDesktopStore((s) => s.closeAllPanels);
  const openContextMenu = useDesktopStore((s) => s.openContextMenu);
  const iconSize = useDesktopStore((s) => s.iconSize);
  const sortOrder = useDesktopStore((s) => s.sortOrder);
  const setIconSize = useDesktopStore((s) => s.setIconSize);
  const setSortOrder = useDesktopStore((s) => s.setSortOrder);
  const windows = useWindowStore((s) => s.windows);
  const setActiveWindow = useWindowStore((s) => s.setActiveWindow);
  const openWindow = useWindowStore((s) => s.openWindow);
  const deletedItems = useFileSystemStore((s) => s.deletedItems);
  const toggleAIAssistant = useDesktopStore((s) => s.toggleAIAssistant);

  const toggleWidgetPanel = useWidgetStore((s) => s.toggleWidgetPanel);
  const isWidgetPanelOpen = useWidgetStore((s) => s.isWidgetPanelOpen);
  const addNotification = useNotificationStore((s) => s.addNotification);

  // Trigger mock notifications on boot
  const hasTriggeredMocks = useRef(false);
  useEffect(() => {
    if (hasTriggeredMocks.current) return;
    hasTriggeredMocks.current = true;

    // GitHub Star
    setTimeout(() => {
      addNotification(
        'GitHub ⭐ New Star Received',
        'Someone starred your repository "portfolio-os"!',
        'system',
        6000
      );
    }, 4000);

    // Build Success
    setTimeout(() => {
      addNotification(
        'Build Successful ✓',
        'portfolio-os deployed successfully to production.',
        'system',
        6000
      );
    }, 12000);

    // Email
    setTimeout(() => {
      addNotification(
        'TCS Interview Invitation',
        'You have been invited for a technical interview...',
        'system',
        8000,
        'Read',
        () => openWindow('mail')
      );
    }, 22000);

  }, [addNotification, openWindow]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    
    // Standard Windows 11 desktop context menu items
    const items = [
      { 
        label: `View (${iconSize.charAt(0).toUpperCase() + iconSize.slice(1)} icons)`, 
        icon: <EyeRegular />, 
        onClick: () => {
          const nextSize = iconSize === 'small' ? 'medium' : iconSize === 'medium' ? 'large' : 'small';
          setIconSize(nextSize);
        }
      },
      { 
        label: `Sort by (${sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)})`, 
        icon: <ArrowSortRegular />, 
        onClick: () => {
          const nextOrder = sortOrder === 'name' ? 'default' : 'name';
          setSortOrder(nextOrder);
        }
      },
      { label: 'Refresh', icon: <ArrowClockwiseRegular />, onClick: () => window.location.reload() },
      { divider: true },
      { 
        label: 'New', 
        icon: <DocumentRegular />, 
        onClick: () => {}, 
        // We simulate a sub-menu or just action.
        // For simplicity we could just trigger an action directly or open notepad.
      },
      { 
        label: '  Folder', 
        icon: <FolderRegular />, 
        onClick: () => openWindow('fileexplorer') 
      },
      { 
        label: '  Text Document', 
        icon: <DocumentRegular />, 
        onClick: () => openWindow('notepad') 
      },
      { divider: true },
      { label: isWidgetPanelOpen ? 'Hide Widgets' : 'Show Widgets', icon: <BoardRegular />, onClick: toggleWidgetPanel },
      { divider: true },
      { label: 'Personalize', icon: <PaintBrushRegular />, onClick: () => openWindow('settings') },
      { label: 'About OS', icon: <InfoRegular />, onClick: () => openWindow('aboutos') },
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
        {(() => {
          const sortedApps = [...DESKTOP_APPS];
          if (sortOrder === 'name') {
            sortedApps.sort((a, b) => a.label.localeCompare(b.label));
          }
          
          return sortedApps.map((app) => {
            let currentIcon = app.icon;
            if (app.id === 'recyclebin' && deletedItems.length > 0) {
              currentIcon = trashFullIco;
            }
            
            return (
              <DesktopIcon
                key={app.id}
                id={app.id}
                label={app.label}
                icon={currentIcon}
                onDoubleClick={(e) => {
                  if (app.id === 'aiassistant') {
                    toggleAIAssistant();
                  } else {
                    openWindow(app.id);
                  }
                }}
              />
            );
          });
        })()}
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

      {/* AI Assistant Overlay */}
      <AIAssistant />

      {/* Widgets Panel overlay */}
      <WidgetsPanel />

      {/* Notification Center overlay */}
      <NotificationCenter />
      
      {/* Quick Settings overlay */}
      <QuickSettings />

      {/* Volume OSD */}
      <VolumeOSD />

      {/* Taskbar — always at bottom */}
      <Taskbar />
    </motion.div>
  );
}
