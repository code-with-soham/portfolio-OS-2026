import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertUrgentRegular } from '@fluentui/react-icons';

export default function MobileNotification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show a mock notification after 8 seconds of OS load
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Auto dismiss after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          style={{
            position: 'absolute',
            top: '40px',
            left: '16px',
            right: '16px',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '16px',
            zIndex: 99999,
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.y < -50) setIsVisible(false);
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertUrgentRegular fontSize={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Welcome Back, Soham!</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>Your Portfolio OS has successfully updated to the latest version.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
