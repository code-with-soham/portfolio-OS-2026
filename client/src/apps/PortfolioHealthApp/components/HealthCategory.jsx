import { motion } from 'framer-motion';

export default function HealthCategory({ title, icon, items, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: 'var(--color-bg-elevated)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid var(--color-border)',
        flex: '1 1 300px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '10px', background: 'rgba(80, 227, 194, 0.1)', color: 'var(--color-accent)', borderRadius: '8px' }}>
          {icon}
        </div>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{title}</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>{item.label}</span>
            <span style={{ 
              fontWeight: 600, 
              color: item.status === 'good' ? '#4CAF50' : item.status === 'warning' ? '#FFC107' : 'var(--color-text-primary)'
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
