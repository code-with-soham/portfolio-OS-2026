import { motion } from 'framer-motion';
import { useMobileStore } from '../store/useMobileStore';
import { APPS } from '../../config/apps';

export default function MobileAppDrawer() {
  const { toggleAppDrawer, openApp } = useMobileStore();

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.y > 100 || velocity.y > 500) toggleAppDrawer(false);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-bg-desktop)',
        zIndex: 9900,
        padding: '60px 20px 20px',
        overflowY: 'auto'
      }}
    >
      <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
      
      <input 
        type="text" 
        placeholder="Search apps..." 
        style={{ width: '100%', padding: '12px 16px', borderRadius: '24px', border: 'none', background: 'var(--color-bg-surface)', color: '#fff', marginBottom: '24px', outline: 'none' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px 12px' }}>
        {Object.values(APPS).map((app) => (
          <div key={app.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => openApp(app.id)}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {typeof app.icon === 'string' && app.icon.includes('.') ? (
                <img src={app.icon} alt={app.title} width="28" height="28" />
              ) : (
                <span style={{ fontSize: '24px' }}>{app.icon}</span>
              )}
            </div>
            <span style={{ fontSize: '11px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
              {app.title}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
