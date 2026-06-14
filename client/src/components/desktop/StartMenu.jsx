// ============================================
// Portfolio OS 2026 — Start Menu
// ============================================
// Windows 11-style centered start menu floating above the taskbar.
//
// Layout:
//   [Search bar]
//   [Pinned apps grid — 6 apps]
//   [Recommended section — 3 recent items]
//   [User profile bar + power]
//
// Animated with Framer Motion (scale + fade + translateY).
// Phase 3: App clicks do nothing (no window manager yet).

import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { DESKTOP_APPS, RECOMMENDED_ITEMS, APP_AUTHOR } from '../../constants';
import { useState } from 'react';

/**
 * Pinned app icon in the start menu grid
 */
function PinnedApp({ app }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      id={`start-app-${app.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 8px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: hovered ? 'var(--color-bg-surface-hover)' : 'transparent',
        transition: 'background var(--transition-fast)',
        minWidth: '80px',
      }}
    >
      <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{app.icon}</span>
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-family)',
          textAlign: 'center',
        }}
      >
        {app.label}
      </span>
    </button>
  );
}

/**
 * Recommended item row
 */
function RecommendedItem({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: hovered ? 'var(--color-bg-surface-hover)' : 'transparent',
        transition: 'background var(--transition-fast)',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{item.icon}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {item.label}
        </span>
        <span
          style={{
            fontSize: '0.6875rem',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {item.detail}
        </span>
      </div>
    </button>
  );
}

/**
 * Start Menu main component
 */
export default function StartMenu() {
  const { isStartMenuOpen, closeStartMenu } = useDesktopStore();

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <>
          {/* Invisible backdrop to close the menu on click outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStartMenu}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
            }}
          />

          {/* Start Menu panel */}
          <motion.div
            id="start-menu"
            className="no-select glass-heavy"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--taskbar-height) + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(580px, calc(100vw - 32px))',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-panel)',
              overflow: 'hidden',
              zIndex: 950,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Search bar */}
            <div style={{ padding: '24px 24px 16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '24px',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-tertiary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-tertiary)',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  Type to search
                </span>
              </div>
            </div>

            {/* Pinned section */}
            <div style={{ padding: '0 24px 16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  Pinned
                </span>
                <button
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-bg-surface)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  All apps →
                </button>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '4px',
                }}
              >
                {DESKTOP_APPS.map((app) => (
                  <PinnedApp key={app.id} app={app} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '0 24px',
              }}
            />

            {/* Recommended section */}
            <div style={{ padding: '16px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  Recommended
                </span>
                <button
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-bg-surface)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  More →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {RECOMMENDED_ITEMS.map((item) => (
                  <RecommendedItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '0 24px',
              }}
            />

            {/* User bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px 16px',
              }}
            >
              {/* User info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {/* Avatar circle */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-accent), #60cdff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  SK
                </div>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  {APP_AUTHOR}
                </span>
              </div>

              {/* Power button */}
              <button
                title="Power"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
