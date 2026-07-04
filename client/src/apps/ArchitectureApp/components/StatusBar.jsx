import { useState, useEffect, useRef } from 'react';
import { CheckmarkCircleRegular, DismissCircleRegular } from '@fluentui/react-icons';
import healthData from '../../../ai/knowledge/architecture/architecture-health.json';
import ExportPanel from './ExportPanel';

export default function StatusBar() {
  const [fps, setFps] = useState(60);
  const [uptime, setUptime] = useState(0);
  const lastTimeRef = useRef(performance.now());
  const frameRef = useRef(0);
  const fpsBuffer = useRef([]);
  const sessionStart = useRef(Date.now());

  // FPS Counter
  useEffect(() => {
    const measureFps = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (delta > 0) {
        fpsBuffer.current.push(1000 / delta);
        if (fpsBuffer.current.length > 30) fpsBuffer.current.shift();
        const avg = fpsBuffer.current.reduce((a, b) => a + b, 0) / fpsBuffer.current.length;
        setFps(Math.round(avg));
      }
      frameRef.current = requestAnimationFrame(measureFps);
    };
    frameRef.current = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - sessionStart.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const scoreColor = healthData.score >= 90 ? '#4CAF50' : healthData.score >= 70 ? '#ff9800' : '#f44336';

  return (
    <div style={{
      height: '32px',
      borderTop: '1px solid #222',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      fontSize: '11px',
      color: '#888',
      gap: '16px'
    }}>
      {/* Left items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: scoreColor }}>
          {healthData.score >= 90 ? <CheckmarkCircleRegular fontSize={14} /> : <DismissCircleRegular fontSize={14} />}
          <span>Architecture Score {healthData.score}/100</span>
        </div>
        <div style={{ width: '1px', height: '12px', background: '#333' }} />
        <span>Modular</span>
        <span>Lazy Loaded</span>
        <span>AI Driven</span>
        <span>PWA</span>
        <span>Responsive</span>
      </div>

      {/* Right items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ color: fps >= 30 ? '#4CAF50' : '#ff9800' }}>{fps} FPS</span>
        </div>
        <div style={{ width: '1px', height: '12px', background: '#333' }} />
        <div style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Up: {formatUptime(uptime)}
        </div>
        <div style={{ width: '1px', height: '12px', background: '#333' }} />
        <ExportPanel />
      </div>
    </div>
  );
}
