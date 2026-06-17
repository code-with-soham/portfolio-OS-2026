// ============================================
// Portfolio OS 2026 — Lock Screen
// ============================================
// Windows 11-style lock screen with:
// - Full-screen wallpaper background
// - Large time display (12-hour format)
// - Date display
// - "Click anywhere to unlock" hint
// - Swipe-up unlock animation
//
// Click anywhere → slides up to reveal the desktop.

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../store/useDesktopStore';
import { OS_STATES } from '../constants';

/**
 * Formats time in 12-hour format: "7:44 PM"
 */
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const mins = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${mins} ${ampm}`;
}

/**
 * Formats date: "Saturday, June 14"
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function LockScreen() {
  const setOsState = useDesktopStore((s) => s.setOsState);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle unlock — trigger slide-up animation, then transition
  const handleUnlock = useCallback(() => {
    if (isUnlocking) return;
    if (pin === '1234') {
      setIsUnlocking(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  }, [isUnlocking, pin]);

  return (
    <motion.div
      className="no-select"
      initial={{ opacity: 0 }}
      animate={
        isUnlocking
          ? { y: '-100%', transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
          : { opacity: 1, transition: { duration: 0.6 } }
      }
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      onAnimationComplete={() => {
        if (isUnlocking) {
          setOsState(OS_STATES.DESKTOP);
        }
      }}
      onClick={handleUnlock}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* Blurred Background Layer */}
      <div 
        className="wallpaper-default"
        style={{
          position: 'absolute',
          inset: '-20px', // Slightly larger to prevent white/clear edges from blur
          filter: 'blur(16px)',
          zIndex: 0,
        }}
      />
      
      {/* Subtle darkening overlay to make text pop */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          zIndex: 1,
        }}
      />

      {/* Time — large centered clock */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          marginTop: '-60px',
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(4rem, 10vw, 7rem)',
            fontWeight: 200,
            color: '#ffffff',
            fontFamily: 'var(--font-family)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          {formatTime(currentTime)}
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: 'var(--font-family)',
            textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          {formatDate(currentTime)}
        </p>
      </motion.div>

      {/* Profile and Login */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: '65%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 3,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#fff', margin: 0, fontSize: '24px', fontWeight: 500, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Soham Kundu</h2>
        
        <div style={{ position: 'relative', width: '280px' }}>
          <input 
            type="password" 
            placeholder="PIN" 
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              borderRadius: '4px',
              border: `2px solid ${error ? '#e81123' : 'transparent'}`,
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
            onBlur={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUnlock();
            }}
            autoFocus
          />
          <button 
            onClick={handleUnlock}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '20px',
              opacity: 0.8
            }}
          >
            ➔
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>Pin- 1234</p>
      </motion.div>

    </motion.div>
  );
}
