import React from 'react';
import { motion } from 'framer-motion';

// Immutable Standard: Toolbar Height = 38px
export const Toolbar = ({ children, style, className = '', ...props }) => {
  return (
    <div 
      className={`os-toolbar ds-glass-2 ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '38px',
        padding: '0 8px',
        gap: '4px',
        borderBottom: '1px solid var(--ds-border)',
        ...style
      }} 
      {...props}
    >
      {children}
    </div>
  );
};

export const ToolbarGroup = ({ children, style, ...props }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', ...style }} {...props}>
      {children}
    </div>
  );
};

export const ToolbarDivider = () => {
  return (
    <div style={{ 
      width: '1px', 
      height: '16px', 
      backgroundColor: 'var(--ds-border)', 
      margin: '0 4px' 
    }} />
  );
};

// Immutable Standard: 28x28 Container, 14x14 Icon
export const ToolbarButton = ({ icon, onClick, disabled, title, active }) => {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'var(--ds-surface)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="ds-transition-btn"
      style={{
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--ds-radius-md)',
        border: 'none',
        background: active ? 'var(--ds-surface)' : 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        color: active ? 'var(--ds-accent)' : 'var(--ds-text-primary)'
      }}
    >
      <div style={{ width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
    </motion.button>
  );
};
