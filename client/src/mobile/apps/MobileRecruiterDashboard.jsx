import { motion } from 'framer-motion';
import { useMobileStore } from '../store/useMobileStore';
import { 
  ChevronLeftRegular, 
  DataPieRegular, 
  BotRegular, 
  BriefcaseRegular,
  DocumentRegular
} from '@fluentui/react-icons';

export default function MobileRecruiterDashboard() {
  const { closeApp } = useMobileStore();

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.2 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--color-bg-base)',
        zIndex: 8000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* App Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <button onClick={closeApp} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}>
          <ChevronLeftRegular fontSize={24} />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 600, marginLeft: '8px' }}>Recruiter Dashboard</span>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Profile Card */}
        <div style={{ background: 'var(--color-bg-elevated)', borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-accent)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>SK</div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>Soham Kundu</h2>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>Full Stack & AI Developer</p>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button style={{ padding: '8px 24px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: 600 }}>Hire Me</button>
            <button style={{ padding: '8px 24px', background: 'var(--color-bg-surface-hover)', color: '#fff', border: '1px solid var(--color-border)', borderRadius: '24px', fontWeight: 600 }}>Resume</button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <BriefcaseRegular fontSize={24} color="var(--color-accent)" />
            <span style={{ fontSize: '24px', fontWeight: 700 }}>12+</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Projects</span>
          </div>
          <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <DataPieRegular fontSize={24} color="var(--color-accent)" />
            <span style={{ fontSize: '24px', fontWeight: 700 }}>35+</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Skills</span>
          </div>
        </div>

        {/* AI Assistant Hook */}
        <div style={{ background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), transparent)', border: '1px solid var(--color-accent)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BotRegular fontSize={24} color="#000" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Ask AI about Soham</h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>Use the AI Assistant to ask questions about my experience, skills, and projects.</p>
            <button style={{ padding: '6px 16px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-accent)', color: 'var(--color-text-primary)', borderRadius: '16px', fontSize: '12px', cursor: 'pointer' }}>What is his best project?</button>
          </div>
        </div>

        {/* Mobile Projects Feed */}
        <h3 style={{ margin: '12px 0 0 0', fontSize: '18px' }}>Featured Projects</h3>
        {['Portfolio OS 2026', 'CampusHub', 'Placement Predictor'].map(proj => (
          <div key={proj} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{proj}</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>React</span>
              <span style={{ fontSize: '10px', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>Node.js</span>
            </div>
            <button style={{ width: '100%', padding: '8px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }}>View Details</button>
          </div>
        ))}
        
        <div style={{ height: '40px' }} /> {/* Padding for bottom nav */}
      </div>
    </motion.div>
  );
}
