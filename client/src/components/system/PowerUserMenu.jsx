import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';

export default function PowerUserMenu() {
  const isOpen = useDesktopStore(s => s.isPowerUserMenuOpen);
  const close = useDesktopStore(s => s.closePowerUserMenu);
  const openWindow = useWindowStore(s => s.openWindow);
  const toggleDesktopSwitcher = useDesktopStore(s => s.toggleDesktopSwitcher);

  const menuItems = [
    { label: 'Apps and Features', action: () => openWindow('settings') },
    { label: 'Power Options', action: () => openWindow('settings') },
    { label: 'Event Viewer', action: () => openWindow('controlpanel') },
    { label: 'System', action: () => openWindow('settings') },
    { label: 'Device Manager', action: () => openWindow('controlpanel') },
    { label: 'Network Connections', action: () => openWindow('settings') },
    { label: 'Disk Management', action: () => openWindow('fileexplorer') },
    { label: 'Computer Management', action: () => openWindow('controlpanel') },
    { label: 'Terminal', action: () => openWindow('terminal') },
    { label: 'Task Manager', action: () => openWindow('controlpanel') },
    { label: 'Settings', action: () => openWindow('settings') },
    { label: 'File Explorer', action: () => openWindow('fileexplorer') },
    { label: 'Search', action: () => { useDesktopStore.getState().toggleSpotlight(); } },
    { label: 'Run', action: () => { useDesktopStore.getState().toggleRunDialog(); } },
    { label: 'Shut down or sign out', action: () => window.location.reload() },
    { label: 'Desktop', action: () => { 
        // Minimize all windows
        const { windows } = useWindowStore.getState();
        windows.forEach(w => {
          if (!w.isMinimized) useWindowStore.getState().minimizeWindow(w.id);
        });
      } 
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            onClick={close}
            style={{ position: 'fixed', inset: 0, zIndex: 9500 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--taskbar-height) + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              marginLeft: '-100px', // roughly near the start button
              width: '260px',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-panel)',
              zIndex: 9501,
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 0',
              fontFamily: 'var(--font-family)',
              fontSize: '0.875rem'
            }}
          >
            {menuItems.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => {
                    item.action();
                    close();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {item.label}
                </button>
                {/* Separators */}
                {(i === 1 || i === 7 || i === 8 || i === 11 || i === 13 || i === 14) && (
                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 16px' }} />
                )}
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
