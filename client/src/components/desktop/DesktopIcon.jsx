// ============================================
// Portfolio OS 2026 — Desktop Icon
// ============================================
// Windows 11-style desktop icon with emoji/SVG icon on top,
// label text below. Features hover and active states.
//
// Phase 3: Click does nothing (no window manager yet).
// Phase 5: Double-click will open the app in a window.

import { useState } from 'react';

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

  return (
    <button
      id={`desktop-icon-${id}`}
      className="no-select"
      onClick={onClick}
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
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: isActive
          ? 'var(--color-bg-surface-active)'
          : isHovered
          ? 'var(--color-bg-surface-hover)'
          : 'transparent',
        transition: 'background var(--transition-fast)',
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
    </button>
  );
}
