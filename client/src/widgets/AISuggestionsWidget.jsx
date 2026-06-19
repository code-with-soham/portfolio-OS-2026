import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { SparkleFilled, CheckmarkCircleFilled } from '@fluentui/react-icons';
import { aiBrain } from '../ai/brain/aiBrain';

export default function AISuggestionsWidget() {
  const { accentColor } = useThemeStore();
  const [suggestions, setSuggestions] = useState([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Dynamic greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    setSuggestions(aiBrain.getSuggestions());
  }, []);

  return (
    <motion.div 
      className="widget-card ai-suggestions"
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'rgba(20, 20, 20, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '20px',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '340px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${accentColor}, #222)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <SparkleFilled style={{ fontSize: '18px', color: '#fff' }} />
        </div>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{greeting} Soham 👋</h3>
      </div>

      <div style={{ marginTop: '4px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Priority Tasks
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {suggestions.map((task) => (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>
              <CheckmarkCircleFilled style={{ color: task.done ? '#4ade80' : 'rgba(255,255,255,0.3)', fontSize: '18px' }} />
              <span style={{ color: task.done ? 'rgba(255,255,255,0.9)' : '#fff' }}>{task.text}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
