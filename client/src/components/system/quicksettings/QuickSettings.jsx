import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../../store/useDesktopStore';
import { useThemeStore } from '../../../store/useThemeStore';
import { useUIStore } from '../../../store/useUIStore';
import { useSystemAudioStore } from '../../../store/useSystemAudioStore';
import {
  Wifi1Regular,
  BluetoothRegular,
  WeatherMoonRegular,
  Speaker2Regular,
  SparkleRegular,
  WeatherSunnyRegular,
  WifiOffRegular,
  SpeakerOffRegular
} from '@fluentui/react-icons';

/**
 * Quick setting toggle tile
 */
function QuickSettingTile({ id, label, icon, activeIcon, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 8px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: active
          ? 'var(--color-accent)'
          : hovered
          ? 'var(--color-bg-surface-hover)'
          : 'var(--color-bg-surface)',
        color: active ? '#ffffff' : 'var(--color-text-primary)',
        transition: 'all var(--transition-fast)',
        minWidth: '0',
      }}
    >
      <div style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {active && activeIcon ? activeIcon : icon}
      </div>
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 400,
          fontFamily: 'var(--font-family)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * Range slider for Quick Settings
 */
function Slider({ icon, value, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '4px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)' }}>
        {icon}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => {
          if (onChange) onChange(parseFloat(e.target.value));
        }}
        style={{
          flex: 1,
          height: '4px',
          appearance: 'none',
          background: `linear-gradient(to right, var(--color-accent) ${value}%, var(--color-bg-surface) ${value}%)`,
          borderRadius: '2px',
          outline: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

export default function QuickSettings() {
  const { isQuickSettingsOpen, closeQuickSettings } = useDesktopStore();
  const { theme, toggleTheme } = useThemeStore();
  const { animationsEnabled, toggleAnimations } = useUIStore();
  const { volume, isMuted, setVolume, toggleMute } = useSystemAudioStore();

  // Decorative state for Phase 3
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(false);

  return (
    <AnimatePresence>
      {isQuickSettingsOpen && (
        <>
          {/* Invisible backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickSettings}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
            }}
          />

          {/* Flyout Panel */}
          <motion.div
            id="quick-settings-panel"
            className="no-select acrylic"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--taskbar-height) + 12px)',
              right: '12px',
              width: 'min(360px, calc(100vw - 24px))',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-flyout)',
              overflow: 'hidden',
              zIndex: 950,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 20px',
              gap: '24px',
            }}
          >
            {/* Toggles Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}
            >
              <QuickSettingTile
                id="wifi"
                label={wifiOn ? 'Wi-Fi' : 'Wi-Fi Off'}
                icon={<WifiOffRegular />}
                activeIcon={<Wifi1Regular />}
                active={wifiOn}
                onClick={() => setWifiOn(!wifiOn)}
              />
              <QuickSettingTile
                id="bluetooth"
                label={btOn ? 'Bluetooth' : 'Bluetooth Off'}
                icon={<BluetoothRegular />}
                activeIcon={<BluetoothRegular />}
                active={btOn}
                onClick={() => setBtOn(!btOn)}
              />
              <QuickSettingTile
                id="theme"
                label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                icon={<WeatherSunnyRegular />}
                activeIcon={<WeatherMoonRegular />}
                active={theme === 'dark'}
                onClick={toggleTheme}
              />
              <QuickSettingTile
                id="sound"
                label={!isMuted ? 'Sound' : 'Muted'}
                icon={<SpeakerOffRegular />}
                activeIcon={<Speaker2Regular />}
                active={!isMuted}
                onClick={toggleMute}
              />
              <QuickSettingTile
                id="animation"
                label={animationsEnabled ? 'Animations On' : 'Animations Off'}
                icon={<SparkleRegular />}
                activeIcon={<SparkleRegular />}
                active={animationsEnabled}
                onClick={toggleAnimations}
              />
            </div>

            {/* Sliders Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Slider icon={<WeatherSunnyRegular fontSize={18} />} value={70} onChange={() => {}} />
              <Slider icon={!isMuted ? <Speaker2Regular fontSize={18} /> : <SpeakerOffRegular fontSize={18} />} value={Math.round(volume * 100)} onChange={(val) => {
                setVolume(val / 100);
              }} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
