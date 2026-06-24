// ============================================
// Portfolio OS 2026 — Boot Screen
// ============================================
// The first screen visitors see — a Windows 11-inspired boot sequence
// with animated logo, loading spinner, and auto-transition to lock screen.
//
// Duration: 3000ms → auto-transitions to 'locked' state
// Exit animation: 500ms fade-out via Framer Motion

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../store/useDesktopStore';
import { OS_STATES, ANIMATION, APP_NAME } from '../constants';
import startIcon from '../assets/icons/logos/StartIcon.ico';

/**
 * Windows 11-style boot loading screen
 */
export default function BootScreen() {
  const setOsState = useDesktopStore((s) => s.setOsState);

  // Auto-transition to lock screen after boot duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setOsState(OS_STATES.LOCKED);
    }, ANIMATION.BOOT_DURATION * 1000);

    return () => clearTimeout(timer);
  }, [setOsState]);


  // Spinner dots — 5 dots orbiting in a circle
  const spinnerDots = Array.from({ length: 5 }, (_, i) => i);

  return (
    <motion.div
      className="no-select"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Windows 11 Logo */}
      <motion.img
        src={startIcon}
        alt="Windows 11 Logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '80px',
          height: '80px',
          objectFit: 'contain'
        }}
      />

      {/* OS Name — fades in after logo */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: '#ffffff',
          fontFamily: 'var(--font-family)',
        }}
      >
        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 300,
            letterSpacing: '0.06em',
            margin: 0,
          }}
        >
          Welcome to My Operating System
        </h1>
        <h2
          style={{
            fontSize: '1.2rem',
            fontWeight: 200,
            letterSpacing: '0.04em',
            margin: 0,
            opacity: 0.8,
          }}
        >
          Soham Kundu
        </h2>
      </motion.div>

      {/* Windows 11-style orbiting dots spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        style={{
          position: 'relative',
          width: '40px',
          height: '40px',
          marginTop: '-8px',
        }}
      >
        {spinnerDots.map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '4px',
              height: '4px',
              marginTop: '-2px',
              marginLeft: '-2px',
              borderRadius: '50%',
              background: '#ffffff',
              animation: `boot-dot-orbit 1.8s cubic-bezier(0.5, 0, 0.5, 1) ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </motion.div>

      {/* Subtle bottom watermark */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          fontSize: '0.75rem',
          color: '#ffffff',
          fontFamily: 'var(--font-family)',
          letterSpacing: '0.03em',
        }}
      >
        © 2026 Soham Kundu
      </motion.p>
    </motion.div>
  );
}
