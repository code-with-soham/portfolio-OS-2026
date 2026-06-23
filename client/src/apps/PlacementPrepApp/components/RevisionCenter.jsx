import React from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

export default function RevisionCenter() {
  const store = usePlacementStore();

  return (
    <div className="placement-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginTop: 0 }}>Revision Center</h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Powered by spaced repetition. Topics appear here automatically 1, 3, 7, 15, and 30 days after you complete them.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px', flex: 1 }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#ff3366' }}>Due Today</h3>
            {store.revisionQueue.length === 0 ? (
                <div style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No revisions due today. Keep studying!</div>
            ) : (
                <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--color-text-primary)' }}>
                    {store.revisionQueue.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: '10px' }}>
                            {item.topic} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>(Due: {new Date(item.dueDate).toLocaleDateString()})</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#ff8c00' }}>Weak Topics</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Topics dropping below 60% mastery are pulled here.</p>
            {store.weakTopics.length === 0 ? (
                <div style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No weak topics detected. Great job!</div>
            ) : (
                <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--color-text-primary)' }}>
                    {store.weakTopics.map((topic, idx) => (
                        <li key={idx} style={{ marginBottom: '10px' }}>{topic}</li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
}
