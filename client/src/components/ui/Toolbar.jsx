import React from 'react';
import { motion } from 'framer-motion';

// Immutable Standard: Toolbar Height = 44px
export const Toolbar = ({ children, style, ...props }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: '44px',
      padding: '0 8px',
      gap: '4px',
      backgroundColor: 'var(--ds-bg-primary)',
      borderBottom: '1px solid var(--ds-border)',
      ...style
    }} {...props}>
      {children}
    </div>
  );
};

// Immutable Standard: 32x32 Container, 16x16 Icon
export const ToolbarButton = ({ icon, onClick, disabled, title, active }) => {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'var(--ds-surface)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--ds-radius-md)',
        border: 'none',
        background: active ? 'var(--ds-surface)' : 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        color: active ? 'var(--ds-accent)' : 'var(--ds-text-primary)',
        transition: 'background-color 0.15s ease'
      }}
    >
      <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
    </motion.button>
  );
};
