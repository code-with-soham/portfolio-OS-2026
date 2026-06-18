import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/useWindowStore';

export default function AltTabOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const windows = useWindowStore(s => s.windows);
  const focusWindow = useWindowStore(s => s.focusWindow);
  // Get windows sorted by recent order (topmost first)
  const windowOrder = useWindowStore(s => s.windowOrder);
  
  const orderedWindows = [...windows].sort((a, b) => {
    return windowOrder.indexOf(b.id) - windowOrder.indexOf(a.id);
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          // If only 1 window, select it. If > 1, select second window.
          setSelectedIndex(orderedWindows.length > 1 ? 1 : 0);
        } else {
          setSelectedIndex((prev) => (prev + 1) % orderedWindows.length);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Alt') {
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          // Focus selected window
          if (orderedWindows[selectedIndex]) {
            focusWindow(orderedWindows[selectedIndex].id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, orderedWindows, selectedIndex, focusWindow]);

  if (orderedWindows.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(30px)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-panel)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', maxWidth: '80vw', padding: '16px' }}>
            {orderedWindows.map((win, i) => {
              const isSelected = i === selectedIndex;
              return (
                <div
                  key={win.id}
                  style={{
                    width: '180px',
                    height: '140px',
                    background: isSelected ? 'var(--color-bg-surface-hover)' : 'transparent',
                    border: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s',
                    padding: '16px',
                    gap: '12px'
                  }}
                >
                  {typeof win.icon === 'string' ? (
                    <img src={win.icon} alt="" width="48" height="48" />
                  ) : (
                    <span style={{ fontSize: '48px' }}>{win.icon}</span>
                  )}
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#fff', 
                    fontWeight: 500, 
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                  }}>
                    {win.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ 
            marginTop: '16px', 
            fontSize: '1rem', 
            fontWeight: 600, 
            color: '#fff' 
          }}>
            {orderedWindows[selectedIndex]?.title}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
