import React, { useState } from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

export default function ContestTracker() {
  const store = usePlacementStore();
  
  const [formData, setFormData] = useState({
    name: 'LeetCode Weekly',
    difficulty: 'Medium',
    rank: '',
    score: '',
    weakAreas: '',
    lessons: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    store.addContest({
      ...formData,
      date: new Date().toISOString(),
      id: Date.now().toString()
    });

    // Automatically push weak areas to revision queue
    const weakTopics = formData.weakAreas.split(',').map(t => t.trim()).filter(Boolean);
    weakTopics.forEach(topic => {
        store.addToRevisionQueue(topic, 1); // due tomorrow
        store.markWeakTopic(topic);
    });

    setFormData({ name: 'LeetCode Weekly', difficulty: 'Medium', rank: '', score: '', weakAreas: '', lessons: '' });
    alert('Contest logged! Weak topics pushed to Revision Engine.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div className="placement-card">
        <h2 style={{ marginTop: 0 }}>Contest Tracker</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Log your competitive programming contests to create a closed feedback loop.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Contest Name</label>
            <select value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }}>
              <option>LeetCode Weekly</option>
              <option>LeetCode Biweekly</option>
              <option>Codeforces Div 2</option>
              <option>Codeforces Div 3</option>
              <option>CodeChef Starters</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Difficulty</label>
            <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Rank</label>
            <input required type="number" placeholder="e.g. 1542" value={formData.rank} onChange={e => setFormData({...formData, rank: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Score / Rating Change</label>
            <input required type="text" placeholder="e.g. +45 or 3/4 solved" value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Weak Areas Found (comma separated)</label>
            <input required type="text" placeholder="e.g. Binary Search, Prefix Sum" value={formData.weakAreas} onChange={e => setFormData({...formData, weakAreas: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Lessons Learned</label>
            <textarea required rows={3} placeholder="e.g. Need to watch out for integer overflow on Prefix Sum." value={formData.lessons} onChange={e => setFormData({...formData, lessons: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white', resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
            <button type="submit" className="placement-btn-primary">Log Contest</button>
          </div>
        </form>
      </div>

      <div className="placement-card" style={{ flex: 1, overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>Past Contests</h3>
        {store.contests.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No contests logged yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {store.contests.slice().reverse().map(c => (
              <div key={c.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: 'var(--color-accent)' }}>{c.name}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', marginBottom: '10px' }}>
                  <span><span style={{ color: 'var(--color-text-secondary)' }}>Rank:</span> {c.rank}</span>
                  <span><span style={{ color: 'var(--color-text-secondary)' }}>Score:</span> {c.score}</span>
                  <span><span style={{ color: 'var(--color-text-secondary)' }}>Difficulty:</span> {c.difficulty}</span>
                </div>
                <div style={{ fontSize: '0.85rem', marginBottom: '5px' }}>
                  <span style={{ color: '#ff3366' }}>Failed Topics:</span> {c.weakAreas}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-text-primary)' }}>Lessons:</span> {c.lessons}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
