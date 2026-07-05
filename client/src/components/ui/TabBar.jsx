import React from 'react';
import { motion } from 'framer-motion';

// Immutable Standard: Tab Bar Height = 38px
export const TabBar = ({ children, style, onPointerDown, onDoubleClick }) => {
  return (
    <div 
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        height: '38px',
        padding: '0 8px',
        gap: '4px',
        backgroundColor: 'var(--ds-bg-secondary)', // slightly darker to make active tab pop
        userSelect: 'none',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export const TabItem = ({ 
  active, 
  icon, 
  title, 
  onClick, 
  onClose,
  isDragging 
}) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      style={{
        position: 'relative',
        width: '220px',
        minWidth: '100px',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: '8px',
        cursor: 'default',
        backgroundColor: active ? 'var(--ds-bg-primary)' : 'transparent',
        borderRadius: '8px 8px 0 0',
        zIndex: active ? 10 : 1,
        opacity: active ? 1 : 0.7,
        boxShadow: active ? '0 -2px 8px rgba(0,0,0,0.05)' : 'none',
      }}
      whileHover={!active && { backgroundColor: 'var(--ds-surface)', opacity: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {/* Subtle top border/glow for active tab */}
      {active && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px', 
          backgroundColor: 'var(--ds-accent)', borderRadius: '8px 8px 0 0',
          opacity: 0.8
        }} />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', zIndex: 2 }}>{icon}</div>
      <div style={{ fontSize: '12px', color: 'var(--ds-text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', zIndex: 2 }}>
        {title}
      </div>
      <div 
        onClick={(e) => { e.stopPropagation(); onClose && onClose(); }}
        style={{
          width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%', cursor: 'pointer', zIndex: 2,
          opacity: active ? 1 : 0, transition: 'opacity 0.2s',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--ds-surface-hover)' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        className="tab-close-btn"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* CSS trick to show close button on hover of the entire tab */}
      <style>{`
        div:hover > .tab-close-btn { opacity: 1 !important; }
      `}</style>
    </motion.div>
  );
};
