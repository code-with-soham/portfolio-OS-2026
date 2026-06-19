import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { useDesktopStore } from '../store/useDesktopStore';
import { BotFilled, MicFilled, SendFilled } from '@fluentui/react-icons';

export default function AIWidget() {
  const { accentColor } = useThemeStore();
  const toggleAIAssistant = useDesktopStore(s => s.toggleAIAssistant);

  return (
    <motion.div 
      className="widget-card ai-widget"
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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 15px ${accentColor}40`
        }}>
          <BotFilled style={{ fontSize: '24px', color: '#fff' }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>VS-31 Assistant</h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Ready to help</p>
        </div>
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <input 
          type="text" 
          placeholder="Ask AI..." 
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            flex: 1,
            outline: 'none',
            fontSize: '14px'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') toggleAIAssistant();
          }}
        />
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={toggleAIAssistant}
          style={{ background: 'transparent', border: 'none', color: accentColor, cursor: 'pointer', display: 'flex' }}
        >
          <MicFilled fontSize="18px" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={toggleAIAssistant}
          style={{ background: accentColor, border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: '6px', borderRadius: '8px' }}
        >
          <SendFilled fontSize="16px" />
        </motion.button>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['Show projects', 'Open Resume', 'Who is Soham?'].map((suggestion, i) => (
          <div 
            key={i}
            onClick={toggleAIAssistant}
            style={{
              fontSize: '11px',
              background: 'rgba(255,255,255,0.1)',
              padding: '6px 10px',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
