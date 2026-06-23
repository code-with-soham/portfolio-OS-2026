import React from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';
import { calculateReadinessScore } from '../engines/ReadinessEngine';
import Heatmap from './Heatmap';
import Achievements from './Achievements';
import TodaysMission from './TodaysMission';

export default function Dashboard() {
  const store = usePlacementStore();
  const readiness = calculateReadinessScore(store);
  
  const renderProgressRing = (score, label, color) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <circle 
            cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
          />
          <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="white" fontSize="14" fontWeight="bold">{Math.round(score)}%</text>
        </svg>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>{label}</span>
      </div>
    );
  };

  const getAverage = (obj) => {
    const vals = Object.values(obj);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner */}
      <div className="placement-card" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.8rem', color: 'var(--color-text-primary)' }}>
            Readiness Score: <span style={{ color: 'var(--color-accent)' }}>{readiness}%</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', margin: '5px 0 15px 0' }}>
            Calculated dynamically against {store.dreamCompany}'s requirements.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            {renderProgressRing(getAverage(store.dsaPatterns), 'DSA Mastery', '#0078D4')}
            {renderProgressRing(getAverage(store.coreCSMastery), 'Core CS', '#00c864')}
            {renderProgressRing(getAverage(store.aptitudeMastery), 'Aptitude', '#ff8c00')}
          </div>
        </div>
        
        {/* Study Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', minWidth: '200px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>{store.studyStats.questionsSolved}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Questions Solved</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff3366' }}>{store.streak}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Day Streak</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00c864' }}>{store.studyStats.totalHours}h</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Study Hours</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff8c00' }}>{Math.round(store.studyStats.mockScoreAvg)}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Mock Avg</div>
            </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <Heatmap />
          <Achievements />
        </div>
        <div>
          <TodaysMission />
        </div>
      </div>
      
      {/* DSA Detailed Mastery */}
      <div className="placement-card">
        <h3 style={{ marginTop: 0 }}>DSA Pattern Mastery (Detailed)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {Object.entries(store.dsaPatterns).map(([pattern, score]) => (
            <div key={pattern} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={pattern}>{pattern}</div>
              <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: 'var(--color-accent)', transition: 'width 0.5s' }}></div>
              </div>
              <div style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>{Math.round(score)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
