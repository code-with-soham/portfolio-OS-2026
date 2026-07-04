import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckmarkCircleRegular } from '@fluentui/react-icons';
import healthData from '../../../ai/knowledge/architecture/architecture-health.json';

export default function ArchitectureHealth() {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRevealed(prev => {
        if (prev >= healthData.checks.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  const scoreColor = healthData.score >= 90 ? '#4CAF50' : healthData.score >= 70 ? '#ff9800' : '#f44336';

  return (
    <div style={{ padding: '48px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>Architecture Health</h2>
        <p style={{ color: '#888', margin: 0 }}>Automated quality assessment of Portfolio OS architecture.</p>
      </div>

      {/* Score Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          padding: '48px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px',
          border: '1px solid #222'
        }}
      >
        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
          {/* Background circle */}
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="#1a1a1a" strokeWidth="8" />
            <motion.circle
              cx="80" cy="80" r="70" fill="none"
              stroke={scoreColor} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - healthData.score / 100) }}
              transition={{ duration: 2, ease: 'easeOut' }}
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: '48px', fontWeight: 800, color: scoreColor, fontFamily: 'JetBrains Mono, monospace' }}
            >
              {healthData.score}
            </motion.span>
            <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>Score</span>
          </div>
        </div>

        <div style={{ fontSize: '14px', color: '#888' }}>
          {healthData.passed}/{healthData.total} checks passed
        </div>
      </motion.div>

      {/* Checks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
        {healthData.checks.map((check, i) => {
          const isRevealed = i < revealed;
          return (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, x: -20 }}
              animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 20px', borderRadius: '10px',
                background: isRevealed && check.passed ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isRevealed && check.passed ? 'rgba(76, 175, 80, 0.2)' : '#222'}`
              }}
            >
              {/* Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isRevealed ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                {check.passed ? (
                  <CheckmarkCircleRegular style={{ color: '#4CAF50', fontSize: '22px' }} />
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #f44336', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#f44336', fontSize: '12px', fontWeight: 700 }}>✕</span>
                  </div>
                )}
              </motion.div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: isRevealed ? '#fff' : '#666' }}>{check.label}</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{check.detail}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
