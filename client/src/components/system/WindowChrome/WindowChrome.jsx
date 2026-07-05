import React from 'react';
import { WindowControls } from './WindowControls';

/**
 * OS Window Chrome Wrapper
 * Provides the title bar drag area, window controls, and base OS styling for apps
 * that opt out of the default Window.jsx title bar (hideTitleBar: true).
 */
export const WindowChrome = ({
  children,
  title,
  icon,
  dragControls,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  headerContent, // Optional: e.g. Tabs that live in the title bar
  className = '',
  style = {}
}) => {
  return (
    <div className={`os-window-chrome ${className}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', ...style }}>
      {/* Title Bar Area */}
      <div
        className="os-title-bar"
        onPointerDown={(e) => {
          // Prevent dragging if clicking window controls or interactive elements
          if (e.target.closest('.window-controls') || e.target.closest('button') || e.target.closest('.no-drag')) {
            return;
          }
          if (!isMaximized && dragControls) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={onMaximize}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '38px',
          width: '100%',
          userSelect: 'none',
          cursor: isMaximized ? 'default' : 'grab',
          touchAction: 'none'
        }}
      >
        {/* Left padding / Icon & Title (if any) */}
        {icon || title ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', paddingRight: '12px', zIndex: 1 }}>
            {icon && (
              typeof icon === 'string' ? 
                <img src={icon} alt="" draggable={false} style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> 
                : icon
            )}
            {title && <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ds-text-primary)' }}>{title}</span>}
          </div>
        ) : (
          <div style={{ width: '8px' }} /> // Default left padding
        )}

        {/* Custom Header Content (e.g., Browser Tabs) */}
        <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          {headerContent}
        </div>

        {/* Right side Window Controls */}
        <div className="window-controls" style={{ height: '100%', flexShrink: 0, zIndex: 100 }}>
          <WindowControls
            onMinimize={onMinimize}
            onMaximize={onMaximize}
            onClose={onClose}
            isMaximized={isMaximized}
          />
        </div>
      </div>

      {/* Main App Content */}
      <div className="os-window-content ds-glass-1" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
};
