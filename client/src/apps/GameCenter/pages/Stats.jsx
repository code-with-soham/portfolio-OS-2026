import { motion } from 'framer-motion';
import { TrophyFilled, ClockRegular, PlayCircleRegular, StarFilled } from '@fluentui/react-icons';
import { useGameStore } from '../../../store/useGameStore';
import { useEffect, useState } from 'react';

// Animated Counter
function AnimatedCounter({ value, suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    
    if (value === 0) return setDisplayValue(0);

    const animate = () => {
      start += increment;
      if (start < value) {
        setDisplayValue(Math.ceil(start));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
}

export default function Stats() {
  const stats = useGameStore(s => s.stats);
  const achievements = useGameStore(s => s.achievements);
  const favorites = useGameStore(s => s.favorites);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    return `${m}m`;
  };

  const nextLevelXP = stats.level * 100;
  const progress = (stats.xp % 100) / 100;

  return (
    <div className="gc-page">
      <h2>Player Profile</h2>

      {/* Level Card */}
      <div className="gc-card" style={{ maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 24, padding: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#107c10', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800 }}>
          {stats.level}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0' }}>Gamer Level {stats.level}</h3>
          <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', background: '#107c10', transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: '#aaaaaa', marginTop: 8 }}>
            {stats.xp} / {nextLevelXP} XP
          </div>
        </div>
      </div>

      <div className="gc-row">
        <h3>Statistics</h3>
        <div className="gc-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          
          <div className="gc-card" style={{ maxWidth: '100%' }}>
            <div className="gc-card-header"><PlayCircleRegular /> Games Played</div>
            <div className="gc-card-value"><AnimatedCounter value={stats.gamesPlayed} /></div>
          </div>
          
          <div className="gc-card" style={{ maxWidth: '100%' }}>
            <div className="gc-card-header"><ClockRegular /> Total Play Time</div>
            <div className="gc-card-value">{formatTime(stats.totalPlayTime)}</div>
          </div>
          
          <div className="gc-card" style={{ maxWidth: '100%' }}>
            <div className="gc-card-header"><TrophyFilled color="#F1C40F" /> Achievements</div>
            <div className="gc-card-value"><AnimatedCounter value={achievements.length} /></div>
          </div>

          <div className="gc-card" style={{ maxWidth: '100%' }}>
            <div className="gc-card-header"><StarFilled color="#F1C40F" /> Favorites</div>
            <div className="gc-card-value"><AnimatedCounter value={favorites.length} /></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
