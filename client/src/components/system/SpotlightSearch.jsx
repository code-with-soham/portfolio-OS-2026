import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { DESKTOP_APPS } from '../../constants';
import { SearchRegular } from '@fluentui/react-icons';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useStickyNotesStore } from '../../store/useStickyNotesStore';

export default function SpotlightSearch() {
  const isSpotlightOpen = useDesktopStore(s => s.isSpotlightOpen);
  const closeSpotlight = useDesktopStore(s => s.closeSpotlight);
  const toggleSpotlight = useDesktopStore(s => s.toggleSpotlight);
  const openWindow = useWindowStore(s => s.openWindow);
  
  const calendarEvents = useCalendarStore(s => s.events);
  const notes = useStickyNotesStore(s => s.notes);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Win + S or Meta + S
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleSpotlight();
      }
      if (e.key === 'Escape' && isSpotlightOpen) {
        closeSpotlight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpotlightOpen, toggleSpotlight, closeSpotlight]);

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isSpotlightOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const newResults = [];

    // Search Apps
    DESKTOP_APPS.forEach(app => {
      if (app.label.toLowerCase().includes(q) || app.description.toLowerCase().includes(q)) {
        newResults.push({
          id: `app-${app.id}`,
          type: 'App',
          title: app.label,
          subtitle: app.description,
          icon: typeof app.icon === 'string' ? app.icon : null,
          action: () => {
            openWindow(app.id);
            closeSpotlight();
          }
        });
      }
    });

    // Search Notes
    notes.forEach(note => {
      if (note.text.toLowerCase().includes(q)) {
        newResults.push({
          id: `note-${note.id}`,
          type: 'Sticky Note',
          title: note.text.substring(0, 30) + '...',
          subtitle: 'Note on desktop',
          action: () => {
            // Can't "open" a note yet, just close spotlight
            closeSpotlight();
          }
        });
      }
    });

    // Search Calendar
    calendarEvents.forEach(ev => {
      if (ev.title.toLowerCase().includes(q) || ev.type.toLowerCase().includes(q)) {
        newResults.push({
          id: `event-${ev.id}`,
          type: 'Calendar Event',
          title: ev.title,
          subtitle: `${ev.time} • ${ev.date}`,
          action: () => {
            openWindow('calendar');
            closeSpotlight();
          }
        });
      }
    });

    setResults(newResults);
    setSelectedIndex(0);
  }, [query, calendarEvents, notes, openWindow, closeSpotlight]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
      }
    }
  };

  return (
    <AnimatePresence>
      {isSpotlightOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSpotlight}
            style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              width: 'min(700px, 90vw)',
              maxHeight: '60vh',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              zIndex: 9001,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <SearchRegular fontSize={24} color="var(--color-text-secondary)" style={{ marginRight: '16px' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search apps, notes, events..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '1.25rem',
                }}
              />
            </div>

            {/* Results */}
            {query.trim() && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                {results.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    No results found for "{query}"
                  </div>
                ) : (
                  results.map((res, i) => (
                    <div
                      key={res.id}
                      onClick={() => res.action()}
                      onMouseEnter={() => setSelectedIndex(i)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        background: i === selectedIndex ? 'var(--color-accent)' : 'transparent',
                        color: i === selectedIndex ? '#fff' : 'var(--color-text-primary)',
                        transition: 'background 0.1s'
                      }}
                    >
                      {res.icon && <img src={res.icon} alt="" width="24" height="24" style={{ marginRight: '16px' }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1rem', fontWeight: '500' }}>{res.title}</div>
                        <div style={{ fontSize: '0.8rem', color: i === selectedIndex ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)', marginTop: '4px' }}>
                          {res.type} • {res.subtitle}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
