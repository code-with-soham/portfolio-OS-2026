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
import Clock from './Clock';

/**
 * Taskbar icon button — reusable for all tray icons
 */
function TaskbarButton({ id, children, onClick, isActive = false, title }) {
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
      {/* Active indicator dot */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            width: '16px',
            height: '3px',
            borderRadius: '2px',
            background: 'var(--color-accent)',
          }}
        />
      )}
    </button>
  );
}

/**
 * Windows logo SVG — 4 colored squares
 */
function WindowsLogo({ size = 16 }) {
  const gap = size * 0.06;
  const sq = (size - gap) / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x="0" y="0" width={sq} height={sq} fill="#f25022" rx="0.5" />
      <rect x={sq + gap} y="0" width={sq} height={sq} fill="#7fba00" rx="0.5" />
      <rect x="0" y={sq + gap} width={sq} height={sq} fill="#00a4ef" rx="0.5" />
      <rect x={sq + gap} y={sq + gap} width={sq} height={sq} fill="#ffb900" rx="0.5" />
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

  return (
    <div
      id="taskbar"
      className="no-select glass"
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
      {/* Left section — Start + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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
        <TaskbarButton id="taskbar-search-btn" title="Search">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </TaskbarButton>
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
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          ) : (
            // Moon icon for switching to dark
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </TaskbarButton>

        {/* Wi-Fi (decorative) */}
        <TaskbarButton id="taskbar-wifi" title="Wi-Fi">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </TaskbarButton>

        {/* Volume (decorative) */}
        <TaskbarButton id="taskbar-volume" title="Volume">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </TaskbarButton>

        {/* Notification bell */}
        <TaskbarButton
          id="taskbar-notifications-btn"
          onClick={toggleNotificationCenter}
          title="Notifications"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </TaskbarButton>

        {/* System clock */}
        <Clock />
      </div>
    </div>
  );
}
