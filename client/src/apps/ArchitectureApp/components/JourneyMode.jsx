import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DismissRegular } from '@fluentui/react-icons';

const STAGES = [
  { id: 'welcome', title: 'Portfolio OS 2026', subtitle: 'A software engineering command center.' },
  { id: 'presentation', title: 'Presentation Layer', subtitle: 'React, Vite, Framer Motion handling Desktop & Mobile UIs.' },
  { id: 'ai', title: 'Local AI Brain', subtitle: 'NLP pipelines executing purely on the client side.' },
  { id: 'state', title: 'Global State', subtitle: '20+ Zustand stores orchestrating isolated domains.' },
  { id: 'summary', title: '100K+ Lines of Code', subtitle: 'All seamlessly tied together.' }
];

export default function JourneyMode({ onClose }) {
  const [stage, setStage] = useState(0);

  const nextStage = () => {
    if (stage < STAGES.length - 1) {
      setStage(stage + 1);
    } else {
      onClose();
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '32px', right: '32px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 101 }}
      >
        <DismissRegular fontSize={24} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ textAlign: 'center', maxWidth: '800px', padding: '48px' }}
        >
          <h1 style={{ fontSize: '72px', fontWeight: 800, margin: '0 0 24px 0', background: 'linear-gradient(135deg, #fff, #666)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {STAGES[stage].title}
          </h1>
          <p style={{ fontSize: '24px', color: '#888', margin: 0 }}>
            {STAGES[stage].subtitle}
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ marginTop: '64px' }}
          >
            <button
              onClick={nextStage}
              style={{ background: '#fff', color: '#000', padding: '16px 32px', fontSize: '16px', fontWeight: 600, borderRadius: '32px', border: 'none', cursor: 'pointer' }}
            >
              {stage === STAGES.length - 1 ? 'End Journey' : 'Continue'}
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div style={{ position: 'absolute', bottom: '48px', display: 'flex', gap: '8px' }}>
        {STAGES.map((_, i) => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage === i ? '#fff' : '#333' }} />
        ))}
      </div>
    </div>
  );
}
