// ============================================
// Portfolio OS 2026 — Notification Center
// ============================================
// Windows 11-style right-side notification panel with:
// - Quick settings toggles (decorative)
// - Brightness/volume sliders (decorative)
// - Notification area displaying useNotificationStore history
// - Mini calendar showing current month

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { QUICK_SETTINGS } from '../../constants';

/**
 * Quick setting toggle tile
 */
function QuickSettingTile({ setting }) {
  const [active, setActive] = useState(setting.active);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => setActive(!active)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        padding: '10px 8px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: active
          ? 'var(--color-accent)'
          : hovered
          ? 'var(--color-bg-surface-hover)'
          : 'var(--color-bg-surface)',
        color: active ? '#ffffff' : 'var(--color-text-primary)',
        transition: 'all var(--transition-fast)',
        minWidth: '0',
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>{setting.icon}</span>
      <span
        style={{
          fontSize: '0.625rem',
          fontWeight: 400,
          fontFamily: 'var(--font-family)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {setting.label}
      </span>
    </button>
  );
}

/**
 * Decorative range slider
 */
function Slider({ icon, defaultValue = 70 }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '4px 0',
      }}
    >
      <span style={{ fontSize: '0.875rem', lineHeight: 1, width: '20px', textAlign: 'center' }}>
        {icon}
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          flex: 1,
          height: '4px',
          appearance: 'none',
          background: `linear-gradient(to right, var(--color-accent) ${value}%, var(--color-bg-surface) ${value}%)`,
          borderRadius: '2px',
          outline: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

/**
 * Mini calendar showing current month
 */
function MiniCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get days in month and starting day of week
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun

  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Build grid cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ padding: '4px 0' }}>
      <p
        style={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: '10px',
          fontFamily: 'var(--font-family)',
        }}
      >
        {monthName}
      </p>

      {/* Day of week headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          textAlign: 'center',
          marginBottom: '4px',
        }}
      >
        {dayLabels.map((d) => (
          <span
            key={d}
            style={{
              fontSize: '0.625rem',
              color: 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-family)',
              padding: '2px 0',
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Calendar dates */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          textAlign: 'center',
        }}
      >
        {cells.map((day, i) => (
          <span
            key={i}
            style={{
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-family)',
              padding: '3px',
              borderRadius: '50%',
              color: day === today ? '#ffffff' : day ? 'var(--color-text-secondary)' : 'transparent',
              background: day === today ? 'var(--color-accent)' : 'transparent',
              fontWeight: day === today ? 600 : 400,
              lineHeight: '20px',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            {day || ''}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Helper to format timestamp like "[10:21 PM]"
 */
function formatTime(timestamp) {
  const d = new Date(timestamp);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `[${hours}:${minutes} ${ampm}]`;
}

/**
 * Notification Center main component
 */
export default function NotificationCenter() {
  const { isNotificationCenterOpen, closeNotificationCenter } = useDesktopStore();
  const history = useNotificationStore((s) => s.history);
  const clearHistory = useNotificationStore((s) => s.clearHistory);

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <>
          {/* Invisible backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNotificationCenter}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
            }}
          />

          {/* Panel */}
          <motion.div
            id="notification-center"
            className="no-select glass-heavy"
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.99 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--taskbar-height) + 12px)',
              right: '12px',
              width: 'min(360px, calc(100vw - 24px))',
              maxHeight: 'calc(100vh - var(--taskbar-height) - 24px)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-panel)',
              overflow: 'hidden',
              zIndex: 950,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Quick Settings grid */}
            <div style={{ padding: '20px 20px 12px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                }}
              >
                {QUICK_SETTINGS.map((s) => (
                  <QuickSettingTile key={s.id} setting={s} />
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div style={{ padding: '0 20px 12px' }}>
              <Slider icon="☀️" defaultValue={70} />
              <Slider icon="🔊" defaultValue={50} />
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '0 20px',
              }}
            />

            {/* Notifications area */}
            <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
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
                  Notifications
                </span>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--color-text-secondary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {history.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        background: 'var(--color-bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{notif.icon}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400, marginRight: '6px' }}>
                            {formatTime(notif.timestamp)}
                          </span>
                          {notif.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                          {notif.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 0',
                    color: 'var(--color-text-tertiary)',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔔</span>
                  No new notifications
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '0 20px',
              }}
            />

            {/* Mini calendar */}
            <div style={{ padding: '16px 20px 20px' }}>
              <MiniCalendar />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
