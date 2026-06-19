import { motion } from 'framer-motion';
import { useMobileStore } from '../store/useMobileStore';
import { ChevronLeftRegular, PhoneVibrateRegular, WeatherMoonRegular, DeleteRegular } from '@fluentui/react-icons';

export default function MobileAppSettings() {
  const { closeApp } = useMobileStore();

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--color-bg-base)',
        zIndex: 8000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: 'var(--color-bg-surface)' }}>
        <button onClick={closeApp} style={{ background: 'transparent', border: 'none', color: '#fff' }}>
          <ChevronLeftRegular fontSize={24} />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 600, marginLeft: '8px' }}>Settings</span>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'var(--color-bg-elevated)', borderRadius: '16px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <PhoneVibrateRegular fontSize={24} color="var(--color-accent)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>Haptics & Animation</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>System motion and vibration</div>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <WeatherMoonRegular fontSize={24} color="var(--color-accent)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>Dark Mode</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Force dark theme</div>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
        </div>

        <div style={{ background: 'var(--color-bg-elevated)', borderRadius: '16px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>Offline Storage</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Cache size: 2.4 MB</div>
            </div>
          </div>
          <button style={{ width: '100%', padding: '12px', background: 'var(--color-bg-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#ff4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <DeleteRegular /> Clear Cache
          </button>
        </div>
      </div>
    </motion.div>
  );
}
