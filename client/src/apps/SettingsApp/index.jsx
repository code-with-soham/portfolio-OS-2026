// ============================================
// Portfolio OS 2026 — Settings App
// ============================================
// System settings with theme toggle, accent color picker,
// wallpaper selector, and about section.

import { useState } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { APP_NAME, APP_VERSION, APP_AUTHOR, THEMES } from '../../constants';
import './SettingsApp.css';

const ACCENT_COLORS = [
  { name: 'Blue', value: '#0078d4' },
  { name: 'Purple', value: '#8764b8' },
  { name: 'Teal', value: '#00b294' },
  { name: 'Red', value: '#e74856' },
  { name: 'Orange', value: '#f7630c' },
  { name: 'Green', value: '#107c10' },
  { name: 'Pink', value: '#e3008c' },
  { name: 'Gold', value: '#c19c00' },
];

const WALLPAPERS = [
  { id: 'default', name: 'Bloom', className: 'wallpaper-default' },
];

const SIDEBAR_ITEMS = [
  { id: 'personalization', label: 'Personalization', icon: '🎨' },
  { id: 'system', label: 'System', icon: '💻' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

const TECH_STACK = [
  'React 19', 'Vite 6', 'Zustand 5', 'Framer Motion 12',
  'TailwindCSS 4', 'Express.js', 'Node.js', 'React Query 5',
];

function ToggleSwitch({ isOn, onToggle }) {
  return (
    <button
      className={`settings-toggle ${isOn ? 'on' : 'off'}`}
      onClick={onToggle}
    >
      <span className="settings-toggle-knob" />
    </button>
  );
}

export default function SettingsApp() {
  const [activeSection, setActiveSection] = useState('personalization');
  const [accentColor, setAccentColor] = useState('#0078d4');
  const [animationsOn, setAnimationsOn] = useState(true);
  const [soundOn, setSoundOn] = useState(false);

  const { theme, setTheme, wallpaper, setWallpaper } = useThemeStore();

  const handleAccentChange = (color) => {
    setAccentColor(color);
    // Apply accent color to CSS variables
    document.documentElement.style.setProperty('--color-accent', color);
    // Generate a slightly darker hover variant
    document.documentElement.style.setProperty(
      '--color-accent-hover',
      adjustBrightness(color, -20)
    );
  };

  return (
    <div className="settings-app">
      {/* Sidebar */}
      <div className="settings-sidebar">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`settings-sidebar-item ${
              activeSection === item.id ? 'active' : ''
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="settings-sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="settings-content">
        {/* Personalization */}
        {activeSection === 'personalization' && (
          <>
            <div>
              <h2 className="settings-section-title">🎨 Personalization</h2>
              <p className="settings-section-desc">Customize the look and feel of your OS</p>
            </div>

            {/* Theme */}
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Theme</span>
                <span className="settings-row-hint">
                  Currently: {theme === THEMES.DARK ? 'Dark' : 'Light'} mode
                </span>
              </div>
              <ToggleSwitch
                isOn={theme === THEMES.DARK}
                onToggle={() =>
                  setTheme(theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK)
                }
              />
            </div>

            {/* Accent Color */}
            <div>
              <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div className="settings-row-info">
                  <span className="settings-row-label">Accent Color</span>
                  <span className="settings-row-hint">Choose your system accent color</span>
                </div>
                <div className="settings-accent-grid">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.name}
                      className={`settings-accent-swatch ${
                        accentColor === color.value ? 'active' : ''
                      }`}
                      style={{ background: color.value }}
                      title={color.name}
                      onClick={() => handleAccentChange(color.value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Wallpaper */}
            <div>
              <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div className="settings-row-info">
                  <span className="settings-row-label">Wallpaper</span>
                  <span className="settings-row-hint">Select your desktop background</span>
                </div>
                <div className="settings-wallpaper-grid">
                  {WALLPAPERS.map((wp) => (
                    <div
                      key={wp.id}
                      className={`settings-wallpaper-item ${wp.className} ${
                        wallpaper === wp.id ? 'active' : ''
                      }`}
                      onClick={() => setWallpaper(wp.id)}
                      title={wp.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* System */}
        {activeSection === 'system' && (
          <>
            <div>
              <h2 className="settings-section-title">💻 System</h2>
              <p className="settings-section-desc">System preferences and behavior</p>
            </div>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Animations</span>
                <span className="settings-row-hint">
                  Enable smooth transitions and animations
                </span>
              </div>
              <ToggleSwitch
                isOn={animationsOn}
                onToggle={() => setAnimationsOn(!animationsOn)}
              />
            </div>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Sound Effects</span>
                <span className="settings-row-hint">
                  Play sounds for system events
                </span>
              </div>
              <ToggleSwitch
                isOn={soundOn}
                onToggle={() => setSoundOn(!soundOn)}
              />
            </div>
          </>
        )}

        {/* About */}
        {activeSection === 'about' && (
          <>
            <div>
              <h2 className="settings-section-title">ℹ️ About</h2>
              <p className="settings-section-desc">System information and credits</p>
            </div>

            <div className="settings-about-card">
              <div className="settings-about-row">
                <span className="settings-about-label">OS Name</span>
                <span className="settings-about-value">{APP_NAME}</span>
              </div>
              <div className="settings-about-row">
                <span className="settings-about-label">Version</span>
                <span className="settings-about-value">v{APP_VERSION}</span>
              </div>
              <div className="settings-about-row">
                <span className="settings-about-label">Build</span>
                <span className="settings-about-value">2026.06.14</span>
              </div>
              <div className="settings-about-row">
                <span className="settings-about-label">Developer</span>
                <span className="settings-about-value">{APP_AUTHOR}</span>
              </div>
            </div>

            <div>
              <h3 className="settings-row-label" style={{ marginBottom: '8px' }}>
                Tech Stack
              </h3>
              <div className="settings-tech-grid">
                {TECH_STACK.map((tech) => (
                  <span key={tech} className="settings-tech-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Utility: adjust hex color brightness
 */
function adjustBrightness(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
