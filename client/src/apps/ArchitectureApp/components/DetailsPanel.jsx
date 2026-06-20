import { motion, AnimatePresence } from 'framer-motion';

export default function DetailsPanel({ activeLayer }) {
  if (!activeLayer) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
        Select a layer to view architecture details.
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeLayer.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}
      >
        <div>
          <h2 style={{ fontSize: '32px', margin: '0 0 12px 0', color: activeLayer.color }}>{activeLayer.name}</h2>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--color-bg-elevated)', borderRadius: '16px', fontSize: '13px', border: '1px solid var(--color-border)' }}>
            Complexity: <strong style={{ color: activeLayer.complexity === 'High' ? '#FF4B4B' : activeLayer.complexity === 'Medium' ? '#FFC107' : '#4CAF50' }}>{activeLayer.complexity}</strong>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', letterSpacing: '1px' }}>Overview</h3>
          <p style={{ lineHeight: 1.6, margin: 0, color: 'var(--color-text-primary)', fontSize: '15px' }}>{activeLayer.overview}</p>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', letterSpacing: '1px' }}>Responsibilities</h3>
          <ul style={{ margin: 0, paddingLeft: '24px', lineHeight: 1.6, fontSize: '15px' }}>
            {activeLayer.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', letterSpacing: '1px' }}>Technologies</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {activeLayer.technologies.map((t, i) => (
              <span key={i} style={{ padding: '8px 16px', background: 'var(--color-bg-elevated)', borderRadius: '8px', fontSize: '14px', border: '1px solid var(--color-border)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', letterSpacing: '1px' }}>Key Files</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeLayer.keyFiles.map((f, i) => (
              <code key={i} style={{ padding: '12px', background: 'var(--color-bg-base)', borderRadius: '8px', fontSize: '14px', color: 'var(--color-accent)', border: '1px solid var(--color-border)', fontFamily: 'monospace', fontWeight: 500 }}>{f}</code>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
