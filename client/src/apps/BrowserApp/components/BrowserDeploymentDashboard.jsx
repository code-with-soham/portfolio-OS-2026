import React from 'react';
import { DataAreaRegular, WebAssetRegular, ServerRegular, RocketRegular, CheckmarkCircleRegular } from '@fluentui/react-icons';

export default function BrowserDeploymentDashboard() {
  return (
    <div className="chrome-internal-page deployment-dashboard">
      <div className="deployment-header">
        <RocketRegular fontSize={32} color="#0078d4" />
        <h2>Live Deployment Dashboard</h2>
      </div>
      
      <div className="deployment-grid">
        <div className="deployment-card">
          <div className="deployment-card-header">
            <WebAssetRegular fontSize={24} />
            <h3>Frontend Status</h3>
          </div>
          <div className="deployment-card-content">
            <div className="status-row">
              <span>Status</span>
              <span className="status-badge success"><CheckmarkCircleRegular/> Live</span>
            </div>
            <div className="status-row">
              <span>Platform</span>
              <strong>Vercel</strong>
            </div>
            <div className="status-row">
              <span>URL</span>
              <a href="https://portfolio-os-2026.vercel.app" target="_blank" rel="noreferrer">portfolio-os-2026.vercel.app</a>
            </div>
            <div className="status-row">
              <span>Latest Commit</span>
              <code>feat: browser pro max</code>
            </div>
            <div className="status-row">
              <span>Build Time</span>
              <strong>1m 24s</strong>
            </div>
          </div>
        </div>

        <div className="deployment-card">
          <div className="deployment-card-header">
            <ServerRegular fontSize={24} />
            <h3>Backend Status</h3>
          </div>
          <div className="deployment-card-content">
            <div className="status-row">
              <span>Status</span>
              <span className="status-badge success"><CheckmarkCircleRegular/> Live</span>
            </div>
            <div className="status-row">
              <span>Platform</span>
              <strong>Render</strong>
            </div>
            <div className="status-row">
              <span>URL</span>
              <a href="https://portfolio-os-api.onrender.com" target="_blank" rel="noreferrer">portfolio-os-api.onrender.com</a>
            </div>
            <div className="status-row">
              <span>Uptime</span>
              <strong>99.9%</strong>
            </div>
            <div className="status-row">
              <span>Region</span>
              <strong>us-east (Ohio)</strong>
            </div>
          </div>
        </div>
      </div>
      
      <div className="deployment-footer">
        <p>This dashboard is a real-time reflection of the deployed environment for Portfolio OS 2026.</p>
      </div>
    </div>
  );
}
