import { useEffect, useRef, useState, memo } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/useWindowStore';
import { APPS } from '../../config/apps';

/**
 * Resize Handle Component
 * Placed on the edges/corners of the window. Uses pointer events to manually resize the window.
 */
function ResizeHandle({ position, onResize, cursor }) {
  return (
    <div
      className="no-select"
      style={{
        position: 'absolute',
        zIndex: 10,
        ...position,
        cursor,
        touchAction: 'none', // Required for pointer events
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onResize(e);
      }}
    />
  );
}

import SnapLayoutsPopup from './SnapLayoutsPopup';

/**
 * Title Bar Component
 * Acts as the drag handle for the window and contains window controls.
 */
function TitleBar({ title, icon, onMinimize, onMaximize, onClose, onSnap, dragControls, isMaximized }) {
  const [showSnapLayouts, setShowSnapLayouts] = useState(false);
  const snapTimeoutRef = useRef(null);

  const handleMouseEnterMaximize = () => {
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = setTimeout(() => {
      setShowSnapLayouts(true);
    }, 500); // 500ms hover delay
  };

  const handleMouseLeaveMaximize = () => {
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = setTimeout(() => {
      setShowSnapLayouts(false);
    }, 300); // 300ms grace period to move mouse into popup
  };

  return (
    <div
      className="window-title-bar"
      onPointerDown={(e) => {
        // Only start dragging if not clicking a control button and not maximized
        if (e.target.closest('.window-controls') || showSnapLayouts) return;
        if (!isMaximized) {
          dragControls.start(e);
        }
      }}
      onDoubleClick={() => onMaximize()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '32px',
        background: 'transparent',
        borderBottom: '1px solid var(--color-border)',
        cursor: isMaximized ? 'default' : 'grab',
        touchAction: 'none',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px' }}>
        {typeof icon === 'string' && (icon.endsWith('.ico') || icon.endsWith('.png') || icon.includes('assets/') || icon.startsWith('data:image/')) ? (
          <img src={icon} alt="" draggable={false} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '14px' }}>{icon}</span>
        )}
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</span>
      </div>

      <div className="window-controls" style={{ display: 'flex', height: '100%' }}>
        <button
          onPointerDown={onMinimize}
          className="window-control-btn"
          style={{ width: '46px', background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ─
        </button>
        <div 
          onMouseEnter={handleMouseEnterMaximize}
          onMouseLeave={handleMouseLeaveMaximize}
          style={{ display: 'flex' }}
        >
          <button
            onPointerDown={onMaximize}
            className="window-control-btn"
            style={{ width: '46px', background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          
          <AnimatePresence>
            {showSnapLayouts && (
              <SnapLayoutsPopup 
                onMouseLeave={handleMouseLeaveMaximize}
                onSnap={(layout) => {
                  setShowSnapLayouts(false);
                  onSnap(layout);
                }}
              />
            )}
          </AnimatePresence>
        </div>
        <button
          onPointerDown={onClose}
          className="window-control-btn"
          style={{ width: '46px', background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e81123';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Main Window Component
 */
const Window = memo(function Window({ window: winData }) {
  const { id, appId, title, icon, isMinimized, isMaximized, bounds, zIndex, props } = winData;
  
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, updateWindowBounds, activeWindowId } = useWindowStore();
  const isActive = activeWindowId === id;
  
  const dragControls = useDragControls();
  const windowRef = useRef(null);
  
  // Local state for dragging/resizing so it updates fast without waiting for Zustand
  const [localBounds, setLocalBounds] = useState(bounds);

  // Sync local bounds if store bounds change (e.g. from maximize)
  useEffect(() => {
    setLocalBounds(bounds);
  }, [bounds.x, bounds.y, bounds.width, bounds.height]);

  const appConfig = APPS[appId];
  if (!appConfig) return null;

  const ContentComponent = appConfig.component;

  // Render nothing if minimized
  if (isMinimized) return null;

  // Custom Resize Logic
  const handleResize = (e, direction) => {
    if (isMaximized) return; // Cannot resize maximized window

    const startX = e.clientX;
    const startY = e.clientY;
    const startBounds = { ...localBounds };

    const onPointerMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startBounds.width;
      let newHeight = startBounds.height;
      let newX = startBounds.x;
      let newY = startBounds.y;

      // Min width/height
      const MIN_W = 300;
      const MIN_H = 200;

      if (direction.includes('right')) newWidth = Math.max(MIN_W, startBounds.width + deltaX);
      if (direction.includes('bottom')) newHeight = Math.max(MIN_H, startBounds.height + deltaY);
      
      if (direction.includes('left')) {
        const potentialWidth = startBounds.width - deltaX;
        if (potentialWidth >= MIN_W) {
          newWidth = potentialWidth;
          newX = startBounds.x + deltaX;
        }
      }
      
      if (direction.includes('top')) {
        const potentialHeight = startBounds.height - deltaY;
        if (potentialHeight >= MIN_H) {
          newHeight = potentialHeight;
          newY = startBounds.y + deltaY;
        }
      }

      setLocalBounds({ x: newX, y: newY, width: newWidth, height: newHeight });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      // Save final bounds to store
      updateWindowBounds(id, localBounds);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <motion.div
      ref={windowRef}
      onPointerDown={() => focusWindow(id)}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false} // Only title bar triggers drag
      dragMomentum={false}
      onDrag={(e, info) => {
        // Fast local update
        setLocalBounds((prev) => ({
          ...prev,
          x: prev.x + info.delta.x,
          y: prev.y + info.delta.y
        }));
      }}
      onDragEnd={() => {
        // Commit to store
        updateWindowBounds(id, localBounds);
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: isMaximized ? 0 : localBounds.x,
        y: isMaximized ? 0 : localBounds.y,
        width: isMaximized ? '100vw' : localBounds.width,
        height: isMaximized ? 'calc(100vh - var(--taskbar-height))' : localBounds.height,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className={`mica ${isActive ? 'active-window' : ''}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex,
        borderRadius: isMaximized ? '0px' : 'var(--radius-lg)',
        border: isMaximized ? 'none' : '1px solid var(--color-border)',
        boxShadow: isActive ? 'var(--shadow-window)' : '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--color-bg-surface)',
        backdropFilter: 'blur(20px)',
        // optimization
        willChange: 'transform, width, height',
      }}
    >
      <TitleBar
        title={title}
        icon={icon}
        onMinimize={(e) => {
          e.stopPropagation();
          minimizeWindow(id);
        }}
        onMaximize={(e) => {
          e.stopPropagation();
          toggleMaximize(id);
        }}
        onClose={(e) => {
          e.stopPropagation();
          closeWindow(id);
        }}
        onSnap={(layout) => {
          const w = window.innerWidth;
          const h = window.innerHeight - 48; // taskbar approx 48px
          let newBounds = { ...localBounds };
          
          if (layout === 'left') newBounds = { x: 0, y: 0, width: w/2, height: h };
          else if (layout === 'right') newBounds = { x: w/2, y: 0, width: w/2, height: h };
          else if (layout === 'left-two-thirds') newBounds = { x: 0, y: 0, width: (w*2)/3, height: h };
          else if (layout === 'right-third') newBounds = { x: (w*2)/3, y: 0, width: w/3, height: h };
          else if (layout === 'top-left') newBounds = { x: 0, y: 0, width: w/2, height: h/2 };
          else if (layout === 'top-right') newBounds = { x: w/2, y: 0, width: w/2, height: h/2 };
          else if (layout === 'bottom-left') newBounds = { x: 0, y: h/2, width: w/2, height: h/2 };
          else if (layout === 'bottom-right') newBounds = { x: w/2, y: h/2, width: w/2, height: h/2 };

          setLocalBounds(newBounds);
          updateWindowBounds(id, newBounds);
          // If it was maximized, unmaximize it to snap it
          if (isMaximized) toggleMaximize(id);
        }}
        dragControls={dragControls}
        isMaximized={isMaximized}
      />
      
      {/* Window Content Area */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <ContentComponent windowId={id} appId={appId} {...props} />
      </div>

      {/* Resize Handles (only visible when not maximized) */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <ResizeHandle position={{ top: 0, bottom: 0, left: '-4px', width: '8px' }} cursor="ew-resize" onResize={(e) => handleResize(e, 'left')} />
          <ResizeHandle position={{ top: 0, bottom: 0, right: '-4px', width: '8px' }} cursor="ew-resize" onResize={(e) => handleResize(e, 'right')} />
          <ResizeHandle position={{ left: 0, right: 0, top: '-4px', height: '8px' }} cursor="ns-resize" onResize={(e) => handleResize(e, 'top')} />
          <ResizeHandle position={{ left: 0, right: 0, bottom: '-4px', height: '8px' }} cursor="ns-resize" onResize={(e) => handleResize(e, 'bottom')} />
          
          {/* Corners */}
          <ResizeHandle position={{ top: '-4px', left: '-4px', width: '12px', height: '12px' }} cursor="nwse-resize" onResize={(e) => handleResize(e, 'top-left')} />
          <ResizeHandle position={{ top: '-4px', right: '-4px', width: '12px', height: '12px' }} cursor="nesw-resize" onResize={(e) => handleResize(e, 'top-right')} />
          <ResizeHandle position={{ bottom: '-4px', left: '-4px', width: '12px', height: '12px' }} cursor="nesw-resize" onResize={(e) => handleResize(e, 'bottom-left')} />
          <ResizeHandle position={{ bottom: '-4px', right: '-4px', width: '12px', height: '12px' }} cursor="nwse-resize" onResize={(e) => handleResize(e, 'bottom-right')} />
        </>
      )}
    </motion.div>
  );
});

export default Window;
