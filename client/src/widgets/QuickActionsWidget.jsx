import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { useWindowStore } from '../store/useWindowStore';
import { DocumentRegular, CodeRegular, PersonRegular, GlobeRegular, MailRegular, NavigationRegular } from '@fluentui/react-icons';

export default function QuickActionsWidget() {
  const { accentColor } = useThemeStore();
  const openWindow = useWindowStore(state => state.openWindow);

  const actions = [
    { 
      name: 'Resume', 
      icon: <DocumentRegular />, 
      action: () => openWindow('resume') // Assumes a resume app ID
    },
    { 
      name: 'GitHub', 
      icon: <CodeRegular />, 
      action: () => window.open("https://github.com/code-with-soham", "_blank") 
    },
    { 
      name: 'LinkedIn', 
      icon: <PersonRegular />, 
      action: () => window.open("https://www.linkedin.com/in/soham-kundu-b5a9a0250/", "_blank") 
    },
    { 
      name: 'Portfolio', 
      icon: <GlobeRegular />, 
      action: () => window.open("https://soham-kundu-portfolio.vercel.app/", "_blank") 
    },
    { 
      name: 'Email', 
      icon: <MailRegular />, 
      action: () => { window.location.href = "mailto:soham.kundu@example.com" } 
    }
  ];

  return (
    <motion.div 
      className="widget-card quick-actions"
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
        <div style={{ background: accentColor, padding: '6px', borderRadius: '8px', display: 'flex' }}>
          <NavigationRegular fontSize="20px" color="#fff" />
        </div>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Quick Actions</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        {actions.map((btn, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={btn.action}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 4px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)'
            }}
          >
            <span style={{ fontSize: '20px', color: accentColor }}>{btn.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 500 }}>{btn.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
