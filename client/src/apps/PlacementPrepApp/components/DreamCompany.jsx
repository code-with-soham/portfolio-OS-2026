import React from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';
import { DreamCompanyEngine } from '../engines/DreamCompanyEngine';

export default function DreamCompany() {
  const store = usePlacementStore();
  const profile = DreamCompanyEngine.getProfile(store.dreamCompany);
  const readiness = DreamCompanyEngine.calculateReadiness(store);

  return (
    <div className="placement-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginTop: 0, color: 'var(--color-accent)' }}>Dream Company Focus: {store.dreamCompany || 'Google'}</h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Your personalized readiness score based on {store.dreamCompany}'s specific hiring matrix.
      </p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', alignItems: 'center' }}>
        <div style={{ 
          width: '120px', height: '120px', borderRadius: '50%', 
          background: `conic-gradient(var(--color-accent) ${readiness * 3.6}deg, rgba(0,0,0,0.3) 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 120, 212, 0.2)'
        }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            background: 'var(--color-bg-elevated)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{readiness}%</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Ready</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 15px 0' }}>{store.dreamCompany} Hiring Matrix</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(profile).filter(([_, weight]) => weight > 0).map(([topic, weight]) => (
              <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ width: '120px', fontSize: '0.9rem' }}>{topic}</span>
                <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${weight}%`, height: '100%', background: 'var(--color-accent)' }}></div>
                </div>
                <span style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{weight}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        <h4 style={{ marginTop: 0, marginBottom: '10px' }}>AI Recommended Action</h4>
        {readiness < 50 ? (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#ff8c00' }}>
            Your foundational skills need work before targeting {store.dreamCompany}. Focus heavily on the {Object.keys(profile).reduce((a,b) => profile[a] > profile[b] ? a : b)} section for the next 2 weeks.
          </p>
        ) : readiness < 80 ? (
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-accent)' }}>
            You are on the right track! To bridge the gap to 80%, start giving full mock interviews tailored for {store.dreamCompany} specifically.
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#00c864' }}>
            You are in the green zone! Maintain consistency and focus on speed and edge-case optimization.
          </p>
        )}
      </div>
    </div>
  );
}
