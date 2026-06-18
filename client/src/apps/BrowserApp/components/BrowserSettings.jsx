import React from 'react';

export default function BrowserSettings() {
  return (
    <div className="chrome-internal-page">
      <div className="chrome-settings-sidebar">
        <h3>Settings</h3>
        <ul>
          <li className="active">You and Google</li>
          <li>Autofill and passwords</li>
          <li>Privacy and security</li>
          <li>Performance</li>
          <li>Appearance</li>
          <li>Search engine</li>
          <li>Default browser</li>
          <li>Downloads</li>
        </ul>
      </div>
      <div className="chrome-settings-content">
        <h2>Appearance</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <strong>Theme</strong>
              <div className="text-secondary">Portfolio Chrome Dark Mode</div>
            </div>
          </div>
          <div className="settings-row">
            <div>
              <strong>Show bookmarks bar</strong>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <h2>Search engine</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <strong>Search engine used in the address bar</strong>
            </div>
            <select className="settings-select" defaultValue="portfolio">
              <option value="google">Google</option>
              <option value="portfolio">Portfolio AI</option>
              <option value="bing">Bing</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
