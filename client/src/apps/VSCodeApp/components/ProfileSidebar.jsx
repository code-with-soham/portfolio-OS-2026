import React from 'react';
import './ProfileSidebar.css';
import myPhoto from '../../../assets/icons/logos/myPhoto.jpg';
import { MailRegular, LinkRegular, CheckmarkCircleRegular, ClockRegular } from '@fluentui/react-icons';
import { useDataStore } from '../../../store/useDataStore';

export default function ProfileSidebar() {
  const getParsedProfile = useDataStore(s => s.getParsedProfile);
  const parsedProfile = getParsedProfile();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sohamkundu84@gmail.com');
    alert('Email copied to clipboard!');
  };

  const handleOpenLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="profile-sidebar">
      <div className="profile-sidebar-inner">
        
        {/* Profile Dashboard Panel */}
        <div className="telemetry-panel">
          <div className="telemetry-panel-header">Profile Dashboard</div>
          <div className="telemetry-panel-content">
            <div className="telemetry-profile">
              <img src={myPhoto} alt="Soham Kundu" className="telemetry-avatar" />
              <div className="telemetry-identity">
                <h2>{parsedProfile.name}</h2>
                <p>{parsedProfile.role}</p>
                <div className="telemetry-availability">{parsedProfile.status}</div>
              </div>
            </div>
            <div className="telemetry-actions">
              <button className="telemetry-btn" onClick={handleCopyEmail}>
                <MailRegular fontSize={14} /> Copy Email
              </button>
              <button className="telemetry-btn" onClick={() => handleOpenLink('https://linkedin.com/in/sohamkundu')}>
                <LinkRegular fontSize={14} /> LinkedIn
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="telemetry-panel">
          <div className="telemetry-panel-header">System Status</div>
          <div className="telemetry-panel-content">
            <div className="telemetry-kv">
              <span className="telemetry-key">OS Version</span>
              <span className="telemetry-value">Portfolio OS v3.0</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">Build Status</span>
              <span className="telemetry-value success">Stable</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">Git Branch</span>
              <span className="telemetry-value">main</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">Environment</span>
              <span className="telemetry-value">Production</span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="telemetry-panel">
          <div className="telemetry-panel-header">Tech Stack</div>
          <div className="telemetry-panel-content">
            <div className="telemetry-badges">
              <span className="telemetry-badge">React</span>
              <span className="telemetry-badge">Node.js</span>
              <span className="telemetry-badge">Express</span>
              <span className="telemetry-badge">MongoDB</span>
              <span className="telemetry-badge">Docker</span>
              <span className="telemetry-badge">TypeScript</span>
              <span className="telemetry-badge">Next.js</span>
            </div>
          </div>
        </div>

        {/* Current Task */}
        <div className="telemetry-panel">
          <div className="telemetry-panel-header">Current Task</div>
          <div className="telemetry-panel-content">
            <div className="telemetry-task">
              <CheckmarkCircleRegular className="telemetry-task-icon" />
              <span className="telemetry-task-text">Portfolio OS</span>
            </div>
            <div className="telemetry-task">
              <ClockRegular className="telemetry-task-icon pending" />
              <span className="telemetry-task-text">Interview Notebook</span>
            </div>
            <div className="telemetry-task">
              <ClockRegular className="telemetry-task-icon pending" />
              <span className="telemetry-task-text">Docker Learning</span>
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div className="telemetry-panel">
          <div className="telemetry-panel-header">Live Stats</div>
          <div className="telemetry-panel-content">
            <div className="telemetry-kv">
              <span className="telemetry-key">Projects</span>
              <span className="telemetry-value">{parsedProfile.projects}</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">Commits</span>
              <span className="telemetry-value">{parsedProfile.commits}</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">Repositories</span>
              <span className="telemetry-value">{parsedProfile.repos}</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">Deployments</span>
              <span className="telemetry-value">42</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="telemetry-panel">
          <div className="telemetry-panel-header">System Health</div>
          <div className="telemetry-panel-content">
            <div className="telemetry-kv">
              <span className="telemetry-key">Memory</span>
              <span className="telemetry-value">{parsedProfile.memory}</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">CPU Load</span>
              <span className="telemetry-value">{parsedProfile.cpu}</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">API Health</span>
              <span className="telemetry-value success">200 OK</span>
            </div>
            <div className="telemetry-kv">
              <span className="telemetry-key">Uptime</span>
              <span className="telemetry-value">143 Days</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
