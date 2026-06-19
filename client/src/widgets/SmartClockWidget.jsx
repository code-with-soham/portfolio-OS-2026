import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { TimerRegular, ClockAlarmRegular } from '@fluentui/react-icons';

export default function SmartClockWidget() {
  const { accentColor } = useThemeStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <motion.div 
      className="widget-card smart-clock-widget"
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'rgba(20, 20, 20, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '24px',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        width: '340px'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 500, color: accentColor }}>
          {formatDay(time)}
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
          {formatDate(time)}
        </div>
        <div style={{ fontSize: '42px', fontWeight: 'bold', letterSpacing: '1px', lineHeight: 1 }}>
          {formatTime(time)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          <TimerRegular fontSize="18px" />
          Pomodoro
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          <ClockAlarmRegular fontSize="18px" />
          Countdown
        </motion.button>
      </div>
    </motion.div>
  );
}
