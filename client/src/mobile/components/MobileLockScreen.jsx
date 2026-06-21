import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockClosedRegular } from '@fluentui/react-icons';
import { useWeatherStore } from '../../store/useWeatherStore';

export default function MobileLockScreen({ onUnlock }) {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleDragEnd = (e, { offset, velocity }) => {
    if (offset.y < -100 || velocity.y < -500) {
      setIsUnlocking(true);
      setTimeout(onUnlock, 300);
    }
  };

  return (
    <AnimatePresence>
      {!isUnlocking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0, transition: { duration: 0.3 } }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop") center/cover',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '100px',
            color: '#fff'
          }}
        >
          <div style={{ background: 'rgba(0,0,0,0.4)', position: 'absolute', inset: 0, zIndex: -1 }} />
          
          <LockClosedRegular fontSize={24} style={{ marginBottom: '16px' }} />
          
          <h1 style={{ fontSize: '80px', fontWeight: 200, margin: 0, letterSpacing: '-2px' }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
          <p style={{ fontSize: '18px', fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>

          {useWeatherStore.getState().currentWeather && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '16px' }}>
              <img 
                src={`https://openweathermap.org/img/wn/${useWeatherStore.getState().currentWeather.icon}.png`} 
                alt="weather" 
                style={{ width: '24px', height: '24px' }} 
              />
              <span>{useWeatherStore.getState().currentWeather.temp}°C</span>
              <span style={{ textTransform: 'capitalize' }}>• {useWeatherStore.getState().currentWeather.condition}</span>
            </div>
          )}

          <div style={{ marginTop: 'auto', marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ width: '32px', height: '32px', border: '2px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ↑
            </motion.div>
            <span style={{ fontSize: '14px', letterSpacing: '1px' }}>Swipe up to unlock</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
