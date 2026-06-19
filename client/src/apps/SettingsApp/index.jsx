import { useState, useRef } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useSoundStore } from '../../store/useSoundStore';
import { useWidgetStore } from '../../store/useWidgetStore';
import { APP_NAME, APP_VERSION, APP_AUTHOR, THEMES } from '../../constants';
import { compressImage } from '../../utils/imageUtils';
import { exportSettings, importSettings } from '../../utils/backupUtils';
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
  { id: 'default', name: 'Bloom', url: '' },
];

const SIDEBAR_ITEMS = [
  { id: 'personalization', label: 'Personalization', icon: '🎨' },
  { id: 'taskbar', label: 'Taskbar', icon: '➖' },
  { id: 'widgets', label: 'Widgets', icon: '🧩' },
  { id: 'lockscreen', label: 'Lock Screen', icon: '🔒' },
  { id: 'sound', label: 'Sound', icon: '🔊' },
  { id: 'startup', label: 'Startup Apps', icon: '🚀' },
  { id: 'accessibility', label: 'Accessibility', icon: '👁️' },
  { id: 'backup', label: 'Backup & Restore', icon: '💾' },
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
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Stores
  const themeStore = useThemeStore();
  const desktopStore = useDesktopStore();
  const soundStore = useSoundStore();
  const widgetStore = useWidgetStore();

  const handleCustomWallpaperUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await compressImage(file, 1920, 1080, 0.8);
        const id = `custom_${Date.now()}`;
        themeStore.addCustomWallpaper(id, dataUrl);
        themeStore.setWallpaper(id);
      } catch (err) {
        console.error("Failed to upload wallpaper:", err);
      }
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await compressImage(file, 256, 256, 0.8);
        desktopStore.setLockScreenAvatar(dataUrl);
      } catch (err) {
        console.error("Failed to upload avatar:", err);
      }
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importSettings(file);
      } catch (err) {
        console.error("Failed to import settings:", err);
        alert("Invalid backup file.");
      }
    }
  };

  return (
    <div className="settings-app">
      {/* Sidebar */}
      <div className="settings-sidebar">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`settings-sidebar-item ${activeSection === item.id ? 'active' : ''}`}
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
              <p className="settings-section-desc">Themes, Accents, and Wallpapers</p>
            </div>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Theme Engine</span>
                <span className="settings-row-hint">Currently: {themeStore.theme}</span>
              </div>
              <select 
                value={themeStore.theme} 
                onChange={(e) => themeStore.setTheme(e.target.value)}
                style={{ background: 'var(--color-bg-surface)', color: 'white', padding: '4px 8px' }}
              >
                <option value="dark">Windows Dark</option>
                <option value="light">Windows Light</option>
                <option value="oled">Pure Black (OLED)</option>
                <option value="hacker">Hacker Mode</option>
                <option value="vscode">VS Code Dark</option>
              </select>
            </div>

            <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="settings-row-info">
                <span className="settings-row-label">Accent Color</span>
              </div>
              <div className="settings-accent-grid">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    className={`settings-accent-swatch ${themeStore.accentColor === color.value ? 'active' : ''}`}
                    style={{ background: color.value }}
                    title={color.name}
                    onClick={() => themeStore.setAccentColor(color.value)}
                  />
                ))}
              </div>
            </div>

            <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="settings-row-info">
                <span className="settings-row-label">Wallpaper Engine</span>
              </div>
              <div className="settings-wallpaper-grid">
                {WALLPAPERS.map((wp) => (
                  <div
                    key={wp.id}
                    className={`settings-wallpaper-item wallpaper-default ${themeStore.wallpaper === wp.id ? 'active' : ''}`}
                    onClick={() => themeStore.setWallpaper(wp.id)}
                    title={wp.name}
                  />
                ))}
                {themeStore.customWallpapers.map((wp) => (
                  <div
                    key={wp.id}
                    className={`settings-wallpaper-item ${themeStore.wallpaper === wp.id ? 'active' : ''}`}
                    onClick={() => themeStore.setWallpaper(wp.id)}
                    style={{ backgroundImage: `url(${wp.dataUrl})`, backgroundSize: 'cover' }}
                  />
                ))}
                <button 
                  className="settings-wallpaper-item" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-surface)' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  + Upload
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleCustomWallpaperUpload} />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Wallpaper Slideshow</span>
              </div>
              <ToggleSwitch isOn={themeStore.wallpaperSlideshow} onToggle={() => themeStore.setWallpaperSlideshow(!themeStore.wallpaperSlideshow)} />
            </div>
            {themeStore.wallpaperSlideshow && (
              <div className="settings-row">
                <div className="settings-row-info"><span className="settings-row-label">Slideshow Interval (Minutes)</span></div>
                <select value={themeStore.slideshowInterval} onChange={(e) => themeStore.setSlideshowInterval(Number(e.target.value))}>
                  <option value={1}>1 Minute</option>
                  <option value={5}>5 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            )}

            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Animated Wallpaper</span>
                <span className="settings-row-hint">HTML5 Canvas Animations</span>
              </div>
              <select 
                value={themeStore.animatedWallpaper || 'none'} 
                onChange={(e) => themeStore.setAnimatedWallpaper(e.target.value === 'none' ? null : e.target.value)}
                style={{ background: 'var(--color-bg-surface)', color: 'white', padding: '4px 8px' }}
              >
                <option value="none">None (Static)</option>
                <option value="matrix">Matrix Rain</option>
                <option value="particles">Constellation Particles</option>
                <option value="bubbles">Floating Bubbles</option>
              </select>
            </div>
          </>
        )}

        {/* Taskbar */}
        {activeSection === 'taskbar' && (
          <>
            <div>
              <h2 className="settings-section-title">➖ Taskbar</h2>
              <p className="settings-section-desc">Taskbar behaviors and widgets</p>
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Taskbar Alignment</span></div>
              <select value={desktopStore.taskbarAlignment} onChange={(e) => desktopStore.setTaskbarAlignment(e.target.value)}>
                <option value="center">Center</option>
                <option value="left">Left</option>
              </select>
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Taskbar Size</span></div>
              <select value={desktopStore.taskbarSize} onChange={(e) => desktopStore.setTaskbarSize(e.target.value)}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Auto Hide Taskbar</span></div>
              <ToggleSwitch isOn={desktopStore.taskbarAutoHide} onToggle={() => desktopStore.setTaskbarAutoHide(!desktopStore.taskbarAutoHide)} />
            </div>
            
            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Show Seconds in Clock</span></div>
              <ToggleSwitch isOn={desktopStore.showSeconds} onToggle={() => desktopStore.setShowSeconds(!desktopStore.showSeconds)} />
            </div>
            
            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Show Weather Widget</span></div>
              <ToggleSwitch isOn={desktopStore.showWeather} onToggle={() => desktopStore.setShowWeather(!desktopStore.showWeather)} />
            </div>
          </>
        )}

        {/* Lock Screen */}
        {activeSection === 'lockscreen' && (
          <>
            <div>
              <h2 className="settings-section-title">🔒 Lock Screen</h2>
              <p className="settings-section-desc">Customize your welcome experience</p>
            </div>
            
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Custom Avatar</span>
                <span className="settings-row-hint">Upload a profile picture</span>
              </div>
              <button onClick={() => avatarInputRef.current?.click()}>Upload Avatar</button>
              <input type="file" accept="image/*" ref={avatarInputRef} style={{ display: 'none' }} onChange={handleAvatarUpload} />
            </div>
            
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Welcome Text</span>
              </div>
              <input 
                type="text" 
                value={desktopStore.lockScreenText} 
                onChange={(e) => desktopStore.setLockScreenText(e.target.value)} 
                style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'white', padding: '4px 8px' }}
              />
            </div>
          </>
        )}

        {/* Sound */}
        {activeSection === 'sound' && (
          <>
            <div>
              <h2 className="settings-section-title">🔊 Sound</h2>
              <p className="settings-section-desc">System sounds and volume</p>
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Enable System Sounds</span></div>
              <ToggleSwitch isOn={soundStore.soundEnabled} onToggle={() => soundStore.setSoundEnabled(!soundStore.soundEnabled)} />
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Sound Theme</span></div>
              <select value={soundStore.soundTheme} onChange={(e) => soundStore.setSoundTheme(e.target.value)}>
                <option value="windows11">Windows 11</option>
                <option value="macos">macOS</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="silent">Silent</option>
              </select>
            </div>
          </>
        )}

        {/* Widgets */}
        {activeSection === 'widgets' && (
          <>
            <div>
              <h2 className="settings-section-title">🧩 Widgets</h2>
              <p className="settings-section-desc">Manage your desktop widgets</p>
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">GitHub Pro</span></div>
              <ToggleSwitch 
                isOn={widgetStore.activeWidgets.includes('github_pro')} 
                onToggle={() => widgetStore.setWidgetVisibility('github_pro', !widgetStore.activeWidgets.includes('github_pro'))} 
              />
            </div>
            
            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Music</span></div>
              <ToggleSwitch 
                isOn={widgetStore.activeWidgets.includes('music')} 
                onToggle={() => widgetStore.setWidgetVisibility('music', !widgetStore.activeWidgets.includes('music'))} 
              />
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">AI Assistant</span></div>
              <ToggleSwitch 
                isOn={widgetStore.activeWidgets.includes('ai_assistant')} 
                onToggle={() => widgetStore.setWidgetVisibility('ai_assistant', !widgetStore.activeWidgets.includes('ai_assistant'))} 
              />
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Placement Tracker</span></div>
              <ToggleSwitch 
                isOn={widgetStore.activeWidgets.includes('placement_tracker')} 
                onToggle={() => widgetStore.setWidgetVisibility('placement_tracker', !widgetStore.activeWidgets.includes('placement_tracker'))} 
              />
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Recruiter</span></div>
              <ToggleSwitch 
                isOn={widgetStore.activeWidgets.includes('recruiter')} 
                onToggle={() => widgetStore.setWidgetVisibility('recruiter', !widgetStore.activeWidgets.includes('recruiter'))} 
              />
            </div>
          </>
        )}

        {/* Startup Apps */}
        {activeSection === 'startup' && (
          <>
            <div>
              <h2 className="settings-section-title">🚀 Startup Apps</h2>
              <p className="settings-section-desc">Choose which apps launch when you boot the OS</p>
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">AI Assistant</span></div>
              <ToggleSwitch 
                isOn={desktopStore.startupApps.includes('aiassistant')} 
                onToggle={() => desktopStore.toggleStartupApp('aiassistant')} 
              />
            </div>
            
            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">File Explorer</span></div>
              <ToggleSwitch 
                isOn={desktopStore.startupApps.includes('fileexplorer')} 
                onToggle={() => desktopStore.toggleStartupApp('fileexplorer')} 
              />
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Terminal</span></div>
              <ToggleSwitch 
                isOn={desktopStore.startupApps.includes('terminal')} 
                onToggle={() => desktopStore.toggleStartupApp('terminal')} 
              />
            </div>
          </>
        )}

        {/* Accessibility */}
        {activeSection === 'accessibility' && (
          <>
            <div>
              <h2 className="settings-section-title">👁️ Accessibility</h2>
              <p className="settings-section-desc">Vision and motion settings</p>
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Text Scale (%)</span></div>
              <select value={desktopStore.textSize} onChange={(e) => desktopStore.setTextSize(Number(e.target.value))}>
                <option value={100}>100% (Default)</option>
                <option value={125}>125%</option>
                <option value={150}>150%</option>
              </select>
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Window Animations</span></div>
              <ToggleSwitch isOn={desktopStore.windowAnimations} onToggle={() => desktopStore.setWindowAnimations(!desktopStore.windowAnimations)} />
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">Reduce Motion</span></div>
              <ToggleSwitch isOn={desktopStore.reduceMotion} onToggle={() => desktopStore.setReduceMotion(!desktopStore.reduceMotion)} />
            </div>

            <div className="settings-row">
              <div className="settings-row-info"><span className="settings-row-label">High Contrast</span></div>
              <ToggleSwitch isOn={desktopStore.highContrast} onToggle={() => desktopStore.setHighContrast(!desktopStore.highContrast)} />
            </div>
          </>
        )}

        {/* Backup & Restore */}
        {activeSection === 'backup' && (
          <>
            <div>
              <h2 className="settings-section-title">💾 Backup & Restore</h2>
              <p className="settings-section-desc">Save your entire OS state or restore from a previous backup.</p>
            </div>

            <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <div className="settings-row-info">
                <span className="settings-row-label">Export Backup</span>
                <span className="settings-row-hint">Downloads a JSON file containing all your themes, wallpapers, and desktop layout.</span>
              </div>
              <button 
                onClick={exportSettings}
                style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Export Settings
              </button>
            </div>

            <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <div className="settings-row-info">
                <span className="settings-row-label">Import Backup</span>
                <span className="settings-row-hint">Warning: This will overwrite your current state and reload the OS.</span>
              </div>
              <button 
                onClick={() => document.getElementById('backup-upload-input')?.click()}
                style={{ background: 'var(--color-bg-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Import Settings
              </button>
              <input 
                id="backup-upload-input" 
                type="file" 
                accept=".json" 
                style={{ display: 'none' }} 
                onChange={handleImportBackup} 
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
                <span className="settings-about-label">Developer</span>
                <span className="settings-about-value">{APP_AUTHOR}</span>
              </div>
              <div className="settings-about-row">
                <span className="settings-about-label">Uptime</span>
                <span className="settings-about-value">{Math.floor((Date.now() - desktopStore.bootTime) / 60000)} minutes</span>
              </div>
            </div>

            <div>
              <h3 className="settings-row-label" style={{ marginBottom: '8px' }}>Tech Stack</h3>
              <div className="settings-tech-grid">
                {TECH_STACK.map((tech) => (
                  <span key={tech} className="settings-tech-chip">{tech}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
