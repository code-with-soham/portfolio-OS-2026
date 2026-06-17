import { motion } from 'framer-motion';

export default function PlacementWidget() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>🎯</span>
        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Placement Stats</h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
        <div style={{ background: 'var(--color-bg-surface-hover)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0078d4' }}>450+</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>DSA Solved</div>
        </div>
        <div style={{ background: 'var(--color-bg-surface-hover)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#107c10' }}>12</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Projects</div>
        </div>
        <div style={{ background: 'var(--color-bg-surface-hover)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#d83b01' }}>5</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Certificates</div>
        </div>
        <div style={{ background: 'var(--color-bg-surface-hover)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#5c2d91' }}>8</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Mock Interviews</div>
        </div>
      </div>
    </motion.div>
  );
}
