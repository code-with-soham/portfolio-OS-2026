import { motion } from 'framer-motion';

export default function LayerNode({ layer, isActive, onClick, index }) {
  return (
    <motion.div
      onClick={() => onClick(layer)}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 10 }}
      style={{
        width: '100%',
        padding: '16px 24px',
        background: isActive ? `${layer.color}15` : 'var(--color-bg-elevated)',
        borderLeft: `4px solid ${layer.color}`,
        borderTop: '1px solid var(--color-border)',
        borderRight: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        borderRadius: '0 8px 8px 0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isActive && (
        <motion.div 
          layoutId="activeLayerGlow"
          style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${layer.color}20 0%, transparent 100%)`, zIndex: 0 }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '11px', color: layer.color, fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>Layer {index + 1}</span>
        <span style={{ fontSize: '16px', fontWeight: 600, color: isActive ? layer.color : 'var(--color-text-primary)', textShadow: isActive ? `0 0 10px ${layer.color}40` : 'none' }}>{layer.name}</span>
      </div>
    </motion.div>
  );
}
