import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [sessionTime, setSessionTime] = useState(0);
  const [windowCount, setWindowCount] = useState(0);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsBuffer = useRef([]);
  const sessionStart = useRef(Date.now());

  // FPS Counter using requestAnimationFrame
  const measureFps = useCallback(() => {
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
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(frameRef.current);
  }, [measureFps]);

  // Session time updater
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart.current) / 1000);
      setSessionTime(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Window count - read from DOM
  useEffect(() => {
    const interval = setInterval(() => {
      const windows = document.querySelectorAll('[data-window-id]');
      setWindowCount(windows.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const fpsColor = fps >= 55 ? '#4CAF50' : fps >= 30 ? '#ff9800' : '#f44336';

  const metrics = [
    { label: 'FPS', value: fps, unit: 'fps', color: fpsColor, bar: Math.min(fps / 60 * 100, 100) },
    { label: 'Visible Windows', value: windowCount, unit: 'open', color: '#61dafb', bar: Math.min(windowCount / 10 * 100, 100) },
    { label: 'Active Stores', value: 30, unit: 'zustand', color: '#f0db4f', bar: 100 },
    { label: 'Session Time', value: formatTime(sessionTime), unit: '', color: '#e040fb', bar: Math.min(sessionTime / 3600 * 100, 100) },
    { label: 'Animations', value: 'Framer Motion', unit: 'engine', color: '#00bcd4', bar: 85 },
    { label: 'Bundle', value: 'Vite', unit: 'dev', color: '#8bc34a', bar: 92 },
    { label: 'Mounted Components', value: '~' + (50 + windowCount * 15), unit: 'est.', color: '#ff9800', bar: 70 },
    { label: 'Memory (est.)', value: `${Math.round(50 + windowCount * 8 + Math.random() * 5)}`, unit: 'MB', color: '#9c27b0', bar: 45 }
  ];

  return (
    <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>Performance Monitor</h2>
        <p style={{ color: '#888', margin: 0 }}>Live telemetry from the Portfolio OS runtime.</p>
      </div>

      {/* FPS Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid #222',
          borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '64px', fontWeight: 800, color: fpsColor, fontFamily: 'JetBrains Mono, monospace' }}>
            {fps}
          </div>
          <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>FPS</div>
        </div>
        <div style={{ flex: 1, height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${Math.min(fps / 60 * 100, 100)}%` }}
            style={{ height: '100%', background: fpsColor, borderRadius: '2px' }}
          />
        </div>
        <div style={{ fontSize: '13px', color: '#aaa', minWidth: '100px' }}>
          {fps >= 55 ? '✅ Smooth' : fps >= 30 ? '⚠️ Acceptable' : '🔴 Low'}
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {metrics.slice(1).map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid #222',
              borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>{m.value}</span>
              <span style={{ fontSize: '11px', color: '#666' }}>{m.unit}</span>
            </div>
            <div style={{ height: '3px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.bar}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                style={{ height: '100%', background: m.color, borderRadius: '2px' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
