import { motion, AnimatePresence } from 'framer-motion';
import { useSystemAudioStore } from '../../../store/useSystemAudioStore';
import { Speaker2Regular, SpeakerOffRegular } from '@fluentui/react-icons';

export default function VolumeOSD() {
  const { volume, isMuted, showOSD } = useSystemAudioStore();

  return (
    <AnimatePresence>
      {showOSD && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: '80px', // Above taskbar
            right: '24px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-flyout)',
            zIndex: 9999, // On top of everything
            color: 'var(--color-text-primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isMuted ? <SpeakerOffRegular fontSize={24} /> : <Speaker2Regular fontSize={24} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Volume</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '120px', height: '4px', background: 'var(--color-bg-surface-hover)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${volume * 100}%`, height: '100%', background: 'var(--color-accent)' }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums', width: '32px' }}>
                {isMuted ? 0 : Math.round(volume * 100)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
