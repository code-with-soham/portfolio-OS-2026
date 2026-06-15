// ============================================
// Portfolio OS 2026 — About OS App
// ============================================
// A simple dialog app displaying system information,
// similar to the "winver" tool in Windows.

import { useState, useEffect } from 'react';
import { SYSTEM_INFO } from '../../config/systemInfo';
import { useWindowStore } from '../../store/useWindowStore';
import { useDesktopStore } from '../../store/useDesktopStore';
import './AboutOSApp.css';

function useUptime() {
  const bootTime = useDesktopStore((s) => s.bootTime);
  const [uptime, setUptime] = useState('00h 00m 00s');

  useEffect(() => {
    const updateUptime = () => {
      const diff = Math.floor((Date.now() - bootTime) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setUptime(`${h}h ${m}m ${s}s`);
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, [bootTime]);

  return uptime;
}

export default function AboutOSApp({ id }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const uptime = useUptime();

  return (
    <div className="about-os-app">
      {/* Banner */}
      <div className="about-os-banner">
        <div className="about-os-logo">
          <span className="about-os-icon">💠</span>
          <span>{SYSTEM_INFO.name}</span>
        </div>
      </div>

      {/* Content */}
      <div className="about-os-content">
        <div className="about-os-header">
          <p>----------------------------------</p>
          <h2>{SYSTEM_INFO.name}</h2>
          <p>Version {SYSTEM_INFO.version}</p>
          <br />
          <p>Build: {SYSTEM_INFO.build}</p>
          <p>Codename: {SYSTEM_INFO.codename}</p>
          <br />
          <p>React {SYSTEM_INFO.react}</p>
          <p>Node {SYSTEM_INFO.node}</p>
          <p>Express {SYSTEM_INFO.express}</p>
          <br />
          <p>Uptime:</p>
          <p style={{ fontFamily: 'monospace' }}>{uptime}</p>
          <br />
          <p>Copyright &copy; {SYSTEM_INFO.author}</p>
          <p>Licensed under {SYSTEM_INFO.license}</p>
          <p>----------------------------------</p>
        </div>
      </div>

      {/* Footer */}
      <div className="about-os-footer">
        <button 
          className="about-os-button"
          onClick={() => closeWindow(id)}
        >
          OK
        </button>
      </div>
    </div>
  );
}
