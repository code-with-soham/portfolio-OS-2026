import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useEffect, useRef } from 'react';

export default function ContextMenu() {
  const { contextMenu, closeContextMenu } = useDesktopStore();
  const { isOpen, x, y, items } = contextMenu;
  const menuRef = useRef(null);

  // Close menu on click outside or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      // Allow clicking inside the menu without closing (unless it's an item, handled separately)
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeContextMenu();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeContextMenu();
    };

    // Use a timeout to prevent immediate closing from the same click event
    setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
      window.addEventListener('contextmenu', handleClickOutside);
    }, 0);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('contextmenu', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeContextMenu]);

  // Adjust position to stay within viewport
  let adjustedX = x;
  let adjustedY = y;
  const menuWidth = 220; // approximate width
  const menuHeight = items.length * 36 + 16; // approximate height

  if (typeof window !== 'undefined') {
    if (x + menuWidth > window.innerWidth) {
      adjustedX = window.innerWidth - menuWidth - 10;
    }
    // ensure we don't go below the taskbar (taskbar is ~48px height)
    if (y + menuHeight > window.innerHeight - 48) {
      adjustedY = window.innerHeight - menuHeight - 48 - 10;
    }
  }

  return (
    <AnimatePresence>
      {isOpen && items.length > 0 && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="glass-heavy no-select"
          style={{
            position: 'absolute',
            left: adjustedX,
            top: adjustedY,
            width: 'min(240px, 100vw)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-panel)',
            zIndex: 9999, // Ensure it's on top of everything
            display: 'flex',
            flexDirection: 'column',
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  style={{
                    height: '1px',
                    background: 'var(--color-border)',
                    margin: '4px 8px',
                  }}
                />
              );
            }

            return (
              <button
                key={`item-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.onClick) item.onClick();
                  closeContextMenu();
                }}
                disabled={item.disabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: item.disabled ? 'default' : 'pointer',
                  textAlign: 'left',
                  color: item.disabled ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-family)',
                  opacity: item.disabled ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!item.disabled) {
                    e.currentTarget.style.background = 'var(--color-bg-surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {item.icon && <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>{item.icon}</span>}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.shortcut && (
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
