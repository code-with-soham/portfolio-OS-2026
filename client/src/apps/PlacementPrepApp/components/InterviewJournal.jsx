import React, { useState } from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

export default function InterviewJournal() {
  const store = usePlacementStore();
  const [formData, setFormData] = useState({
    company: '',
    round: 'Technical',
    questions: '',
    mistakes: '',
    confidence: 5,
    result: 'Pending'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    store.addInterviewExperience({
      ...formData,
      date: new Date().toISOString(),
      id: Date.now().toString()
    });
    setFormData({ company: '', round: 'Technical', questions: '', mistakes: '', confidence: 5, result: 'Pending' });
    alert('Interview experience logged!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div className="placement-card">
        <h2 style={{ marginTop: 0 }}>Interview Journal</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Log your real and mock interviews to track mistakes and build a personal improvement database.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Company</label>
            <input required type="text" placeholder="e.g. Amazon Mock" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Round</label>
            <select value={formData.round} onChange={e => setFormData({...formData, round: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }}>
              <option>Technical (DSA)</option>
              <option>Technical (Core CS)</option>
              <option>System Design</option>
              <option>HR / Behavioral</option>
              <option>Managerial</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Questions Asked</label>
            <textarea required rows={2} placeholder="e.g. Merge K Sorted Lists, Explain Virtual Memory" value={formData.questions} onChange={e => setFormData({...formData, questions: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white', resize: 'vertical' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Mistakes Made & Improvement</label>
            <textarea required rows={2} placeholder="e.g. Forgot to handle null case in linked list. Need to be more vocal." value={formData.mistakes} onChange={e => setFormData({...formData, mistakes: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Confidence (1-10): {formData.confidence}</label>
            <input type="range" min="1" max="10" value={formData.confidence} onChange={e => setFormData({...formData, confidence: parseInt(e.target.value)})} style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Result</label>
            <select value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'white' }}>
              <option>Pending</option>
              <option>Passed</option>
              <option>Failed</option>
              <option>Mock - Good</option>
              <option>Mock - Needs Work</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
            <button type="submit" className="placement-btn-primary">Log Journal Entry</button>
          </div>
        </form>
      </div>

      <div className="placement-card" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Analytics Section */}
        {store.interviewExperiences.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#ff8c00' }}>Common Mistakes</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {Array.from(new Set(store.interviewExperiences.map(e => e.mistakes.split('.')[0]))).slice(0, 3).map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--color-accent)' }}>Improvement Trend</h4>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '40px' }}>
                {store.interviewExperiences.slice(-10).map((exp, idx) => (
                   <div key={idx} style={{ flex: 1, background: 'var(--color-accent)', height: `${exp.confidence * 10}%`, borderRadius: '2px 2px 0 0', opacity: 0.8 }} title={`Confidence: ${exp.confidence}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 style={{ marginTop: 0 }}>Past Experiences</h3>
          {store.interviewExperiences.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No experiences logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {store.interviewExperiences.slice().reverse().map(exp => (
              <div key={exp.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <strong style={{ color: 'var(--color-accent)' }}>{exp.company} - {exp.round}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{new Date(exp.date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.85rem', marginBottom: '5px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Questions:</span> {exp.questions}
                </div>
                <div style={{ fontSize: '0.85rem', marginBottom: '10px' }}>
                  <span style={{ color: '#ff8c00' }}>Mistakes:</span> {exp.mistakes}
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px' }}>Confidence: {exp.confidence}/10</span>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px' }}>Result: {exp.result}</span>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
