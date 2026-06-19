import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { TrophyFilled, TargetArrowRegular } from '@fluentui/react-icons';

export default function PlacementTrackerWidget() {
  const { accentColor } = useThemeStore();

  const progressData = [
    { label: 'DSA', value: 72 },
    { label: 'Aptitude', value: 65 },
    { label: 'Verbal', value: 80 },
    { label: 'Projects', value: 90 }
  ];

  const goals = [
    'Solve 5 Questions',
    'Revise DBMS',
    'Complete Docker'
  ];

  return (
    <motion.div 
      className="widget-card placement-tracker"
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
          <TrophyFilled style={{ fontSize: '20px', color: '#fff' }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Placement Journey</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>TCS Target</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {progressData.map((item, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span>{item.label}</span>
              <span style={{ color: accentColor, fontWeight: 'bold' }}>{item.value}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                style={{ height: '100%', background: accentColor, borderRadius: '3px' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>Next Goals</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {goals.map((goal, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '8px' }}>
              <TargetArrowRegular style={{ color: accentColor, fontSize: '16px' }} />
              <span>{goal}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
