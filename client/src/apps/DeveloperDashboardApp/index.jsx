import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../../store/useWindowStore';
import { useBackgroundServiceStore } from '../../store/useBackgroundServiceStore';
import { DataAreaRegular, DesktopRegular, ServerRegular, ClockRegular, CheckmarkSquareRegular } from '@fluentui/react-icons';

export default function DeveloperDashboardApp() {
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(128);
  
  const windows = useWindowStore(s => s.windows);
  const services = useBackgroundServiceStore(s => s.services);

  // Mock live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 5 + 55)); // 55-60 FPS
      setMemory(Math.floor(120 + windows.length * 15 + Math.random() * 20)); // Dynamic memory based on open windows
    }, 1000);
    return () => clearInterval(interval);
  }, [windows.length]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-surface)',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-family)',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{ padding: '32px 40px', background: 'var(--color-bg-surface-hover)', borderBottom: '1px solid var(--color-border)' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DataAreaRegular fontSize={32} color="var(--color-accent)" />
          Developer Dashboard
        </h1>
        <p style={{ margin: '8px 0 0', color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
          Recruiter Showcase Mode: Real-time insights into Portfolio OS 2026.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', padding: '40px' }}>
        
        {/* Live Runtime Metrics */}
        <div style={{
          background: 'var(--color-bg-surface-content)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ServerRegular /> Runtime Metrics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <MetricRow label="Memory Usage" value={`${memory} MB`} color="#e81123" />
            <MetricRow label="Open Apps" value={windows.length} color="#0078d4" />
            <MetricRow label="Background Services" value={Object.keys(services).length} color="#107c10" />
            <MetricRow label="FPS" value={fps} color="#ffb900" />
          </div>
        </div>

        {/* Architecture Graph */}
        <div style={{
          background: 'var(--color-bg-surface-content)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DesktopRegular /> Architecture Graph
          </h2>
          <pre style={{
            margin: 0,
            fontFamily: 'Consolas, monospace',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)'
          }}>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Portfolio OS</span>{'\n'}
            ├── Window Manager{'\n'}
            ├── Desktop Engine{'\n'}
            ├── AI Assistant{'\n'}
            ├── Virtual File System{'\n'}
            ├── Background Services{'\n'}
            ├── VS Code Clone{'\n'}
            ├── Browser{'\n'}
            ├── Notifications{'\n'}
            └── Widgets Layer
          </pre>
        </div>

        {/* Timeline / Development Journey */}
        <div style={{
          background: 'var(--color-bg-surface-content)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          gridColumn: '1 / -1' // Span full width
        }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClockRegular /> Development Journey
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <TimelineItem phase="Phase 1: Foundation" desc="Boot sequence, Desktop engine, Window Manager built from scratch." done />
            <TimelineItem phase="Phase 2: App Ecosystem" desc="VS Code, Browser, File Explorer, Terminal implementation." done />
            <TimelineItem phase="Phase 3: System Services" desc="Notification Center, Start Menu, System Tray, Control Panel." done />
            <TimelineItem phase="Phase 4: Productivity Suite" desc="Calendar, Calculator, Notepad, Sticky Notes." done />
            <TimelineItem phase="Phase 5: AI & Automation" desc="AIAssistant 2.0, Background Task Management, Spotlight Search." done />
            <TimelineItem phase="Phase 6: Windows 11 Authenticity" desc="Snap Layouts, Alt+Tab, Virtual Desktops, Global Shortcuts." done />
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600, color, background: `${color}1A`, padding: '4px 12px', borderRadius: '12px' }}>
        {value}
      </span>
    </div>
  );
}

function TimelineItem({ phase, desc, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div style={{ marginTop: '2px', color: done ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }}>
        <CheckmarkSquareRegular fontSize={20} />
      </div>
      <div>
        <div style={{ fontWeight: 600 }}>{phase}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{desc}</div>
      </div>
    </div>
  );
}
