// ============================================
// Portfolio OS 2026 — Start Menu
// ============================================
// Windows 11-style centered start menu floating above the taskbar.
//
// Layout:
//   [Search bar — functional]
//   [Pinned apps grid — filtered by search]
//   [Recent apps — last 5 opened]
//   [Recommended section — 3 recent items]
//   [User profile bar + power]
//
// Animated with Framer Motion (scale + fade + translateY).

import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { useUIStore } from '../../store/useUIStore';
import { useFileSystemStore } from '../../store/useFileSystemStore';
import { DESKTOP_APPS, RECOMMENDED_ITEMS, APP_AUTHOR } from '../../constants';
import { APPS } from '../../config/apps';
import { useDebounce } from '../../hooks/useDebounce';
import { useState, useRef, useEffect } from 'react';
import { OS_STATES } from '../../constants';

/**
 * Pinned app icon in the start menu grid
 */
function PinnedApp({ app, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      id={`start-app-${app.id}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 8px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: hovered ? 'var(--color-bg-surface-hover)' : 'transparent',
        transition: 'background var(--transition-fast)',
        minWidth: '80px',
      }}
    >
      {typeof app.icon === 'string' && (app.icon.endsWith('.ico') || app.icon.endsWith('.png') || app.icon.includes('assets/') || app.icon.startsWith('data:image/')) ? (
        <img
          src={app.icon}
          alt={app.label}
          draggable={false}
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
      ) : (
        <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{app.icon}</span>
      )}
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-family)',
          textAlign: 'center',
        }}
      >
        {app.label}
      </span>
    </button>
  );
}

/**
 * Recommended item row
 */
function RecommendedItem({ item }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: hovered ? 'var(--color-bg-surface-hover)' : 'transparent',
        transition: 'background var(--transition-fast)',
        width: '100%',
        textAlign: 'left',
      }}
    >
      {typeof item.icon === 'string' && (item.icon.endsWith('.ico') || item.icon.endsWith('.png') || item.icon.includes('assets/') || item.icon.startsWith('data:image/')) ? (
        <img
          src={item.icon}
          alt={item.label}
          draggable={false}
          style={{ width: '20px', height: '20px', objectFit: 'contain' }}
        />
      ) : (
        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{item.icon}</span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {item.label}
        </span>
        <span
          style={{
            fontSize: '0.6875rem',
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-family)',
          }}
        >
          {item.detail}
        </span>
      </div>
    </button>
  );
}

/**
 * Start Menu main component
 */
export default function StartMenu() {
  const { isStartMenuOpen, closeStartMenu } = useDesktopStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const recentApps = useWindowStore((s) => s.recentApps);
  const { setStartMenuSearchFocused } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 200);
  const searchInputRef = useRef(null);
  const setOsState = useDesktopStore((s) => s.setOsState);

  // Focus search input when menu opens
  useEffect(() => {
    if (isStartMenuOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [isStartMenuOpen]);

  const fileSystem = useFileSystemStore((s) => s.fileSystem);
  
  // Recursively gather all files
  const getAllFiles = (node, path = []) => {
    let results = [];
    if (node.type === 'file') {
      results.push({ ...node, fullPath: [...path, node.name] });
    }
    if (node.children) {
      node.children.forEach(c => {
        results = results.concat(getAllFiles(c, [...path]));
      });
    }
    return results;
  };

  const allFiles = getAllFiles(fileSystem, [fileSystem.name]);

  const MOCK_RESULTS = [
    { id: 'mock1', label: 'Interview-Prep Project', icon: '🚀', action: () => openWindow('projects') },
    { id: 'mock2', label: 'Interview Certificate', icon: '🎓', action: () => openWindow('skills') },
    { id: 'mock3', label: 'Interview Notes', icon: '📝', action: () => openWindow('notepad') },
    { id: 'mock4', label: 'Mock Interview Achievement', icon: '🏆', action: () => openWindow('about') }
  ];

  // Search Logic
  let searchResults = [];
  let isSearching = Boolean(debouncedSearch);

  if (isSearching) {
    const query = debouncedSearch.toLowerCase();
    
    // 1. Apps
    const matchedApps = DESKTOP_APPS.filter(app => 
      app.label.toLowerCase().includes(query) || app.description?.toLowerCase().includes(query)
    ).map(app => ({
      id: app.id,
      label: app.label,
      icon: app.icon,
      type: 'App',
      action: () => {
        if (app.id === 'aiassistant') {
          useDesktopStore.getState().toggleAIAssistant();
        } else {
          openWindow(app.id);
        }
        closeStartMenu();
      }
    }));

    // 2. Files
    const matchedFiles = allFiles.filter(f => f.name.toLowerCase().includes(query)).map(f => ({
      id: f.fullPath.join('/'),
      label: f.name,
      icon: '📄',
      type: 'File',
      action: () => {
        openWindow('notepad', { filePath: f.fullPath });
        closeStartMenu();
      }
    }));

    // 3. Mocks
    const matchedMocks = MOCK_RESULTS.filter(m => m.label.toLowerCase().includes(query)).map(m => ({
      ...m, type: 'Achievement', action: () => { m.action(); closeStartMenu(); }
    }));

    searchResults = [...matchedApps, ...matchedFiles, ...matchedMocks];
  } else {
    // Show Pinned apps by default
    searchResults = DESKTOP_APPS.map(app => ({
      id: app.id,
      label: app.label,
      icon: app.icon,
      type: 'App',
      action: () => {
        if (app.id === 'aiassistant') {
          useDesktopStore.getState().toggleAIAssistant();
        } else {
          openWindow(app.id);
        }
        closeStartMenu();
      }
    }));
  }

  // Get recent apps metadata
  const recentAppItems = recentApps
    .map((id) => APPS[id])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <>
          {/* Invisible backdrop to close the menu on click outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStartMenu}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 900,
            }}
          />

          {/* Start Menu panel */}
          <motion.div
            id="start-menu"
            className="no-select glass-heavy"
            initial={{ opacity: 0, y: 20, x: '-50%', scale: 0.96 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.98 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--taskbar-height) + 12px)',
              left: '50%',
              width: 'min(580px, calc(100vw - 32px))',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-panel)',
              overflow: 'hidden',
              zIndex: 950,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Search bar — now functional */}
            <div style={{ padding: '24px 24px 16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: '24px',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-tertiary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  id="start-menu-search"
                  type="text"
                  placeholder="Type to search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setStartMenuSearchFocused(true)}
                  onBlur={() => setStartMenuSearchFocused(false)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                  }}
                />
              </div>
            </div>

            {/* Pinned Apps / Search Results Grid */}
            <div style={{ flex: 1, padding: '0 24px 24px', overflowY: 'auto', maxHeight: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                  {isSearching ? 'Search Results' : 'Pinned'}
                </h3>
                {!isSearching && (
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', fontSize: '0.75rem', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}>
                    All apps &gt;
                  </button>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '12px 4px',
                }}
              >
                {searchResults.map((result) => (
                  <PinnedApp key={result.id} app={result} onClick={result.action} />
                ))}
                {searchResults.length === 0 && isSearching && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px 0' }}>
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '0 24px',
              }}
            />

            {/* Recent / Recommended section */}
            <div style={{ padding: '16px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  {recentAppItems.length > 0 ? 'Recent' : 'Recommended'}
                </span>
                <button
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-bg-surface)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  More →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {recentAppItems.length > 0
                  ? recentAppItems.map((app) => (
                      <RecommendedItem
                        key={app.id}
                        item={{
                          id: app.id,
                          label: app.title,
                          detail: 'Recently opened',
                          icon: app.icon,
                        }}
                      />
                    ))
                  : RECOMMENDED_ITEMS.map((item) => (
                      <RecommendedItem key={item.id} item={item} />
                    ))}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '0 24px',
              }}
            />

            {/* User bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px 16px',
              }}
            >
              {/* User info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {/* Avatar circle */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-accent), #60cdff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  SK
                </div>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  {APP_AUTHOR}
                </span>
              </div>

              {/* Power button area */}
              <div style={{ position: 'relative' }}>
                {powerMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '40px',
                      right: '0',
                      background: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-panel)',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      minWidth: '120px',
                      zIndex: 1000,
                    }}
                  >
                    <button
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        setPowerMenuOpen(false);
                        closeStartMenu();
                        setOsState(OS_STATES.LOCKED);
                      }}
                    >
                      Sleep
                    </button>
                    <button
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        setPowerMenuOpen(false);
                        window.location.reload();
                      }}
                    >
                      Restart
                    </button>
                    <button
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-surface-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => {
                        setPowerMenuOpen(false);
                        closeStartMenu();
                        setOsState('shutdown');
                      }}
                    >
                      Shut down
                    </button>
                  </div>
                )}
                <button
                  title="Power"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => setPowerMenuOpen(!powerMenuOpen)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
              </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
