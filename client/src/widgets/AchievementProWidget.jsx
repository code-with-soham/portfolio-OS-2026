import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { TrophyFilled } from '@fluentui/react-icons';

const achievements = [
  "Top 10 Nexathon Finalist",
  "SIH Participant",
  "Portfolio OS Creator",
  "500+ GitHub Contributions"
];

export default function AchievementProWidget() {
  const { accentColor } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % achievements.length);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="widget-card achievement-pro-widget"
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
        justifyContent: 'center',
        width: '340px',
        height: '100px', // Fixed height to prevent jumping
        overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div style={{
            minWidth: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${accentColor}, #222)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <TrophyFilled fontSize="24px" color="#FFD700" />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Achievement Unlocked</div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, lineHeight: 1.2 }}>
              {achievements[currentIndex]}
            </h3>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
