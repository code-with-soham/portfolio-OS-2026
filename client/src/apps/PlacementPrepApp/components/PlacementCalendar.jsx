import React from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

export default function PlacementCalendar() {
  const store = usePlacementStore();
  
  // A simple 35-day calendar mapping mock dates, contest dates, and company applications
  const days = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const dayStr = d.toISOString().split('T')[0];
    
    // Map data to this day
    const heatmapCount = store.heatmapData[dayStr] || 0;
    const contests = store.contests.filter(c => c.date.startsWith(dayStr));
    const interviews = store.interviewExperiences.filter(exp => exp.date.startsWith(dayStr));
    
    return {
        date: d,
        dayStr,
        heatmapCount,
        contests,
        interviews
    };
  });

  return (
    <div className="placement-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginTop: 0 }}>Placement Calendar</h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>Your Career OS monthly view tracking activity, contests, and mock interviews.</p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '10px', 
        marginTop: '20px',
        flex: 1
      }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 600, paddingBottom: '10px' }}>{day}</div>
        ))}

        {days.map((dayData, idx) => {
          const hasActivity = dayData.heatmapCount > 0 || dayData.contests.length > 0 || dayData.interviews.length > 0;
          return (
            <div 
              key={dayData.dayStr}
              style={{
                background: hasActivity ? 'rgba(0, 120, 212, 0.1)' : 'rgba(0,0,0,0.2)',
                border: hasActivity ? '1px solid rgba(0, 120, 212, 0.3)' : '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minHeight: '80px',
                transition: 'transform 0.2s'
              }}
              className="calendar-day"
            >
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: dayData.date.toDateString() === new Date().toDateString() ? 'var(--color-accent)' : 'var(--color-text-secondary)', fontWeight: dayData.date.toDateString() === new Date().toDateString() ? 'bold' : 'normal' }}>
                {dayData.date.getDate()}
              </div>
              
              {dayData.heatmapCount > 0 && (
                <div style={{ fontSize: '0.7rem', background: 'var(--color-accent)', color: 'white', padding: '2px 4px', borderRadius: '4px', textAlign: 'center' }}>
                  {dayData.heatmapCount} Solved
                </div>
              )}
              {dayData.contests.length > 0 && (
                <div style={{ fontSize: '0.7rem', background: '#ff8c00', color: 'white', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  🏆 Contest
                </div>
              )}
              {dayData.interviews.length > 0 && (
                <div style={{ fontSize: '0.7rem', background: '#00c864', color: 'white', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  💼 Interview
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
