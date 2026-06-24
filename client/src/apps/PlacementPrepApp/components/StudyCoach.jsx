import React, { useState } from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';
import { askStudyCoach } from '../../../services/geminiPlacementService';

export default function StudyCoach() {
  const store = usePlacementStore();
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    const userMsg = { role: 'user', content: query };
    setChat([...chat, userMsg]);
    setQuery('');
    setLoading(true);

    const context = {
      weakTopics: store.weakTopics,
      currentPhase: store.currentPhase
    };

    const aiResponse = await askStudyCoach(query, context);
    
    setChat(prev => [...prev, { role: 'ai', content: aiResponse }]);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="placement-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px' }}>
        <h2 style={{ marginTop: 0 }}>AI Study Coach</h2>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px 0' }}>
          {chat.length === 0 && (
            <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', margin: 'auto' }}>
              Ask me anything about DSA, Core CS, or Interviews! I know your weak topics and current phase.
            </div>
          )}
          {chat.map((msg, idx) => (
            <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', background: msg.role === 'user' ? 'var(--color-accent)' : 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '12px', border: msg.role === 'ai' ? '1px solid var(--color-border)' : 'none' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{msg.content}</pre>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', padding: '12px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '10px', width: '16px', height: '16px', border: '2px solid var(--color-border)', borderTop: '2px solid var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              Thinking... Analyzing...
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="E.g., Explain Sliding Window approach"
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          <button className="placement-btn-primary" onClick={handleAsk} disabled={loading}>
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
