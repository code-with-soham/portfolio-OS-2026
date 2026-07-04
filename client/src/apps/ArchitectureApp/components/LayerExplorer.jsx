import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import layersData from '../../../ai/knowledge/architecture/layers.json';

export default function LayerExplorer() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>System Architecture</h2>
        <p style={{ color: '#888', margin: 0 }}>The 7-layer tech stack of Portfolio OS 2026. Click a layer to view internals.</p>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {layersData.layers.map((layer, idx) => {
          const isExpanded = expandedId === layer.id;
          
          return (
            <motion.div
              key={layer.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, layout: { type: 'spring', stiffness: 300, damping: 30 } }}
              onClick={() => setExpandedId(isExpanded ? null : layer.id)}
              style={{
                background: isExpanded ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                border: isExpanded ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                boxShadow: isExpanded ? '0 10px 40px rgba(0,0,0,0.5)' : 'none',
                overflow: 'hidden'
              }}
              whileHover={{ scale: isExpanded ? 1 : 1.01, background: 'rgba(255,255,255,0.04)' }}
            >
              <motion.div layout style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#fff' }}>{layer.name}</h3>
                <span style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Layer {idx + 1}</span>
              </motion.div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                      {layer.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {layer.internals.map(internal => (
                        <div key={internal} style={{ background: '#111', border: '1px solid #333', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', color: '#ccc' }}>
                          {internal}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}
