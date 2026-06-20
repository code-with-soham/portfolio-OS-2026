import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { SearchRegular, AppFolderRegular, DismissRegular } from '@fluentui/react-icons';
import { aiBrain } from '../../ai/brain/aiBrain';
import { APPS } from '../../config/apps';

export default function GlobalSearch() {
  const { isGlobalSearchOpen, closeGlobalSearch } = useDesktopStore();
  const { openWindow } = useWindowStore();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isGlobalSearchOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      // Use aiBrain or direct logic to find matching apps/skills/projects
      const normalizedQuery = query.toLowerCase();
      
      // 1. Search Apps
      const appResults = Object.values(APPS)
        .filter(app => app.title.toLowerCase().includes(normalizedQuery) || app.id.includes(normalizedQuery))
        .map(app => ({ type: 'app', id: app.id, title: app.title, desc: app.description || 'Application', icon: <AppFolderRegular /> }));

      // 2. We can simulate AI Brain semantic search for skills/projects
      // For now, doing a basic text match on knowledge graph files is complex here,
      // so we will query the brain
      const brainResult = aiBrain.processInput(`Search for ${query}`);
      const aiResults = [];
      
      if (brainResult.contextUsed) {
        // Just extract some matched contexts if possible, or provide a generic action
        aiResults.push({ type: 'ai', id: 'ai-answer', title: 'Ask AI Brain', desc: `Get an intelligent answer about "${query}"`, icon: <SearchRegular /> });
      }

      setResults([...appResults, ...aiResults]);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleAction = (result) => {
    closeGlobalSearch();
    if (result.type === 'app') {
      openWindow(result.id);
    } else if (result.type === 'ai') {
      useDesktopStore.getState().toggleAIAssistant();
      // In a real implementation, we would pre-fill the AI assistant with the query
    }
  };

  return (
    <AnimatePresence>
      {isGlobalSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGlobalSearch}
            style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
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
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <SearchRegular fontSize={24} color="var(--color-text-secondary)" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') closeGlobalSearch();
                  if (e.key === 'Enter' && results.length > 0) handleAction(results[0]);
                }}
                placeholder="Search apps, files, projects, and skills (Win + S)..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '20px',
                  marginLeft: '16px'
                }}
              />
              <button onClick={closeGlobalSearch} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                <DismissRegular fontSize={20} />
              </button>
            </div>

            {/* Results Area */}
            {query.trim().length > 1 && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                {results.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {results.map((res, i) => (
                      <div
                        key={res.id + i}
                        onClick={() => handleAction(res)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: i === 0 ? 'var(--color-bg-surface-hover)' : 'transparent',
                          border: i === 0 ? '1px solid var(--color-border)' : '1px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-bg-surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          if (i !== 0) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-elevated)', borderRadius: '8px', color: 'var(--color-accent)' }}>
                          {res.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{res.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{res.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    No results found for "{query}".
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
