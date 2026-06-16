import { useState, useEffect } from 'react';

/**
 * Mini calendar showing current month and current date
 */
export default function CalendarPanel() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update the date at midnight if left open
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const fullDateString = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  // Split into "Monday" and "June 16, 2026"
  const [weekday, ...dateParts] = fullDateString.split(', ');
  const dateString = dateParts.join(', ');

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
      {/* Date Header */}
      <div style={{ marginBottom: '16px' }}>
        <p
          style={{
            fontSize: '0.875rem',
            fontWeight: 400,
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-family)',
            lineHeight: 1.2,
          }}
        >
          {weekday}
        </p>
        <p
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family)',
            lineHeight: 1.2,
          }}
        >
          {dateString}
        </p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <p
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {monthName}
        </p>
      </div>

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
              width: '24px',
              height: '24px',
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
