// ============================================
// Portfolio OS 2026 — Taskbar
// ============================================
// Windows 11-style centered taskbar with glassmorphism.
//
// Layout (left → right):
//   [Start] [Search] ........... [Theme] [WiFi] [Vol] [Bell] [Clock]
//
// Phase 3: Only Start and Notification bell are interactive.
// Other icons are decorative.

import { useState } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useWindowStore } from '../../store/useWindowStore';
import { DESKTOP_APPS } from '../../constants';
import Clock from './Clock';
import {
  SearchRegular,
  WeatherSunnyRegular,
  WeatherMoonRegular,
  Wifi4Regular,
  Speaker2Regular,
  AlertRegular
} from '@fluentui/react-icons';

/**
 * Taskbar icon button — reusable for all tray icons
 */
function TaskbarButton({ id, children, onClick, isActive = false, isOpen = false, title }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      id={id}
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '36px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        background: isActive
          ? 'var(--color-bg-surface-hover)'
          : hovered
          ? 'var(--color-bg-surface-hover)'
          : 'transparent',
        color: 'var(--color-text-primary)',
        fontSize: '1rem',
        transition: 'background var(--transition-fast)',
        position: 'relative',
      }}
    >
      {children}
      {/* Active / Open indicator line */}
      {(isActive || isOpen) && (
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            width: isActive ? '16px' : '6px',
            height: '3px',
            borderRadius: '1.5px',
            background: isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
            transition: 'all 0.2s ease',
          }}
        />
      )}
    </button>
  );
}

/**
 * Windows logo SVG — 4 colored squares
 */
function WindowsLogo({ size = 18 }) {
  const gap = size * 0.08;
  const sq = (size - gap) / 2;
  const color = "#0078D4"; // Windows 11 blue

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x="0" y="0" width={sq} height={sq} fill={color} rx="1" />
      <rect x={sq + gap} y="0" width={sq} height={sq} fill={color} rx="1" />
      <rect x="0" y={sq + gap} width={sq} height={sq} fill={color} rx="1" />
      <rect x={sq + gap} y={sq + gap} width={sq} height={sq} fill={color} rx="1" />
    </svg>
  );
}

/**
 * Main Taskbar component
 */
export default function Taskbar() {
  const { isStartMenuOpen, toggleStartMenu, toggleNotificationCenter } =
    useDesktopStore();
  const { theme, toggleTheme } = useThemeStore();
  const windows = useWindowStore((s) => s.windows);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const openWindow = useWindowStore((s) => s.openWindow);

  const pinnedAppIds = ['mypc', 'about', 'projects', 'skills', 'terminal', 'resume', 'fileexplorer', 'settings'];

  const handleWindowClick = (win) => {
    if (win.isMinimized) {
      restoreWindow(win.id);
    } else if (activeWindowId === win.id) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  return (
    <div
      id="taskbar"
      className="no-select acrylic"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--taskbar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        borderTop: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-taskbar)',
        zIndex: 1000,
      }}
    >
      {/* Left section (Empty for widgets in future) */}
      <div style={{ flex: 1 }}></div>

      {/* Center section — Start, Search, Pinned, Open Windows */}
      <div 
        style={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', 
          alignItems: 'center', 
          gap: '2px' 
        }}
      >
        {/* Start Button */}
        <TaskbarButton
          id="taskbar-start-btn"
          onClick={toggleStartMenu}
          isActive={isStartMenuOpen}
          title="Start"
        >
          <WindowsLogo size={16} />
        </TaskbarButton>

        {/* Search Button */}
        <TaskbarButton
          id="taskbar-search-btn"
          onClick={toggleStartMenu}
          isActive={isStartMenuOpen}
          title="Search"
        >
          <SearchRegular fontSize={16} />
        </TaskbarButton>
        {/* Pinned Apps */}
        {pinnedAppIds.map((id) => {
          const app = DESKTOP_APPS.find(a => a.id === id);
          if (!app) return null;
          const openWin = windows.find(w => w.id === id);
          const isActive = openWin && activeWindowId === id && !openWin.isMinimized;
          const isOpen = !!openWin;

          return (
            <TaskbarButton
              key={`pinned-${id}`}
              id={`taskbar-pin-${id}`}
              onClick={() => {
                if (openWin) {
                  handleWindowClick(openWin);
                } else {
                  openWindow(id);
                }
              }}
              isActive={isActive}
              isOpen={isOpen}
              title={app.label}
            >
              {typeof app.icon === 'string' && (app.icon.endsWith('.ico') || app.icon.endsWith('.png') || app.icon.includes('assets/') || app.icon.startsWith('data:image/')) ? (
                <img src={app.icon} alt="" draggable={false} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '18px' }}>{app.icon}</span>
              )}
            </TaskbarButton>
          );
        })}

        {/* Unpinned Open Windows */}
        {windows.filter(win => !pinnedAppIds.includes(win.id)).map((win) => {
          const isActive = activeWindowId === win.id && !win.isMinimized;
          return (
            <TaskbarButton
              key={`win-${win.id}`}
              id={`taskbar-win-${win.id}`}
              onClick={() => handleWindowClick(win)}
              isActive={isActive}
              isOpen={true}
              title={win.title}
            >
              {typeof win.icon === 'string' && (win.icon.endsWith('.ico') || win.icon.endsWith('.png') || win.icon.includes('assets/') || win.icon.startsWith('data:image/')) ? (
                <img src={win.icon} alt="" draggable={false} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '18px' }}>{win.icon}</span>
              )}
            </TaskbarButton>
          );
        })}
      </div>

      {/* Right section — System tray */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {/* Theme toggle */}
        <TaskbarButton
          id="taskbar-theme-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            // Sun icon for switching to light
            <WeatherSunnyRegular fontSize={15} />
          ) : (
            // Moon icon for switching to dark
            <WeatherMoonRegular fontSize={14} />
          )}
        </TaskbarButton>

        {/* Wi-Fi (decorative) */}
        <TaskbarButton id="taskbar-wifi" title="Wi-Fi">
          <Wifi4Regular fontSize={18} />
        </TaskbarButton>

        {/* Volume (decorative) */}
        <TaskbarButton id="taskbar-volume" title="Volume">
          <Speaker2Regular fontSize={18} />
        </TaskbarButton>

        {/* Notification bell */}
        <TaskbarButton
          id="taskbar-notifications-btn"
          onClick={toggleNotificationCenter}
          title="Notifications"
        >
          <AlertRegular fontSize={18} />
        </TaskbarButton>

        {/* System clock */}
        <Clock />
      </div>
    </div>
  );
}
