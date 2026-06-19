import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { useLearningStore } from '../store/useLearningStore';
import { TargetArrowRegular } from '@fluentui/react-icons';

export default function LearningProgressWidget() {
  const { accentColor } = useThemeStore();
  const progress = useLearningStore(state => state.progress);

  const skills = [
    { id: 'docker', label: 'Docker', val: progress.docker },
    { id: 'dsa', label: 'DSA', val: progress.dsa },
    { id: 'aptitude', label: 'Aptitude', val: progress.aptitude },
    { id: 'verbal', label: 'Verbal', val: progress.verbal },
    { id: 'projects', label: 'Projects', val: progress.projects }
  ];

  return (
    <motion.div 
      className="widget-card learning-progress"
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Placement Journey</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Current Progress</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px' }}>
          <TargetArrowRegular style={{ fontSize: '20px', color: accentColor }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {skills.map((skill, idx) => (
          <div key={skill.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{skill.label}</span>
              <span style={{ fontWeight: 600 }}>{skill.val}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${skill.val}%` }}
                transition={{ duration: 1, delay: idx * 0.1, type: 'spring' }}
                style={{ height: '100%', background: accentColor, borderRadius: '3px' }}
              />
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => console.log('Opening Placement Dashboard')}
        style={{
          marginTop: '4px',
          width: '100%',
          padding: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '13px'
        }}
      >
        Open Placement Dashboard
      </motion.button>
    </motion.div>
  );
}
