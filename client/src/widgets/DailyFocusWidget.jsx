import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { BoardRegular, EditRegular, CodeRegular, BrainCircuitRegular, WindowAppsRegular } from '@fluentui/react-icons';

export default function DailyFocusWidget() {
  const { accentColor } = useThemeStore();
  const [focusData, setFocusData] = useState({ title: '', icon: '🌅', items: [] });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setFocusData({
        title: 'Focus on Learning',
        icon: '🌅',
        items: [
          { name: 'Docker', icon: <WindowAppsRegular /> },
          { name: 'DSA', icon: <BrainCircuitRegular /> },
          { name: 'System Design', icon: <BoardRegular /> }
        ]
      });
    } else if (hour >= 12 && hour < 18) {
      setFocusData({
        title: 'Focus on Building',
        icon: '☀️',
        items: [
          { name: 'Portfolio OS', icon: <CodeRegular /> },
          { name: 'Projects', icon: <WindowAppsRegular /> },
          { name: 'GitHub', icon: <BoardRegular /> }
        ]
      });
    } else {
      setFocusData({
        title: 'Focus on Revision',
        icon: '🌙',
        items: [
          { name: 'Aptitude', icon: <BrainCircuitRegular /> },
          { name: 'Verbal', icon: <EditRegular /> },
          { name: 'Interview Prep', icon: <BoardRegular /> }
        ]
      });
    }
  }, []);

  return (
    <motion.div 
      className="widget-card daily-focus"
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '28px' }}>{focusData.icon}</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{focusData.title}</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Today's Priority</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={focusData.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {focusData.items.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                <span style={{ color: accentColor, display: 'flex' }}>{item.icon}</span>
                {item.name}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
