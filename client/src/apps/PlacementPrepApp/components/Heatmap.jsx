import React from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

export default function Heatmap() {
  const heatmapData = usePlacementStore(s => s.heatmapData);

  // Generate last 35 days (5 weeks)
  const days = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return d.toISOString().split('T')[0];
  });

  const getIntensityColor = (count) => {
    if (!count || count === 0) return 'rgba(255, 255, 255, 0.05)';
    if (count === 1) return 'rgba(0, 120, 212, 0.4)';
    if (count <= 3) return 'rgba(0, 120, 212, 0.7)';
    return 'rgba(0, 120, 212, 1)'; // Max intensity
  };

  return (
    <div className="placement-card" style={{ marginBottom: '20px' }}>
      <h3 style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between' }}>
        <span>Coding Heatmap</span>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 'normal' }}>Last 35 Days</span>
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gridTemplateRows: 'repeat(5, 1fr)',
        gap: '6px',
        gridAutoFlow: 'column',
        marginTop: '15px'
      }}>
        {days.map((dayStr, idx) => {
          const count = heatmapData[dayStr] || 0;
          return (
            <div 
              key={dayStr}
              title={`${dayStr}: ${count} questions solved`}
              style={{
                aspectRatio: '1',
                borderRadius: '4px',
                background: getIntensityColor(count),
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          );
        })}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '15px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
        <span>Less</span>
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.05)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(0, 120, 212, 0.4)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(0, 120, 212, 0.7)' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(0, 120, 212, 1)' }} />
        <span>More</span>
      </div>
    </div>
  );
}
