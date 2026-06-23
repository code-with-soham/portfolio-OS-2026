import React, { useEffect, useState } from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';
import { generateBaseRoadmap } from '../engines/RuleEngine';
import { enhanceRoadmapWithAI } from '../../../services/geminiPlacementService';

export default function Roadmap() {
  const store = usePlacementStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store.baseRoadmap.length === 0 && !loading) {
        handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
      setLoading(true);
      const base = generateBaseRoadmap(store.duration, store.companyType, store.focusMode);
      store.setRoadmaps(base, []); 
      
      const enhanced = await enhanceRoadmapWithAI(base);
      store.setRoadmaps(base, enhanced);
      setLoading(false);
  };

  const handleCompleteTask = (topic) => {
      store.completeTopic(topic);
      if (store.dsaPatterns[topic] !== undefined) {
          store.updatePatternMastery(topic, Math.min(100, store.dsaPatterns[topic] + 15));
      }
      store.addToRevisionQueue(topic, 1); 
  };

  const displayMap = store.enhancedRoadmap.length > 0 ? store.enhancedRoadmap : store.baseRoadmap;

  return (
    <div className="placement-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginTop: 0 }}>Placement Journey</h2>
        <button className="placement-btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? 'AI Optimizing...' : 'Regenerate Roadmap'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '10px' }}>
        {displayMap.map((dayPlan, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: 'var(--color-accent)' }}>Day {dayPlan.day} — {dayPlan.mainTopic}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px' }}>
                        {dayPlan.phase}
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {dayPlan.tasks.map(task => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                                type="checkbox" 
                                style={{ accentColor: 'var(--color-accent)', width: '18px', height: '18px', cursor: 'pointer' }} 
                                onChange={() => handleCompleteTask(dayPlan.mainTopic)}
                            />
                            <span style={{ fontSize: '0.95rem' }}>{task.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        ))}
        {displayMap.length === 0 && !loading && (
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '40px' }}>
                No roadmap generated yet. Click "Regenerate Roadmap" to begin.
            </div>
        )}
      </div>
    </div>
  );
}
