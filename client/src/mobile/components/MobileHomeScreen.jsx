import { useMobileStore } from '../store/useMobileStore';
import { APPS } from '../../config/apps';

import './MobileHomeScreen.css';

export default function MobileHomeScreen() {
  const { openApp, toggleAppDrawer } = useMobileStore();

  // Selected apps for the home screen grid (Android style)
  const homeApps = [
    'recruiter', 'projects', 'skills', 'resume', 
    'browser', 'vscode', 'music', 'aidashboard'
  ];

  return (
    <div className="mobile-home-screen">
      {/* Clock and Weather Widget */}
      <div className="mobile-home-clock-widget">
        <h1 className="mobile-clock-time">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h1>
        <p className="mobile-clock-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="mobile-home-weather">
          <span>Kolkata, 29°C</span>
          <span className="mobile-weather-desc">Mostly Clear</span>
        </div>
      </div>

      {/* Recruiter Mode Widgets */}
      <div className="mobile-home-widgets">
        <div className="mobile-widget-card highlight" onClick={() => openApp('recruiter')}>
          <div className="mobile-widget-icon">👤</div>
          <h3 className="mobile-widget-title">Recruiter Mode</h3>
          <p className="mobile-widget-subtitle">Hireable Dashboard</p>
        </div>
        <div className="mobile-widget-card" onClick={() => openApp('recruiter', { tab: 'resume' })}>
          <div className="mobile-widget-icon">📄</div>
          <h3 className="mobile-widget-title">Resume</h3>
          <p className="mobile-widget-subtitle">View Profile</p>
        </div>
        <div className="mobile-widget-card" onClick={() => openApp('recruiter', { tab: 'projects' })}>
          <div className="mobile-widget-icon">🚀</div>
          <h3 className="mobile-widget-title">Best Projects</h3>
          <p className="mobile-widget-subtitle">Showcase</p>
        </div>
        <div className="mobile-widget-card" onClick={() => openApp('recruiter', { tab: 'ai' })}>
          <div className="mobile-widget-icon">🤖</div>
          <h3 className="mobile-widget-title">Ask AI</h3>
          <p className="mobile-widget-subtitle">VS-31 Brain</p>
        </div>
      </div>

      {/* App Grid */}
      <div className="mobile-app-grid">
        {homeApps.map((appId) => {
          const app = APPS[appId];
          if (!app) return null;
          
          return (
            <div key={appId} className="mobile-app-icon" onClick={() => openApp(appId)}>
              <div className="mobile-app-icon-bg">
                {typeof app.icon === 'string' && app.icon.includes('.') ? (
                  <img src={app.icon} alt={app.title} width="32" height="32" />
                ) : (
                  <span style={{ fontSize: '24px' }}>{app.icon}</span>
                )}
              </div>
              <span className="mobile-app-label">{app.title.split(' ')[0]}</span>
            </div>
          );
        })}
      </div>

      {/* Swipe Up Hint */}
      <div className="mobile-swipe-hint" onClick={() => toggleAppDrawer(true)}>
        <div className="mobile-swipe-pill"></div>
        <span>Swipe up for apps</span>
      </div>
    </div>
  );
}
