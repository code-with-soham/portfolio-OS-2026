import { useState } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('Month'); // Month, Week, Day

  const events = useCalendarStore(state => state.events);
  const addEvent = useCalendarStore(state => state.addEvent);
  const deleteEvent = useCalendarStore(state => state.deleteEvent);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleAddEvent = () => {
    const title = prompt('Enter event title:');
    if (!title) return;
    const dateStr = prompt('Enter date (1-31):', new Date().getDate());
    const date = parseInt(dateStr, 10);
    if (isNaN(date) || date < 1 || date > 31) return;
    const time = prompt('Enter time (e.g., 10:00 AM):', '10:00 AM') || '10:00 AM';
    
    addEvent({
      title,
      date,
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      time,
      type: 'event'
    });
  };

  const currentMonthEvents = events.filter(e => e.month === currentDate.getMonth() && e.year === currentDate.getFullYear());

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--color-bg-base)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)' }}>
      {/* Sidebar / Mini Calendar & Events */}
      <div style={{ width: '260px', borderRight: '1px solid var(--color-border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button onClick={handleAddEvent} style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          + New Event
        </button>

        <div>
          <h3 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>Upcoming Events</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentMonthEvents.map(ev => (
              <div key={ev.id} style={{ background: 'var(--color-bg-surface)', padding: '12px', borderRadius: '6px', borderLeft: `4px solid var(--color-accent)`, position: 'relative' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{ev.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  {currentDate.toLocaleString('default', { month: 'short' })} {ev.date} • {ev.time}
                </div>
                <button 
                  onClick={() => deleteEvent(ev.id)}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              </div>
            ))}
            {currentMonthEvents.length === 0 && (
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>No events this month.</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ height: '64px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '300', margin: 0 }}>
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={prevMonth} style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>&lt;</button>
              <button onClick={() => setCurrentDate(new Date())} style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>Today</button>
              <button onClick={nextMonth} style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>&gt;</button>
            </div>
          </div>
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
            {['Day', 'Week', 'Month'].map(v => (
              <button 
                key={v}
                onClick={() => setView(v)}
                style={{ 
                  background: view === v ? 'var(--color-bg-surface-hover)' : 'transparent', 
                  border: 'none', 
                  padding: '6px 12px', 
                  cursor: 'pointer', 
                  color: 'var(--color-text-primary)',
                  fontWeight: view === v ? 'bold' : 'normal'
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: '40px repeat(5, 1fr)', background: 'var(--color-border)', gap: '1px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ background: 'var(--color-bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} style={{ background: 'var(--color-bg-base)', opacity: 0.5 }} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = new Date().getDate() === dayNum && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
            const dayEvents = currentMonthEvents.filter(e => e.date === dayNum);
            
            return (
              <div key={dayNum} style={{ background: 'var(--color-bg-base)', padding: '8px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', 
                  borderRadius: '50%', background: isToday ? 'var(--color-accent)' : 'transparent', 
                  color: isToday ? '#fff' : 'inherit', fontSize: '14px', marginBottom: '4px'
                }}>
                  {dayNum}
                </span>
                {dayEvents.map(ev => (
                  <div key={ev.id} style={{ fontSize: '11px', background: 'var(--color-accent)', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={`${ev.time} ${ev.title}`}>
                    {ev.time} {ev.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

