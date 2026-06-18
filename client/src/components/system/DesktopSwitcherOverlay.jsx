import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';

export default function DesktopSwitcherOverlay() {
  const isOpen = useDesktopStore(s => s.isDesktopSwitcherOpen);
  const close = useDesktopStore(s => s.closeDesktopSwitcher);
  const { currentDesktop, totalDesktops, setDesktop } = useWindowStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{ position: 'fixed', inset: 0, zIndex: 9500, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '80px', // above taskbar
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-panel)',
              padding: '24px',
              display: 'flex',
              gap: '24px',
              zIndex: 9501,
            }}
          >
            {Array.from({ length: totalDesktops }).map((_, i) => {
              const desktopId = i + 1;
              const isSelected = desktopId === currentDesktop;
              return (
                <div
                  key={desktopId}
                  onClick={() => {
                    setDesktop(desktopId);
                    close();
                  }}
                  style={{
                    width: '200px',
                    height: '120px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                    background: isSelected ? 'var(--color-bg-surface-hover)' : 'var(--color-bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--color-bg-surface-hover)';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--color-bg-surface)';
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.8 }}>
                    🖥️
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Desktop {desktopId}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
