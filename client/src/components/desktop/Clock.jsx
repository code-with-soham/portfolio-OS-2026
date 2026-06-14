// ============================================
// Portfolio OS 2026 — System Clock
// ============================================
// Windows 11-style taskbar clock showing time and date.
// Updates every second via setInterval.
//
// Display:
//   Line 1: "7:44 PM"
//   Line 2: "6/14/2026"

import { useState, useEffect } from 'react';

/**
 * Compact taskbar clock component
 */
export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 12-hour format time
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const timeStr = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

  // Short date: M/D/YYYY
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 12px',
        height: '100%',
        borderRadius: 'var(--radius-sm)',
        cursor: 'default',
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-bg-surface-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          lineHeight: 1.3,
          fontFamily: 'var(--font-family)',
        }}
      >
        {timeStr}
      </span>
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 400,
          color: 'var(--color-text-secondary)',
          lineHeight: 1.3,
          fontFamily: 'var(--font-family)',
        }}
      >
        {dateStr}
      </span>
    </div>
  );
}
