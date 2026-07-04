import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Using a simple fetch for the metrics file in public/ or importing directly if it's in src/data
// Assuming we generated it to src/data/metrics.json
import metricsData from '../../../data/metrics.json';

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // In a real app we might fetch this if it changes, but here we just use the imported JSON
    setMetrics(metricsData);
  }, []);

  if (!metrics) return null;

  return (
    <div style={{ padding: '48px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>System Metrics</h2>
        <p style={{ color: '#888', margin: 0 }}>Real-time statistics of the Portfolio OS codebase.</p>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        
        {Object.entries({
          'React Components': metrics.components,
          'Zustand Stores': metrics.stores,
          'Window Apps': metrics.apps,
          'Desktop Widgets': metrics.widgets,
          'Keyboard Shortcuts': metrics.shortcuts,
          'AI Intents': metrics.aiIntents
        }).map(([label, value], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
            <span style={{ fontSize: '48px', fontWeight: 700, color: '#fff' }}>{value}</span>
          </motion.div>
        ))}

      </div>
      
      {/* Dummy charts for showcase */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #222', borderRadius: '16px', padding: '32px' }}>
           <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Technology Distribution</h3>
           {/* Simple custom bar chart representation */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {[ { l: 'React', p: 65, c: '#61dafb' }, { l: 'Node.js', p: 20, c: '#339933' }, { l: 'CSS', p: 10, c: '#2965f1' }, { l: 'Other', p: 5, c: '#888' } ].map(t => (
               <div key={t.l} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                 <span style={{ width: '80px', fontSize: '13px', color: '#ccc' }}>{t.l}</span>
                 <div style={{ flex: 1, height: '8px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
                   <motion.div initial={{ width: 0 }} animate={{ width: `${t.p}%` }} transition={{ duration: 1, delay: 0.5 }} style={{ height: '100%', background: t.c, borderRadius: '4px' }} />
                 </div>
                 <span style={{ width: '40px', fontSize: '12px', color: '#888', textAlign: 'right' }}>{t.p}%</span>
               </div>
             ))}
           </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #222', borderRadius: '16px', padding: '32px' }}>
           <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Codebase Architecture</h3>
           <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
             The system is heavily weighted towards frontend orchestration (React + Zustand) simulating backend OS concepts. The local AI Brain contributes significantly to the logic layer without external dependencies.
           </p>
        </div>
      </div>
    </div>
  );
}
