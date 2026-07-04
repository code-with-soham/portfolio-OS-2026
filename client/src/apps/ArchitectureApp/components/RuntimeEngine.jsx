import { useState } from 'react';
import { motion } from 'framer-motion';
import runtimeData from '../../../ai/knowledge/architecture/runtime.json';
import { PlayRegular } from '@fluentui/react-icons';

export default function RuntimeEngine() {
  const flow = runtimeData.flows[0];
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const startAnimation = () => {
    setIsPlaying(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= flow.nodes.length) {
        clearInterval(interval);
        setTimeout(() => setIsPlaying(false), 1000);
      } else {
        setActiveStep(step);
      }
    }, 800); // 800ms per node jump
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>Runtime Engine</h2>
          <p style={{ color: '#888', margin: 0 }}>Interactive flow showing how user inputs trigger OS renders.</p>
        </div>
        <button 
          onClick={startAnimation}
          disabled={isPlaying}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isPlaying ? '#333' : 'var(--color-accent)', color: isPlaying ? '#888' : '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: isPlaying ? 'default' : 'pointer', fontWeight: 600 }}
        >
          <PlayRegular /> {isPlaying ? 'Running...' : 'Trigger Win+E'}
        </button>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '48px', padding: '32px 0' }}>
        {flow.nodes.map((node, i) => {
          const isActive = activeStep === i;
          const isPassed = activeStep > i;
          const edge = flow.edges.find(e => e.from === i);
          
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              
              {/* Node Card */}
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  borderColor: isActive || isPassed ? 'var(--color-accent)' : '#333',
                  boxShadow: isActive ? '0 0 20px rgba(0, 191, 255, 0.4)' : 'none'
                }}
                style={{
                  background: '#111',
                  border: '1px solid #333',
                  padding: '24px 48px',
                  borderRadius: '12px',
                  color: isActive || isPassed ? '#fff' : '#888',
                  fontWeight: 600,
                  fontSize: '18px',
                  zIndex: 2
                }}
              >
                {node}
              </motion.div>

              {/* Edge Connecting Line */}
              {edge && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '64px', position: 'relative' }}>
                  <div style={{ width: '2px', height: '100%', background: '#333', position: 'absolute', top: 0, zIndex: 1 }} />
                  {/* Particle */}
                  <motion.div
                    initial={{ top: 0, opacity: 0 }}
                    animate={activeStep === i ? { top: '100%', opacity: [0, 1, 1, 0] } : { top: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'linear' }}
                    style={{ position: 'absolute', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', zIndex: 3 }}
                  />
                  {/* Label */}
                  <motion.span
                    animate={{ opacity: activeStep >= i ? 1 : 0.3, color: activeStep === i ? 'var(--color-accent)' : '#888' }}
                    style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', whiteSpace: 'nowrap' }}
                  >
                    {edge.label}
                  </motion.span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
