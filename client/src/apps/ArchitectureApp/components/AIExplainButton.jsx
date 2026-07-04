import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DismissRegular } from '@fluentui/react-icons';

// Import all JSON files with aiExplanation fields
import overviewData from '../../../ai/knowledge/architecture/overview.json';
import layersData from '../../../ai/knowledge/architecture/layers.json';
import runtimeData from '../../../ai/knowledge/architecture/runtime.json';
import aiBrainData from '../../../ai/knowledge/architecture/ai-brain.json';
import dataFlowData from '../../../ai/knowledge/architecture/data-flow.json';

const EXPLANATIONS = {
  overview: overviewData.aiExplanation,
  architecture: layersData.aiExplanation,
  runtime: runtimeData.aiExplanation,
  ai: aiBrainData.aiExplanation,
  data_flow: dataFlowData.aiExplanation
};

const MODES = [
  { id: 'summary', label: 'Summary', icon: '📝', description: 'Quick overview' },
  { id: 'beginner', label: 'Beginner', icon: '🎓', description: 'ELI5 explanation' },
  { id: 'technical', label: 'Technical', icon: '👨‍💻', description: 'Deep dive' },
  { id: 'recruiter', label: 'Recruiter', icon: '🏢', description: 'Business impact' }
];

export default function AIExplainButton({ activeTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('summary');

  const explanation = EXPLANATIONS[activeTab];
  if (!explanation) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'absolute', bottom: '48px', right: '24px', zIndex: 50,
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(224, 64, 251, 0.15)', border: '1px solid rgba(224, 64, 251, 0.3)',
          borderRadius: '24px', padding: '10px 20px',
          color: '#e040fb', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(224, 64, 251, 0.15)'
        }}
      >
        ✨ AI Explain
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '48px'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '600px',
                background: '#111', border: '1px solid #333',
                borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 24px', borderBottom: '1px solid #222'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>✨</span>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>AI Explain</span>
                </div>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '4px' }}>
                  <DismissRegular fontSize={20} />
                </button>
              </div>

              {/* Mode Selector */}
              <div style={{ display: 'flex', gap: '8px', padding: '16px 24px', borderBottom: '1px solid #222' }}>
                {MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      padding: '10px 8px', borderRadius: '8px', border: 'none',
                      background: activeMode === mode.id ? 'rgba(224, 64, 251, 0.1)' : 'transparent',
                      color: activeMode === mode.id ? '#e040fb' : '#888', cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{mode.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Explanation Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: '24px', minHeight: '120px' }}
                >
                  <p style={{
                    margin: 0, fontSize: '15px', color: '#ccc', lineHeight: '1.7',
                    fontWeight: 400
                  }}>
                    {explanation[activeMode] || 'No explanation available for this mode.'}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              <div style={{
                padding: '12px 24px', borderTop: '1px solid #222',
                fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e040fb' }} />
                Powered by Architecture Knowledge Base
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
