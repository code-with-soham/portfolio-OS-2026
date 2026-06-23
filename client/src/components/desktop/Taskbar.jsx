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

import { useState, memo, useEffect } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useWindowStore } from '../../store/useWindowStore';
import { DESKTOP_APPS } from '../../constants';
import Clock from './Clock';
import {
  SearchRegular,
  WeatherSunnyRegular,
  WeatherMoonRegular,
  Wifi1Regular,
  Speaker2Regular,
  AlertRegular,
  PlayRegular,
  PauseRegular,
  PreviousRegular,
  NextRegular,
  SquareMultipleRegular
} from '@fluentui/react-icons';
import { useMusicStore } from '../../store/useMusicStore';
import { useSystemAudioStore } from '../../store/useSystemAudioStore';
import { useWeatherStore } from '../../store/useWeatherStore';

/**
 * Taskbar icon button — reusable for all tray icons
 */
const TaskbarButton = memo(function TaskbarButton({ id, children, onClick, isActive = false, isOpen = false, title, style = {} }) {
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
        ...style,
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
});

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
  const { isStartMenuOpen, toggleStartMenu, isNotificationCenterOpen, toggleNotificationCenter, isQuickSettingsOpen, toggleQuickSettings } =
    useDesktopStore();
  const { theme } = useThemeStore();
  const windows = useWindowStore((s) => s.windows);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const openWindow = useWindowStore((s) => s.openWindow);
  const toggleMute = useSystemAudioStore((s) => s.toggleMute);

  // System Status
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    let batteryPromise = null;
    
    if ('getBattery' in navigator) {
      batteryPromise = navigator.getBattery().then(battery => {
        if (!battery) return null;
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        
        updateBattery();
        if (typeof battery.addEventListener === 'function') {
          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);
          
          return () => {
            battery.removeEventListener('levelchange', updateBattery);
            battery.removeEventListener('chargingchange', updateBattery);
          };
        }
        return null;
      }).catch(err => {
        console.warn('Battery API error:', err);
        return null;
      });
    }

    // Weather Fetch on Mount
    useWeatherStore.getState().fetchWeather();

    return () => {
      if (batteryPromise) {
        batteryPromise.then(cleanup => {
          if (cleanup) cleanup();
        });
      }
    };
  }, []);

  // Music Store
  const { isPlaying, togglePlayPause, nextSong, prevSong, playlist, currentSongIndex } = useMusicStore();
  const { volume, isMuted } = useSystemAudioStore();
  const hasMusic = playlist && playlist.length > 0;
  const currentSong = hasMusic ? playlist[Number(currentSongIndex)] : null;

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const pinnedAppIds = ['mypc', 'about', 'projects', 'skills', 'terminal', 'resume', 'fileexplorer', 'settings', 'placementprep'];

  const handleWindowClick = (win) => {
    if (win.isMinimized) {
      restoreWindow(win.id);
    } else if (activeWindowId === win.id) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  const taskbarAlignment = useDesktopStore(s => s.taskbarAlignment);
  const taskbarSize = useDesktopStore(s => s.taskbarSize);
  const taskbarAutoHide = useDesktopStore(s => s.taskbarAutoHide);
  const showSeconds = useDesktopStore(s => s.showSeconds);
  const showWeather = useDesktopStore(s => s.showWeather);

  // Map taskbar size to heights
  const sizeMap = { small: '36px', medium: '48px', large: '60px' };
  const currentHeight = sizeMap[taskbarSize] || '48px';

  return (
    <div
      id="taskbar"
      className="no-select acrylic"
      onMouseEnter={() => {
        if (taskbarAutoHide) document.getElementById('taskbar').style.transform = 'translateY(0)';
      }}
      onMouseLeave={() => {
        if (taskbarAutoHide && !isStartMenuOpen && !isNotificationCenterOpen && !isQuickSettingsOpen) {
          document.getElementById('taskbar').style.transform = 'translateY(100%)';
        }
      }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: currentHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        borderTop: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-taskbar)',
        zIndex: 1000,
        transition: 'transform 0.3s ease, height 0.3s ease',
        transform: taskbarAutoHide && !isStartMenuOpen && !isNotificationCenterOpen && !isQuickSettingsOpen ? 'translateY(100%)' : 'translateY(0)',
      }}
    >
      {/* Left section */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {showWeather && (
          <div 
            onClick={() => openWindow('weather')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '4px 12px', 
              color: 'var(--color-text-secondary)', 
              fontSize: '0.8rem',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title="Open Weather Pro"
          >
            {useWeatherStore.getState().currentWeather ? (
              <>
                <img 
                  src={`https://openweathermap.org/img/wn/${useWeatherStore.getState().currentWeather.icon}.png`} 
                  alt="weather" 
                  style={{ width: '20px', height: '20px' }} 
                />
                <span>{useWeatherStore.getState().currentWeather.temp}°C {useWeatherStore.getState().currentWeather.city}</span>
              </>
            ) : (
              <>
                <WeatherSunnyRegular fontSize={18} />
                <span>Loading...</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Center/Left section — Start, Search, Pinned, Open Windows */}
      <div 
        style={{ 
          ...(taskbarAlignment === 'center' ? {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          } : {
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-start',
            marginLeft: showWeather ? '0' : '12px'
          }),
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

        {/* Desktop Switcher */}
        <TaskbarButton
          id="taskbar-desktop-btn"
          onClick={() => useDesktopStore.getState().toggleDesktopSwitcher()}
          isActive={useDesktopStore.getState().isDesktopSwitcherOpen}
          title="Task View / Virtual Desktops"
        >
          <SquareMultipleRegular fontSize={18} />
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
        {/* Media Controls (conditionally rendered) */}
        {hasMusic && currentSong && (
          <div 
            style={{ display: 'flex', alignItems: 'center', marginRight: '8px', gap: '2px' }}
            title={`Artist: ${currentSong.artist}\nDuration: ${currentSong.duration}\nVolume: ${isMuted ? 0 : Math.round(volume * 100)}%`}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginRight: '8px',
              padding: '0 8px',
              maxWidth: '120px',
              overflow: 'hidden'
            }}>
              <span style={{ fontSize: '12px' }}>🎵</span>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {currentSong.title}
              </span>
            </div>
            <TaskbarButton id="taskbar-media-prev" onClick={prevSong} title="Previous">
              <PreviousRegular fontSize={14} />
            </TaskbarButton>
            <TaskbarButton id="taskbar-media-play" onClick={togglePlayPause} title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <PauseRegular fontSize={16} /> : <PlayRegular fontSize={16} />}
            </TaskbarButton>
            <TaskbarButton id="taskbar-media-next" onClick={nextSong} title="Next">
              <NextRegular fontSize={14} />
            </TaskbarButton>
            <div style={{ width: '1px', height: '16px', background: 'var(--color-border)', margin: '0 4px' }} />
          </div>
        )}

        {/* System Status Area (Quick Settings) */}
        <TaskbarButton
          id="taskbar-quick-settings-btn"
          onClick={toggleQuickSettings}
          isActive={isQuickSettingsOpen}
          title="Quick Settings"
          style={{ width: 'auto', padding: '0 8px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi1Regular fontSize={16} />
            <Speaker2Regular fontSize={16} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{batteryLevel}%</span>
              {isCharging && <span style={{ fontSize: '10px' }}>⚡</span>}
            </div>
          </div>
        </TaskbarButton>

        {/* Notification bell */}
        <TaskbarButton
          id="taskbar-notifications-btn"
          onClick={toggleNotificationCenter}
          title="Notifications"
        >
          <AlertRegular fontSize={18} />
        </TaskbarButton>

        {/* Full Screen Toggle */}
        <TaskbarButton
          id="taskbar-fullscreen-btn"
          onClick={toggleFullScreen}
          title="Toggle Full Screen (F11/Esc)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
        </TaskbarButton>

        {/* System clock */}
        <Clock showSeconds={showSeconds} />
      </div>
    </div>
  );
}
