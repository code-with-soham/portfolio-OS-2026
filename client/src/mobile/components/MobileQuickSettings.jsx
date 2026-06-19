import { motion } from 'framer-motion';
import { useMobileStore } from '../store/useMobileStore';

export default function MobileQuickSettings() {
  const { toggleQuickSettings } = useMobileStore();

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.y < -100 || velocity.y < -500) toggleQuickSettings(false);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 20, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: 9900,
        padding: '60px 20px 20px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
      
      <div style={{ fontSize: '24px', fontWeight: 300, marginBottom: '32px' }}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {['Wi-Fi', 'Bluetooth', 'Dark Mode', 'Do Not Disturb', 'Flashlight', 'Location'].map(setting => (
          <div key={setting} style={{ background: 'var(--color-bg-elevated)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '24px', height: '24px', background: 'var(--color-accent)', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{setting}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
