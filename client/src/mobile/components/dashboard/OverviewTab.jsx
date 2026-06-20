import { motion } from 'framer-motion';
import { DataPieRegular, CheckmarkCircleRegular } from '@fluentui/react-icons';

export default function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hero Section */}
      <div style={{ background: 'var(--color-bg-elevated)', borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-accent)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: '#000' }}>
          SK
        </div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Soham Kundu</h2>
        <p style={{ margin: '0 0 8px 0', color: 'var(--color-text-secondary)', fontSize: '15px' }}>Full Stack & AI Developer</p>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '13px' }}>Brainware University • YOP 2027</p>
      </div>

      {/* Why Hire Me Card */}
      <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-accent)', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(74, 222, 128, 0.1)' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--color-accent)' }}>Why Hire Me</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            'Full Stack Development (MERN)',
            'AI Integration & Agentic Logic',
            'Portfolio OS Creator',
            'Hackathon Finalist (2025)',
            '500+ GitHub Contributions'
          ].map((point, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <CheckmarkCircleRegular color="var(--color-accent)" fontSize={20} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{point}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recruiter Score Engine */}
      <div style={{ background: 'var(--color-bg-surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <DataPieRegular fontSize={24} color="var(--color-accent)" />
          <h3 style={{ margin: 0, fontSize: '18px' }}>Portfolio Strength</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Projects', score: 95 },
            { label: 'Skills', score: 88 },
            { label: 'GitHub', score: 85 },
            { label: 'Communication', score: 80 }
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <span>{stat.label}</span>
                <span style={{ fontWeight: 600 }}>{stat.score}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--color-bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.score}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  style={{ height: '100%', background: 'var(--color-accent)', borderRadius: '3px' }}
                />
              </div>
            </div>
          ))}
          
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Overall Score</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-accent)' }}>89%</span>
          </div>
        </div>
      </div>

    </div>
  );
}
