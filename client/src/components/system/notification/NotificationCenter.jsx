import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../../store/useDesktopStore';
import { useNotificationStore } from '../../../store/useNotificationStore';
import { useMusicStore } from '../../../store/useMusicStore';
import NotificationCard from './NotificationCard';
import CalendarPanel from '../calendar/CalendarPanel';
import { AlertRegular, CheckmarkRegular, DeleteRegular, PlayRegular, PauseRegular, PreviousRegular, NextRegular } from '@fluentui/react-icons';

export default function NotificationCenter() {
  const { isNotificationCenterOpen, closeNotificationCenter } = useDesktopStore();
  const { history, clearHistory, removeHistoryItem, markAllAsRead, markAsRead } = useNotificationStore();
  const { playlist, currentSongIndex, isPlaying, togglePlayPause, nextSong, prevSong } = useMusicStore();
  
  const currentSong = playlist && playlist.length > 0 ? playlist[currentSongIndex] : null;

  const handleAction = (notif) => {
    markAsRead(notif.id);
  };

  return (
    <AnimatePresence>
      {isNotificationCenterOpen && (
        <>
          {/* Invisible backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNotificationCenter}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
            }}
          />

          {/* Panel */}
          <motion.div
            id="notification-center"
            className="no-select glass-heavy"
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.99 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--taskbar-height) + 12px)',
              right: '12px',
              width: 'min(380px, calc(100vw - 24px))',
              height: 'calc(100vh - var(--taskbar-height) - 24px)', // Full height panel
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-panel)',
              overflow: 'hidden',
              zIndex: 950,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 20px 12px',
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-family)',
                }}
              >
                Notifications
              </span>
              
              {history.length > 0 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.background = 'var(--color-bg-surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <CheckmarkRegular fontSize={16} />
                  </button>
                  <button
                    onClick={clearHistory}
                    title="Clear all"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.background = 'var(--color-bg-surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <DeleteRegular fontSize={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Now Playing Widget */}
            {currentSong && (
              <div style={{
                margin: '0 20px 16px',
                padding: '12px',
                background: 'var(--color-bg-surface)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <img src={currentSong.cover} alt="Cover" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} draggable={false} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.artist}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={prevSong} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '4px' }}>
                    <PreviousRegular fontSize={16} />
                  </button>
                  <button onClick={togglePlayPause} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '4px' }}>
                    {isPlaying ? <PauseRegular fontSize={20} /> : <PlayRegular fontSize={20} />}
                  </button>
                  <button onClick={nextSong} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '4px' }}>
                    <NextRegular fontSize={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Notifications area */}
            <div style={{ padding: '0 20px', flex: 1, overflowY: 'auto' }}>
              {history.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '16px' }}>
                  {history.map((notif) => (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      onDismiss={removeHistoryItem}
                      onAction={handleAction}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'var(--color-text-tertiary)',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <AlertRegular fontSize={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>No new notifications</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '0 20px',
              }}
            />

            {/* Calendar Panel */}
            <div style={{ padding: '16px 20px 20px' }}>
              <CalendarPanel />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
