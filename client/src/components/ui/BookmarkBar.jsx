import React from 'react';
import { motion } from 'framer-motion';

// Immutable Standard: Bookmarks Height = 32px
export const BookmarkBar = ({ children, style }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: '32px',
      padding: '0 8px',
      gap: '8px', // 8px gap as specified
      backgroundColor: 'var(--ds-bg-primary)',
      borderBottom: '1px solid var(--ds-border)',
      ...style
    }}>
      {children}
    </div>
  );
};

export const BookmarkItem = ({ icon, title, onClick }) => {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'var(--ds-surface)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '24px',
        padding: '0 8px',
        gap: '6px',
        borderRadius: '8px', // 8px radius hover as specified
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: 'var(--ds-text-primary)'
      }}
    >
      {/* 12px Icon */}
      <div style={{ width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      {/* 13px Text */}
      <span style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
        {title}
      </span>
    </motion.button>
  );
};
