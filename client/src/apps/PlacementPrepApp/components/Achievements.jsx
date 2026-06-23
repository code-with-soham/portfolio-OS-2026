import React from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

const ALL_ACHIEVEMENTS = [
  { id: 'streak_7', title: '7 Day Streak', icon: '🔥', description: 'Study for 7 days consecutively' },
  { id: 'array_master', title: 'Array Master', icon: '🏆', description: 'Solve 50 Array questions' },
  { id: 'hash_expert', title: 'HashMap Expert', icon: '🏆', description: 'Solve 30 HashMap problems' },
  { id: 'dbms_warrior', title: 'DBMS Warrior', icon: '🛡️', description: 'Master DBMS core concepts' }
];

export default function Achievements() {
  const achievements = usePlacementStore(s => s.achievements);
  const userAchIds = achievements.map(a => a.id);

  return (
    <div className="placement-card" style={{ marginBottom: '20px' }}>
      <h3 style={{ marginTop: 0 }}>Achievements</h3>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '15px' }}>
        {ALL_ACHIEVEMENTS.map(ach => {
          const unlocked = userAchIds.includes(ach.id);
          return (
            <div 
              key={ach.id} 
              style={{ 
                flex: '1 1 150px',
                background: unlocked ? 'rgba(0, 200, 100, 0.15)' : 'rgba(0,0,0,0.2)',
                border: unlocked ? '1px solid rgba(0, 200, 100, 0.5)' : '1px solid var(--color-border)',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: unlocked ? 1 : 0.5,
                filter: unlocked ? 'none' : 'grayscale(100%)'
              }}
              title={ach.description}
            >
              <div style={{ fontSize: '2rem' }}>{ach.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: unlocked ? '#00c864' : 'var(--color-text-primary)' }}>{ach.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{unlocked ? 'Unlocked!' : 'Locked'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
