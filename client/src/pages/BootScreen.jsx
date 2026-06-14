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

  // Stagger animation for the 4 Windows logo squares
  const logoSquares = [
    { color: '#f25022', delay: 0 },    // Red (top-left)
    { color: '#7fba00', delay: 0.1 },   // Green (top-right)
    { color: '#00a4ef', delay: 0.2 },   // Blue (bottom-left)
    { color: '#ffb900', delay: 0.3 },   // Yellow (bottom-right)
  ];

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
      {/* Windows-style 4-color logo */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
          width: '68px',
          height: '68px',
        }}
      >
        {logoSquares.map((square, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0, borderRadius: '8px' }}
            animate={{
              scale: 1,
              opacity: 0.95,
              borderRadius: '2px',
            }}
            transition={{
              delay: 0.3 + square.delay,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              background: square.color,
              borderRadius: '2px',
            }}
          />
        ))}
      </div>

      {/* OS Name — fades in after logo */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
        style={{
          fontSize: '1.6rem',
          fontWeight: 300,
          letterSpacing: '0.06em',
          color: '#ffffff',
          fontFamily: 'var(--font-family)',
        }}
      >
        {APP_NAME}
      </motion.h1>

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
