import { useState, useEffect } from 'react';
import { useWindowStore } from '../../store/useWindowStore';
import './ControlPanelApp.css';

export default function ControlPanelApp() {
  const [activeTab, setActiveTab] = useState('performance');
  
  // Data for Performance tab
  const [metrics, setMetrics] = useState({
    cpu: 12,
    ram: 45,
    disk: 5,
    network: 2,
    cpuHistory: Array(20).fill(12),
    ramHistory: Array(20).fill(45),
  });

  // Windows store
  const windows = useWindowStore(s => s.windows);
  const closeWindow = useWindowStore(s => s.closeWindow);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newCpu = Math.max(2, Math.min(100, prev.cpu + (Math.random() * 20 - 10)));
        const newRam = Math.max(20, Math.min(95, prev.ram + (Math.random() * 5 - 2)));
        const newDisk = Math.max(0, Math.min(100, prev.disk + (Math.random() * 10 - 5)));
        const newNet = Math.max(0, Math.min(100, prev.network + (Math.random() * 8 - 4)));
        
        return {
          cpu: Math.round(newCpu),
          ram: Math.round(newRam),
          disk: Math.round(newDisk),
          network: Math.round(newNet),
          cpuHistory: [...prev.cpuHistory.slice(1), newCpu],
          ramHistory: [...prev.ramHistory.slice(1), newRam],
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderPerformanceTab = () => (
    <div className="tm-performance-tab">
      <div className="tm-metrics-grid">
        {/* CPU */}
        <div className="tm-metric-card">
          <h4>CPU</h4>
          <div className="tm-metric-value">{metrics.cpu}%</div>
          <div className="tm-graph-container">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="tm-graph">
              <polyline 
                points={metrics.cpuHistory.map((val, i) => `${i * 5.26},${50 - (val / 2)}`).join(' ')} 
                fill="none" 
                stroke="var(--color-accent)" 
                strokeWidth="2" 
              />
            </svg>
          </div>
        </div>

        {/* RAM */}
        <div className="tm-metric-card">
          <h4>Memory</h4>
          <div className="tm-metric-value">{metrics.ram}%</div>
          <div className="tm-graph-container">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="tm-graph">
              <polyline 
                points={metrics.ramHistory.map((val, i) => `${i * 5.26},${50 - (val / 2)}`).join(' ')} 
                fill="none" 
                stroke="#a435f0" 
                strokeWidth="2" 
              />
            </svg>
          </div>
        </div>

        {/* Disk */}
        <div className="tm-metric-card">
          <h4>Disk 0 (C:)</h4>
          <div className="tm-metric-value">{metrics.disk}%</div>
          <div className="tm-bar-container">
            <div className="tm-bar" style={{ width: `${metrics.disk}%`, backgroundColor: '#107c10' }}></div>
          </div>
        </div>

        {/* Network */}
        <div className="tm-metric-card">
          <h4>Wi-Fi</h4>
          <div className="tm-metric-value">{metrics.network} Mbps</div>
          <div className="tm-bar-container">
            <div className="tm-bar" style={{ width: `${metrics.network}%`, backgroundColor: '#d13438' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessesTab = () => {
    // Convert windows object to array, skip the control panel itself if desired (or keep it)
    const runningApps = Object.values(windows);

    return (
      <div className="tm-processes-tab">
        <table className="tm-processes-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {runningApps.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No apps running</td>
              </tr>
            ) : (
              runningApps.map(win => {
                return (
                  <tr key={win.id}>
                    <td>
                      <div className="tm-process-name">
                        {typeof win.icon === 'string' && <img src={win.icon} alt="" width="16" />}
                        <span>{win.title}</span>
                      </div>
                    </td>
                    <td>Running</td>
                    <td>
                      <button className="tm-end-task-btn" onClick={() => closeWindow(win.id)}>
                        End Task
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="task-manager-container glass-heavy">
      <div className="tm-sidebar">
        <button 
          className={`tm-tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <span style={{ marginRight: '8px' }}>📈</span> Performance
        </button>
        <button 
          className={`tm-tab-btn ${activeTab === 'processes' ? 'active' : ''}`}
          onClick={() => setActiveTab('processes')}
        >
          <span style={{ marginRight: '8px' }}>⚙️</span> Processes
        </button>
      </div>
      
      <div className="tm-content">
        <div className="tm-header">
          <h2>Task Manager</h2>
        </div>
        {activeTab === 'performance' ? renderPerformanceTab() : renderProcessesTab()}
      </div>
    </div>
  );
}
