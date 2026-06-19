import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { 
  BoardRegular, 
  ServerRegular 
} from '@fluentui/react-icons';

const MiniChart = ({ value, color }) => {
  // Generate random past data for a continuous look
  const [data, setData] = useState(Array(12).fill(0).map(() => Math.floor(Math.random() * 40) + 10));

  useEffect(() => {
    setData(prev => [...prev.slice(1), value]);
  }, [value]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '24px', width: '60px' }}>
      {data.map((val, i) => (
        <motion.div
          key={i}
          animate={{ height: `${val}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
          style={{
            flex: 1,
            background: i === data.length - 1 ? color : 'rgba(255,255,255,0.2)',
            borderRadius: '1px',
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  );
};

export default function SystemMonitorWidget() {
  const { accentColor } = useThemeStore();
  const [stats, setStats] = useState({
    cpu: 45,
    ram: 62,
    disk: 21
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.max(10, Math.min(100, prev.cpu + (Math.random() * 20 - 10))),
        ram: Math.max(40, Math.min(90, prev.ram + (Math.random() * 10 - 5))),
        disk: 21 // disk doesn't fluctuate much
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="widget-card system-monitor-widget"
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'rgba(20, 20, 20, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '20px',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '340px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ background: accentColor, padding: '6px', borderRadius: '8px', display: 'flex' }}>
          <BoardRegular fontSize="20px" color="#fff" />
        </div>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Live System Monitor</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* CPU */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100px' }}>
            <BoardRegular fontSize="20px" color="rgba(255,255,255,0.7)" />
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>CPU</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{Math.round(stats.cpu)}%</div>
            </div>
          </div>
          <MiniChart value={stats.cpu} color={accentColor} />
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

        {/* RAM */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100px' }}>
            <ServerRegular fontSize="20px" color="rgba(255,255,255,0.7)" />
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>RAM</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{Math.round(stats.ram)}%</div>
            </div>
          </div>
          <MiniChart value={stats.ram} color="#4ade80" />
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

        {/* Disk */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100px' }}>
            <ServerRegular fontSize="20px" color="rgba(255,255,255,0.7)" />
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Disk</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{Math.round(stats.disk)}%</div>
            </div>
          </div>
          <MiniChart value={stats.disk} color="#60a5fa" />
        </div>
      </div>
    </motion.div>
  );
}
