import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Enterprise Context Menu component
export const ContextMenu = ({ isOpen, x, y, onClose, children }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
      // Optional: close on scroll
      window.addEventListener('scroll', onClose, { passive: true });
    }

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', onClose);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: 'fixed',
            top: y,
            left: x,
            backgroundColor: 'var(--ds-bg-primary)',
            borderRadius: 'var(--ds-radius-lg)',
            boxShadow: 'var(--ds-shadow-2xl)',
            padding: '8px 0',
            minWidth: '220px',
            zIndex: 9999, // Extremely high Z-index to stay on top
            border: '1px solid var(--ds-border)',
            backdropFilter: 'blur(20px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ContextMenuItem = ({ icon, label, shortcut, onClick, disabled, danger }) => {
  return (
    <div
      onClick={(e) => {
        if (!disabled) {
          onClick(e);
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        gap: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        color: danger ? 'var(--ds-danger)' : 'var(--ds-text-primary)',
        transition: 'background-color 0.1s ease',
        fontSize: '13px'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = danger ? 'var(--ds-danger-muted)' : 'var(--ds-surface)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {icon && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>{icon}</div>}
      <span style={{ flex: 1 }}>{label}</span>
      {shortcut && <span style={{ fontSize: '11px', color: 'var(--ds-text-secondary)' }}>{shortcut}</span>}
    </div>
  );
};

export const ContextMenuDivider = () => (
  <div style={{ height: '1px', backgroundColor: 'var(--ds-border)', margin: '8px 0' }} />
);
