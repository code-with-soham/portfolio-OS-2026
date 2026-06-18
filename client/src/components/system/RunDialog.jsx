import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { APPS } from '../../config/apps';
import runIcon from '../../assets/icons/system/Settings.ico';

export default function RunDialog() {
  const isOpen = useDesktopStore(s => s.isRunDialogOpen);
  const close = useDesktopStore(s => s.closeRunDialog);
  const openWindow = useWindowStore(s => s.openWindow);
  
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.trim().toLowerCase();
    
    // Check if q matches an app ID exactly, or if it's "cmd"
    if (APPS[q]) {
      openWindow(q);
    } else if (q === 'cmd') {
      openWindow('terminal');
    } else if (q === 'explorer') {
      openWindow('fileexplorer');
    } else {
      // If no match, maybe try to search desktop apps by title
      const found = Object.values(APPS).find(a => a.title.toLowerCase().includes(q) || a.id.includes(q));
      if (found) {
        openWindow(found.id);
      } else {
        // Mock error
        alert(`Windows cannot find '${query}'. Make sure you typed the name correctly, and then try again.`);
      }
    }
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{ position: 'fixed', inset: 0, zIndex: 9500 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--taskbar-height) + 12px)',
              left: '12px',
              width: '400px',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-panel)',
              zIndex: 9501,
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--font-family)',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)'
            }}
          >
            {/* Title Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-bg-surface-hover)' }}>
              <span>Run</span>
              <button onClick={close} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 20px', display: 'flex', gap: '16px' }}>
              <img src={runIcon} alt="Run" width="32" height="32" />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
                </p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label htmlFor="run-input" style={{ fontWeight: 500 }}>Open:</label>
                  <input
                    id="run-input"
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      background: 'var(--color-bg-surface-content)',
                      color: 'var(--color-text-primary)',
                      outline: 'none'
                    }}
                  />
                </form>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', gap: '8px', background: 'var(--color-bg-surface-hover)', borderTop: '1px solid var(--color-border)' }}>
              <button onClick={handleSubmit} style={{ padding: '4px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', cursor: 'pointer' }}>OK</button>
              <button onClick={close} style={{ padding: '4px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => alert('No browse available in web OS')} style={{ padding: '4px 16px', borderRadius: '4px', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', cursor: 'pointer' }}>Browse...</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
