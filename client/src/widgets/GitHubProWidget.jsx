import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { useDesktopStore } from '../store/useDesktopStore';
import { SparkleFilled } from '@fluentui/react-icons';

export default function GitHubProWidget() {
  const { theme, accentColor } = useThemeStore();
  
  return (
    <motion.div 
      className="widget-card github-pro"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1f1f1f, #333)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${accentColor}`
          }}>
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style={{ width: '28px', filter: 'invert(1)' }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Soham Kundu</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>@soham-portfolio</p>
          </div>
        </div>
        <div style={{ background: accentColor, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
          PRO
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: accentColor }}>42</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Repos</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: accentColor }}>500+</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Contribs</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: accentColor }}>15</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Streak</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>Top Languages</div>
        <div style={{ display: 'flex', width: '100%', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: '55%' }} style={{ background: '#f7df1e' }} title="JavaScript 55%" />
          <motion.div initial={{ width: 0 }} animate={{ width: '20%' }} style={{ background: '#61dafb' }} title="React 20%" />
          <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} style={{ background: '#00599C' }} title="C++ 15%" />
          <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} style={{ background: '#3776AB' }} title="Python 10%" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>
          <span><span style={{ color: '#f7df1e' }}>●</span> JS 55%</span>
          <span><span style={{ color: '#61dafb' }}>●</span> React 20%</span>
          <span><span style={{ color: '#00599C' }}>●</span> C++ 15%</span>
          <span><span style={{ color: '#3776AB' }}>●</span> Py 10%</span>
        </div>
      </div>
      
      <div style={{ marginTop: '4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>Recent Activity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px' }}>
          <SparkleFilled style={{ color: accentColor }} />
          <span>Committed to <b>portfolio-os</b></span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', opacity: 0.5 }}>2h ago</span>
        </div>
      </div>
    </motion.div>
  );
}
