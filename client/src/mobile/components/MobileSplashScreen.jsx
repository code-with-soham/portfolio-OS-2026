import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileSplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--color-bg-desktop)',
            zIndex: 999999, // Above everything
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, delay: 0.2 }}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              background: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              marginBottom: '24px'
            }}
          >
            <span style={{ fontSize: '40px', fontWeight: 'bold' }}>SK</span>
          </motion.div>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Portfolio OS</h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Soham Kundu</p>
          
          <div style={{ position: 'absolute', bottom: '40px' }}>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--color-accent)' }}
            >
              LOADING...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
