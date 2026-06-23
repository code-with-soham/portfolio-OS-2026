import React, { useState } from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

export default function TodaysMission() {
  const store = usePlacementStore();

  // In a real app, this would read today's tasks from baseRoadmap or enhancedRoadmap
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Two Sum', category: 'DSA', completed: false },
    { id: '2', title: 'Majority Element', category: 'DSA', completed: false },
    { id: '3', title: 'Normalization', category: 'DBMS', completed: false },
    { id: '4', title: 'Profit & Loss', category: 'Aptitude', completed: false },
    { id: '5', title: 'Arrays Revision', category: 'Revision', completed: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        if (!t.completed) {
            // Increment heatmap when a task is completed
            store.incrementHeatmap();
            store.completeTopic(t.title);
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);

  return (
    <div className="placement-card" style={{ marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
      <h3 style={{ marginTop: 0, color: 'var(--color-accent)' }}>Today's Mission 🎯</h3>
      
      {allCompleted && (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 200, 100, 0.9)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, backdropFilter: 'blur(4px)'
        }}>
            <span style={{ fontSize: '3rem' }}>🔥</span>
            <h2 style={{ color: 'white', margin: '10px 0 0 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Mission Complete</h2>
            <p style={{ color: 'white', margin: '5px 0 0 0' }}>Amazing work today! Rest up.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
        {tasks.map(task => (
          <label 
            key={task.id} 
            style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', 
                padding: '12px 15px', 
                background: task.completed ? 'rgba(0, 200, 100, 0.1)' : 'rgba(0,0,0,0.2)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
          >
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleTask(task.id)}
              style={{ width: '18px', height: '18px', accentColor: '#00c864', cursor: 'pointer' }}
            />
            <div style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
              {task.title}
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'var(--color-text-secondary)' }}>
              {task.category}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
