import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useMusicStore } from '../../store/useMusicStore';
import { useMobileStore } from '../../mobile/store/useMobileStore';
import { WindowConsoleRegular, PlayRegular, DarkThemeRegular, LockClosedRegular, DocumentRegular, AppFolderRegular, GlobeRegular, PersonRegular } from '@fluentui/react-icons';

export default function CommandPalette() {
  const { isCommandPaletteOpen, closeCommandPalette, setOsState } = useDesktopStore();
  const { openWindow } = useWindowStore();
  const { toggleTheme } = useThemeStore();
  const { togglePlayPause } = useMusicStore();
  const mobileStore = useMobileStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  
  const allCommands = [
    { id: 'resume', label: 'Open Resume', icon: <DocumentRegular />, action: () => openWindow('resume') },
    { id: 'theme', label: 'Toggle Theme (Dark/Light)', icon: <DarkThemeRegular />, action: () => toggleTheme() },
    { id: 'lock', label: 'Lock Screen', icon: <LockClosedRegular />, action: async () => {
      const { OS_STATES } = await import('../../constants');
      setOsState(OS_STATES.LOCKED);
    }},
    { id: 'music', label: 'Play/Pause Music', icon: <PlayRegular />, action: () => togglePlayPause() },
    { id: 'browser', label: 'Open Browser', icon: <GlobeRegular />, action: () => openWindow('browser') },
    { id: 'projects', label: 'Open Projects', icon: <AppFolderRegular />, action: () => openWindow('projects') },
    { id: 'recruiter', label: 'Run Recruiter Mode', icon: <PersonRegular />, action: () => {
      // Logic: if on mobile, open mobile recruiter dashboard. If on desktop, open Recruiter App.
      if (window.innerWidth < 768) {
        mobileStore.openApp('recruiter');
      } else {
        openWindow('recruiter');
      }
    }},
    { id: 'terminal', label: 'Open Terminal', icon: <WindowConsoleRegular />, action: () => openWindow('terminal') },
  ];

  const filteredCommands = allCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeCommandPalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      closeCommandPalette();
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCommandPalette}
            style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              width: 'min(600px, 90vw)',
              maxHeight: '60vh',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              fontFamily: 'monospace'
            }}
          >
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}>
              <span style={{ color: 'var(--color-text-secondary)', marginRight: '12px', fontSize: '18px' }}>&gt;</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '18px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, i) => (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      closeCommandPalette();
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      background: i === selectedIndex ? 'var(--color-accent)' : 'transparent',
                      color: i === selectedIndex ? '#fff' : 'var(--color-text-primary)',
                    }}
                  >
                    {cmd.icon}
                    <span style={{ fontSize: '14px' }}>{cmd.label}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  No matching commands.
                </div>
              )}
            </div>
            
            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-tertiary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Ctrl + Shift + P</span>
              <span>↑↓ to navigate, Enter to select</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
