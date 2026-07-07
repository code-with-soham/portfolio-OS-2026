import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/Button';

/**
 * Renders a floating toast notification for setting changes, with an Undo action.
 */
export const SettingsToast = ({ message, onUndo, onDismiss, isVisible, actionLabel, onAction }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: 'var(--ds-surface)',
            border: '1px solid var(--ds-border)',
            borderRadius: 'var(--ds-radius-lg)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--ds-shadow-lg)',
            color: 'var(--ds-text-primary)'
          }}
        >
          <span style={{ fontSize: 'var(--ds-text-sm)', fontWeight: '500' }}>
            {message}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {onUndo && (
              <Button size="sm" variant="secondary" onClick={onUndo} style={{ minWidth: 'auto', padding: '4px 12px' }}>
                Undo
              </Button>
            )}
            {actionLabel && onAction && (
              <Button size="sm" variant="primary" onClick={onAction} style={{ minWidth: 'auto', padding: '4px 12px' }}>
                {actionLabel}
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
