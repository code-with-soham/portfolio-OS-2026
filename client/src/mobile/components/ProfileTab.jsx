import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MailRegular, 
  LinkRegular, 
  GlobeRegular, 
  ArrowDownloadRegular,
  BookRegular,
  PersonRegular,
  TimelineRegular
} from '@fluentui/react-icons';
import { useGitHubStore } from '../../store/useGitHubStore';

const SKILL_GROUPS = [
  { label: 'Frontend', skills: ['React', 'TypeScript', 'Tailwind'] },
  { label: 'Backend', skills: ['Node.js', 'Express', 'MongoDB'] },
  { label: 'Core', skills: ['Python', 'JavaScript', 'C++'] }
];

const TIMELINE = [
  { year: '2024', event: 'Started B.Tech CSE', detail: 'Brainware University' },
  { year: '2025', event: 'Frontend Internship', detail: 'Expantra Tech Pvt Ltd' },
  { year: '2026', event: 'Built Portfolio OS', detail: 'Interactive Web Experience' }
];

export default function ProfileTab() {
  const { data: githubData, isLoading, fetchData } = useGitHubStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px', paddingBottom: '100px', overflowY: 'auto', height: '100%', background: 'var(--color-bg-desktop)' }}>
      
      {/* Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'var(--color-bg-surface)', 
          borderRadius: '24px', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ 
          width: '96px', 
          height: '96px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--color-accent), #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#fff',
          boxShadow: '0 0 20px rgba(74, 222, 128, 0.4)'
        }}>
          SK
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#fff' }}>Soham Kundu</h2>
          <p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--color-accent)' }}>Full Stack Developer</p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>Kolkata, India • Building the future</p>
        </div>
      </motion.div>

      {/* GitHub Live Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ background: 'var(--color-bg-surface)', borderRadius: '16px', padding: '16px', border: '1px solid var(--color-border)' }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff' }}>Live Metrics</h3>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '10px' }}>Loading stats...</div>
        ) : githubData ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-bg-base)', padding: '12px', borderRadius: '12px' }}>
              <BookRegular fontSize={24} color="var(--color-accent)" style={{ marginBottom: '8px' }} />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{githubData.publicRepos}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Repos</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-bg-base)', padding: '12px', borderRadius: '12px' }}>
              <PersonRegular fontSize={24} color="var(--color-accent)" style={{ marginBottom: '8px' }} />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{githubData.followers}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Followers</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-bg-base)', padding: '12px', borderRadius: '12px' }}>
              <PersonRegular fontSize={24} color="var(--color-text-secondary)" style={{ marginBottom: '8px' }} />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>8+</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Projects</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>Stats unavailable</div>
        )}
      </motion.div>

      {/* Quick Links */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}
      >
        <a href="https://github.com/code-with-soham" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '24px' }}>💻</span>
            <span style={{ fontSize: '11px' }}>GitHub</span>
          </div>
        </a>
        <a href="https://linkedin.com/in/sohamkundu" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)' }}>
            <LinkRegular fontSize={24} color="#0077b5" />
            <span style={{ fontSize: '11px' }}>LinkedIn</span>
          </div>
        </a>
        <a href="https://soham-kundu-portfolio.vercel.app/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)' }}>
            <GlobeRegular fontSize={24} color="var(--color-accent)" />
            <span style={{ fontSize: '11px' }}>Website</span>
          </div>
        </a>
        <a href="mailto:sohamkundu@example.com" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)' }}>
            <MailRegular fontSize={24} color="var(--color-text-primary)" />
            <span style={{ fontSize: '11px' }}>Email</span>
          </div>
        </a>
      </motion.div>

      {/* Tech Stack Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ background: 'var(--color-bg-surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--color-border)' }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff' }}>Tech Stack</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SKILL_GROUPS.map(group => (
            <div key={group.label}>
              <span style={{ fontSize: '12px', color: 'var(--color-accent)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>{group.label}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.skills.map(skill => (
                  <span key={skill} style={{ background: 'var(--color-bg-base)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ background: 'var(--color-bg-surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--color-border)' }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TimelineRegular /> Journey
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '5px', top: '8px', bottom: '8px', width: '2px', background: 'var(--color-border)' }} />
          {TIMELINE.map((item, i) => (
            <div key={i} style={{ paddingLeft: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0', top: '6px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-accent)', border: '3px solid var(--color-bg-surface)' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 'bold' }}>{item.year}</span>
              <h4 style={{ margin: '2px 0', fontSize: '14px' }}>{item.event}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Download Resume */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const a = document.createElement('a');
          a.href = '/AI Resume.pdf';
          a.download = 'Soham_Kundu_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}
        style={{
          padding: '16px',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          color: '#fff',
          fontSize: '15px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        <ArrowDownloadRegular fontSize={20} />
        Download Resume
      </motion.button>

    </div>
  );
}
