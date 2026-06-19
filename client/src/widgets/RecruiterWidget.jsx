import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { useWindowStore } from '../store/useWindowStore';
import { useDesktopStore } from '../store/useDesktopStore';
import { DocumentPersonRegular, CodeRegular, ShareRegular, MailRegular, BriefcaseFilled } from '@fluentui/react-icons';

export default function RecruiterWidget() {
  const { accentColor } = useThemeStore();
  const openWindow = useWindowStore(s => s.openWindow);
  const openBrowser = (url) => {
    useDesktopStore.getState().openLink(url);
  };

  const links = [
    { label: 'Resume', icon: <DocumentPersonRegular />, action: () => openWindow('resume') },
    { label: 'GitHub', icon: <CodeRegular />, action: () => openBrowser('https://github.com/soham-portfolio') },
    { label: 'LinkedIn', icon: <ShareRegular />, action: () => openBrowser('https://linkedin.com/in/soham') },
    { label: 'Email', icon: <MailRegular />, action: () => openWindow('mail') }
  ];

  return (
    <motion.div 
      className="widget-card recruiter-widget"
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.7) 0%, rgba(10, 10, 10, 0.8) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${accentColor}50`,
        borderRadius: '20px',
        padding: '20px',
        color: '#fff',
        boxShadow: `0 8px 32px ${accentColor}20`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '340px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: '100px', height: '100px', background: accentColor, opacity: 0.2, filter: 'blur(30px)', borderRadius: '50%' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: accentColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <BriefcaseFilled style={{ fontSize: '24px', color: '#fff' }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Quick Links</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>For Recruiters & Guests</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', position: 'relative', zIndex: 1 }}>
        {links.map((link, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={link.action}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <div style={{ fontSize: '24px', color: accentColor }}>
              {link.icon}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>{link.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
