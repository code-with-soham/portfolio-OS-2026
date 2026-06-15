// ============================================
// Portfolio OS 2026 — Desktop Icon
// ============================================
// Windows 11-style desktop icon with emoji/SVG icon on top,
// label text below. Features hover and active states.
//
// Phase 3: Click does nothing (no window manager yet).
// Phase 5: Double-click will open the app in a window.

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';

/**
 * Desktop icon tile component
 *
 * @param {Object} props
 * @param {string} props.id - Unique app identifier
 * @param {string} props.label - Display label
 * @param {string} props.icon - Emoji icon
 * @param {Function} [props.onClick] - Optional click handler
 */
export default function DesktopIcon({ id, label, icon, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  const iconPositions = useDesktopStore((s) => s.iconPositions);
  const updateIconPosition = useDesktopStore((s) => s.updateIconPosition);
  const selectedIconId = useDesktopStore((s) => s.selectedIconId);
  const setSelectedIconId = useDesktopStore((s) => s.setSelectedIconId);
  const openWindow = useWindowStore((s) => s.openWindow);
  
  const isSelected = selectedIconId === id;

  // Get saved position or default to 0,0
  const savedPosition = iconPositions[id] || { x: 0, y: 0 };

  return (
    <motion.button
      id={`desktop-icon-${id}`}
      className="no-select"
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        // Prevent accidental clicks when dragging
        if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
          setIsActive(false);
        }
        // Save the new absolute translation
        const newX = savedPosition.x + info.offset.x;
        const newY = savedPosition.y + info.offset.y;
        updateIconPosition(id, newX, newY);
      }}
      initial={savedPosition}
      animate={savedPosition}
      transition={{ type: 'spring', stiffness: 500, damping: 50 }}
      onClick={(e) => {
        e.stopPropagation(); // prevent desktop background click from deselecting immediately
        // Prevent click if we just dragged
        if (e.detail === 0) return;
        setSelectedIconId(id);
        if (onClick) onClick(e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        openWindow(id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '6px',
        width: '76px',
        padding: '8px 4px',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: isActive
          ? 'var(--color-bg-surface-active)'
          : isSelected
          ? 'rgba(255, 255, 255, 0.15)' // slightly more visible for selected state
          : isHovered
          ? 'var(--color-bg-surface-hover)'
          : 'transparent',
        border: isSelected ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
        transition: 'background var(--transition-fast), border var(--transition-fast)',
      }}
    >
      {/* Icon */}
      <span
        style={{
          fontSize: '2.5rem',
          lineHeight: 1,
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
        }}
      >
        {icon}
      </span>

      {/* Label */}
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.3,
          fontFamily: 'var(--font-family)',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.6), 0 0 8px rgba(0, 0, 0, 0.3)',
          wordBreak: 'break-word',
          maxWidth: '72px',
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}
