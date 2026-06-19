// ============================================
// Portfolio OS 2026 — Desktop
// ============================================
// The main desktop environment page.
// Renders wallpaper, desktop icon grid, taskbar, start menu,
// and notification center.
//
// Clicking the desktop background closes all open panels.
// Icons are arranged in a column-first grid (like Windows 11).

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useDesktopStore } from '../store/useDesktopStore';
import { useWindowStore } from '../store/useWindowStore';
import { useFileSystemStore } from '../store/useFileSystemStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useThemeStore } from '../store/useThemeStore';
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
import AnimatedWallpaper from '../components/desktop/AnimatedWallpaper';
import StickyNotesLayer from '../components/desktop/StickyNotesLayer';
import SnippingToolLayer from '../components/system/SnippingToolLayer';
import BackgroundServices from '../components/system/BackgroundServices';
import SpotlightSearch from '../components/system/SpotlightSearch';
import RunDialog from '../components/system/RunDialog';
import PowerUserMenu from '../components/system/PowerUserMenu';
import AltTabOverlay from '../components/system/AltTabOverlay';
import DesktopSwitcherOverlay from '../components/system/DesktopSwitcherOverlay';
import { useWidgetStore } from '../store/useWidgetStore';
import { useStickyNotesStore } from '../store/useStickyNotesStore';
import { useCalendarStore } from '../store/useCalendarStore';
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

  const { theme, accentColor, wallpaper, animatedWallpaper, customWallpapers, wallpaperSlideshow, slideshowInterval, setWallpaper } = useThemeStore();
  
  const textSize = useDesktopStore((s) => s.textSize);
  const startupApps = useDesktopStore((s) => s.startupApps);

  // Apply Theme and Accent Color globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--color-accent', accentColor);
    
    // Apply text size scaling globally
    document.documentElement.style.fontSize = `${(textSize / 100) * 16}px`;

    // Calculate a slightly darker version for hover (quick hex brightness adjust)
    const adjustBrightness = (hex, amount) => {
      let num = parseInt(hex.replace('#', ''), 16);
      let r = Math.min(255, Math.max(0, (num >> 16) + amount));
      let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
      let b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };
    document.documentElement.style.setProperty('--color-accent-hover', adjustBrightness(accentColor, -20));

    // Special OS themes
    if (theme === 'oled') {
      document.documentElement.style.setProperty('--color-bg-desktop', '#000000');
      document.documentElement.style.setProperty('--color-bg-taskbar', '#000000');
    } else if (theme === 'hacker') {
      document.documentElement.style.setProperty('--color-text-primary', '#00ff00');
      document.documentElement.style.setProperty('--color-bg-desktop', '#000000');
    } else {
      // Reset custom theme overrides
      document.documentElement.style.removeProperty('--color-bg-desktop');
      document.documentElement.style.removeProperty('--color-bg-taskbar');
      if (theme !== 'hacker') document.documentElement.style.removeProperty('--color-text-primary');
    }
  }, [theme, accentColor]);

  // Wallpaper Slideshow Logic
  useEffect(() => {
    if (!wallpaperSlideshow) return;

    const intervalMs = slideshowInterval * 60 * 1000;
    const allIds = ['default', ...customWallpapers.map(w => w.id)];
    
    if (allIds.length <= 1) return;

    const timer = setInterval(() => {
      const currentIndex = allIds.indexOf(useThemeStore.getState().wallpaper);
      const nextIndex = (currentIndex + 1) % allIds.length;
      setWallpaper(allIds[nextIndex]);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [wallpaperSlideshow, slideshowInterval, customWallpapers, setWallpaper]);

  // Determine wallpaper style
  const isCustomWallpaper = wallpaper !== 'default' && customWallpapers.some(w => w.id === wallpaper);
  const customWallpaperData = isCustomWallpaper ? customWallpapers.find(w => w.id === wallpaper)?.dataUrl : null;

  // Trigger mock notifications & startup apps on boot
  const hasBooted = useRef(false);
  useEffect(() => {
    if (hasBooted.current) return;
    hasBooted.current = true;

    // Launch Startup Apps
    startupApps.forEach(appId => {
      if (appId === 'aiassistant') toggleAIAssistant();
      else if (appId === 'github_widget') {
        if (!useWidgetStore.getState().activeWidgets.includes('github')) {
          useWidgetStore.getState().setWidgetVisibility('github', true);
        }
        if (!useWidgetStore.getState().isWidgetPanelOpen) {
          useWidgetStore.getState().toggleWidgetPanel();
        }
      }
      else openWindow(appId);
    });

    // AI Daily Briefing
    setTimeout(() => {
      const todayEvents = useCalendarStore.getState().events.filter(e => 
        e.date === new Date().getDate() && 
        e.month === new Date().getMonth() && 
        e.year === new Date().getFullYear()
      ).length;
      
      const openTasks = useStickyNotesStore.getState().notes.length;

      addNotification(
        'Portfolio Assistant',
        `Good Evening Soham 👋\n\nToday's Events: ${todayEvents}\nOpen Tasks: ${openTasks}\nGitHub Contributions: 532\nWeather: 31°C\nMusic Played: 1h 12m\n\nHave a productive day 🚀`,
        'ai',
        10000
      );
    }, 2000);

    // GitHub Star
    setTimeout(() => {
      addNotification(
        'GitHub ⭐ New Star Received',
        'Someone starred your repository "portfolio-os"!',
        'system',
        6000
      );
    }, 8000);

    // Build Success
    setTimeout(() => {
      addNotification(
        'Build Successful ✓',
        'portfolio-os deployed successfully to production.',
        'system',
        6000
      );
    }, 16000);

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
    }, 26000);

  }, [addNotification, openWindow, toggleAIAssistant]);

  // Global Keyboard Shortcuts (Win+D, Win+E, Win+R, Win+X)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) { // Win key maps to metaKey. Fallback to ctrlKey for non-windows keyboards
        const key = e.key.toLowerCase();
        if (key === 'd') {
          e.preventDefault();
          // Toggle Desktop: If any window is NOT minimized, minimize all. Else, restore all.
          const { windows } = useWindowStore.getState();
          const anyVisible = windows.some(w => !w.isMinimized);
          if (anyVisible) {
            windows.forEach(w => {
              if (!w.isMinimized) useWindowStore.getState().minimizeWindow(w.id);
            });
          } else {
            windows.forEach(w => {
              if (w.isMinimized) useWindowStore.getState().restoreWindow(w.id);
            });
          }
        } else if (key === 'e') {
          e.preventDefault();
          openWindow('fileexplorer');
        } else if (key === 'r') {
          e.preventDefault();
          useDesktopStore.getState().toggleRunDialog();
        } else if (key === 'x') {
          e.preventDefault();
          useDesktopStore.getState().togglePowerUserMenu();
        } else if (key === 'w') {
          e.preventDefault();
          useWidgetStore.getState().toggleWidgetPanel();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [openWindow]);

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
        label: 'New Sticky Note', 
        icon: <DocumentRegular />, 
        onClick: () => {
          useStickyNotesStore.getState().addNote(e.clientX, e.clientY);
        }
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
      className={`no-select ${!isCustomWallpaper ? 'wallpaper-default' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        ...(isCustomWallpaper ? {
          backgroundImage: `url(${customWallpaperData})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : {})
      }}
    >
      {/* Animated Wallpaper Layer (Rendered below ambience) */}
      {animatedWallpaper && <AnimatedWallpaper type={animatedWallpaper} accentColor={accentColor} />}

      {/* Subtle desktop ambience overlay */}
      <div className="desktop-ambient" style={{ zIndex: 1, position: 'relative', pointerEvents: 'none', width: '100%', height: '100%' }} />

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



      {/* Sticky Notes Layer */}
      <StickyNotesLayer />

      {/* Windows Area */}
      <div className="windows-area">
        <AnimatePresence>
          {windows.filter(w => !w.desktop || w.desktop === useWindowStore.getState().currentDesktop).map((win) => (
            <Window key={win.id} window={win} />
          ))}
        </AnimatePresence>
      </div>

      {/* Start Menu overlay */}
      <ToastContainer />
      <SnippingToolLayer />
      <SpotlightSearch />
      <RunDialog />
      <PowerUserMenu />
      <AltTabOverlay />
      <DesktopSwitcherOverlay />
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

      {/* Background Services */}
      <BackgroundServices />
    </motion.div>
  );
}
