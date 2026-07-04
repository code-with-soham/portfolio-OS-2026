import { useState } from 'react';
import { motion } from 'framer-motion';
import brainData from '../../../ai/knowledge/architecture/ai-brain.json';

export default function AIBrain() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div style={{ padding: '48px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>AI Brain Pipeline</h2>
        <p style={{ color: '#888', margin: 0 }}>The local NLP execution pipeline that determines intent and executes OS actions.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        {/* Animated connecting line */}
        <div style={{ position: 'absolute', left: '32px', top: '32px', bottom: '32px', width: '2px', background: '#333', zIndex: 0 }} />

        {brainData.pipeline.map((node, idx) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1 }}
          >
            <div style={{ width: '64px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-accent)', marginTop: '24px', boxShadow: '0 0 10px var(--color-accent)' }} />
            </div>
            
            <div 
              style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid #333', borderRadius: '12px', padding: '24px', cursor: node.expandable ? 'pointer' : 'default' }}
              onClick={() => node.expandable && setExpandedId(expandedId === node.id ? null : node.id)}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff' }}>{node.label}</h3>
              <p style={{ margin: 0, color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>{node.description}</p>
              
              {node.expandable && expandedId === node.id && node.details && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #333' }}
                >
                  <h4 style={{ margin: '0 0 12px 0', color: '#ccc', fontSize: '14px' }}>{node.details.title}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {node.details.items.map(item => (
                      <span key={item} style={{ background: '#111', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#888' }}>{item}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
