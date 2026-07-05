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
        gap: '2px', // Tighter gap for OS-level tabs
        backgroundColor: 'transparent',
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
  // 5 States: Inactive, Hover, Pressed, Active, Dragging
  // Background logic handled by framer-motion variants
  
  const variants = {
    inactive: { backgroundColor: 'transparent', opacity: 0.7, y: 0, scale: 1, zIndex: 1, boxShadow: 'none' },
    hover: { backgroundColor: 'var(--ds-surface)', opacity: 0.9, y: 0, scale: 1, zIndex: 2, boxShadow: 'none' },
    pressed: { backgroundColor: 'var(--ds-surface-hover)', opacity: 1, y: 1, scale: 0.98, zIndex: 2, boxShadow: 'none' },
    active: { backgroundColor: 'var(--ds-bg-primary)', opacity: 1, y: 0, scale: 1, zIndex: 10, boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' },
    dragging: { backgroundColor: 'var(--ds-bg-primary)', opacity: 0.9, y: -4, scale: 1.02, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }
  };

  const currentState = isDragging ? 'dragging' : active ? 'active' : 'inactive';

  return (
    <motion.div
      layout
      layoutId={`tab-${title}`} // helps with reorder animation
      initial={{ opacity: 0, y: 10 }}
      animate={currentState}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={!active && !isDragging ? 'hover' : undefined}
      whileTap={!isDragging ? 'pressed' : undefined}
      variants={variants}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} // Tab timing: 220ms
      onClick={onClick}
      style={{
        position: 'relative',
        width: '200px', // slightly smaller width standard
        minWidth: '60px',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: '8px',
        cursor: 'default',
        borderRadius: '8px 8px 0 0', // Floating/rounded top
        borderTop: active ? '1px solid var(--ds-border)' : '1px solid transparent',
        borderLeft: active ? '1px solid var(--ds-border)' : '1px solid transparent',
        borderRight: active ? '1px solid var(--ds-border)' : '1px solid transparent',
        borderBottom: active ? 'none' : '1px solid var(--ds-border)', // Bottom border connects to toolbar
      }}
    >
      {/* Subtle top accent line for active tab */}
      {active && (
        <motion.div 
          layoutId="active-tab-indicator"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px', 
            backgroundColor: 'var(--ds-accent)', borderRadius: '8px 8px 0 0'
          }} 
        />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', zIndex: 2 }}>{icon}</div>
      <div style={{ fontSize: '12px', color: 'var(--ds-text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', zIndex: 2 }}>
        {title}
      </div>
      
      <motion.div 
        onClick={(e) => { e.stopPropagation(); onClose && onClose(); }}
        whileHover={{ backgroundColor: 'var(--ds-surface-hover)' }}
        whileTap={{ scale: 0.9 }}
        style={{
          width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%', cursor: 'pointer', zIndex: 2,
          opacity: active ? 1 : 0, transition: 'opacity 0.15s',
          backgroundColor: 'transparent'
        }}
        className="tab-close-btn ds-transition-hover"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
      
      <style>{`
        div:hover > .tab-close-btn { opacity: 1 !important; }
      `}</style>
    </motion.div>
  );
};
