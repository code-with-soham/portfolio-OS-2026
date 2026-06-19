import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { useWindowStore } from '../store/useWindowStore';
import { PersonAvailableRegular, CheckmarkCircleFilled } from '@fluentui/react-icons';

export default function RecruiterReadyWidget() {
  const { accentColor } = useThemeStore();
  const openWindow = useWindowStore(state => state.openWindow);

  const checklist = [
    'Resume Ready',
    'Projects Ready',
    'GitHub Ready',
    'AI Ready'
  ];

  return (
    <motion.div 
      className="widget-card recruiter-ready"
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'rgba(20, 20, 20, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '20px',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '340px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: `linear-gradient(135deg, ${accentColor}, #222)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <PersonAvailableRegular style={{ fontSize: '20px', color: '#fff' }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Recruiter Mode</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Profile is optimized</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {checklist.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            <CheckmarkCircleFilled style={{ color: '#4ade80' }} />
            {item}
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => openWindow('recruiter')}
        style={{
          marginTop: '4px',
          width: '100%',
          padding: '12px',
          background: accentColor,
          border: 'none',
          borderRadius: '12px',
          color: '#000',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '13px',
          boxShadow: `0 4px 12px ${accentColor}40`
        }}
      >
        Launch Recruiter Dashboard
      </motion.button>
    </motion.div>
  );
}
