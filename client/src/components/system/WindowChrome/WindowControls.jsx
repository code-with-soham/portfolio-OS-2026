import React from 'react';

/**
 * Standard OS Window Controls (Minimize, Maximize, Close)
 * Implements authentic Windows 11 hover states and sizing.
 */
export const WindowControls = ({ onMinimize, onMaximize, onClose, isMaximized }) => {
  return (
    <div className="os-window-controls" style={{ display: 'flex', height: '100%', zIndex: 100 }}>
      <button
        onPointerDown={onMinimize}
        className="window-control-btn"
        style={{
          width: '46px',
          height: '100%',
          background: 'transparent',
          border: 'none',
          color: 'var(--ds-text-primary)',
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.1s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ds-surface-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <rect x="0" y="4" width="10" height="1" />
        </svg>
      </button>
      
      <button
        onPointerDown={onMaximize}
        className="window-control-btn"
        style={{
          width: '46px',
          height: '100%',
          background: 'transparent',
          border: 'none',
          color: 'var(--ds-text-primary)',
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.1s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ds-surface-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {isMaximized ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
            <path d="M2.5 2.5h5v5h-5z" strokeWidth="1" />
            <path d="M4 1.5h4.5v4.5" strokeWidth="1" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
            <rect x="1.5" y="1.5" width="7" height="7" strokeWidth="1" />
          </svg>
        )}
      </button>

      <button
        onPointerDown={onClose}
        className="window-control-btn close-btn"
        style={{
          width: '46px',
          height: '100%',
          background: 'transparent',
          border: 'none',
          color: 'var(--ds-text-primary)',
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.1s, color 0.1s',
          borderTopRightRadius: isMaximized ? '0' : 'var(--ds-radius-lg)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#e81123';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--ds-text-primary)';
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M1 1l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};
