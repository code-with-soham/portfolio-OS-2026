import { useState } from 'react';
import { motion } from 'framer-motion';
import dataFlows from '../../../ai/knowledge/architecture/data-flow.json';

export default function DataFlow() {
  const [activeFlowId, setActiveFlowId] = useState(dataFlows.flows[0].id);

  const activeFlow = dataFlows.flows.find(f => f.id === activeFlowId);

  return (
    <div style={{ padding: '48px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>Data Flow</h2>
        <p style={{ color: '#888', margin: 0 }}>Sequence pipelines showing how data moves across the architecture.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
        {dataFlows.flows.map(flow => (
          <button
            key={flow.id}
            onClick={() => setActiveFlowId(flow.id)}
            style={{
              background: activeFlowId === flow.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: activeFlowId === flow.id ? '#fff' : '#888',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {flow.title}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid #222' }}>
        {activeFlow.steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.2 }}
              style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#888' }}
            >
              {idx + 1}
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.2 + 0.1 }}
              style={{ flex: 1, background: '#111', padding: '16px 24px', borderRadius: '8px', border: '1px solid #222', color: '#ddd' }}
            >
              {step}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
