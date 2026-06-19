import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { 
  PlayFilled, 
  PreviousFilled, 
  NextFilled, 
  MusicNote1Regular
} from '@fluentui/react-icons';

export default function MusicWidget() {
  const { accentColor } = useThemeStore();

  return (
    <motion.div 
      className="widget-card music-widget"
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
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '12px',
          background: `linear-gradient(135deg, ${accentColor}, #222)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>
          {/* Fallback icon if no art */}
          <MusicNote1Regular style={{ fontSize: '32px', color: 'rgba(255,255,255,0.8)' }} />
          {/* <img src="album_art_placeholder.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lofi Study Beats</h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Chillhop Music</p>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <PreviousFilled fontSize="20px" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: '#fff', border: 'none', color: '#000', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlayFilled fontSize="20px" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <NextFilled fontSize="20px" />
            </motion.button>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>1:24</span>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden', cursor: 'pointer' }}>
            <motion.div style={{ height: '100%', width: '35%', background: accentColor }} layoutId="music-progress" />
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>3:45</span>
        </div>
      </div>
    </motion.div>
  );
}
