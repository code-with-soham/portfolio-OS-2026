import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayFilled, CheckmarkCircleRegular } from '@fluentui/react-icons';
import HorizontalScrollRow from '../components/HorizontalScrollRow';
import gamesData from '../data/games.json';
import { useGameStore } from '../../../store/useGameStore';

// All unique categories
const ALL_CATEGORIES = [...new Set(gamesData.map(g => g.category))];

// Named collections
const COLLECTIONS = [
  { id: 'trending', label: '🔥 Trending Now', filter: g => g.trending },
  { id: 'new', label: '🆕 New Games', filter: g => g.new },
  { id: 'most-played', label: '⭐ Most Played', filter: g => g.collections?.includes('Most Played') },
  { id: 'editors-choice', label: '❤️ Editor\'s Choice', filter: g => g.collections?.includes('Editors Choice') },
  { id: 'retro', label: '🕹️ Retro Classics', filter: g => g.collections?.includes('Retro Classics') },
  { id: 'quick-play', label: '⚡ Quick Play', filter: g => g.collections?.includes('Quick Play') },
  { id: 'brain', label: '🧠 Brain Training', filter: g => g.collections?.includes('Brain Training') },
  { id: 'relaxing', label: '😌 Relaxing Games', filter: g => g.collections?.includes('Relaxing Games') },
  { id: 'family', label: '👨‍👩‍👧 Family Games', filter: g => g.collections?.includes('Family Games') },
  { id: 'hidden-gems', label: '💎 Hidden Gems', filter: g => g.collections?.includes('Hidden Gems') },
  { id: 'offline', label: '📶 Offline Games', filter: g => g.offline },
  { id: 'controller', label: '🎮 Controller Supported', filter: g => g.supportsGamepad },
];

export default function Home({ onSelectGame }) {
  const recentlyPlayedIds = useGameStore(s => s.recentlyPlayed);

  const featured = useMemo(() => gamesData.filter(g => g.featured), []);
  const recentlyPlayed = useMemo(() =>
    recentlyPlayedIds.map(id => gamesData.find(g => g.id === id)).filter(Boolean)
  , [recentlyPlayedIds]);

  // Auto-rotating hero
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const heroGame = featured[heroIndex] || gamesData[0];
  const lastPlayed = recentlyPlayed[0];

  // Category rows
  const categoryRows = useMemo(() =>
    ALL_CATEGORIES.map(cat => ({
      title: cat,
      games: gamesData.filter(g => g.category === cat).slice(0, 10)
    }))
  , []);

  // Collection rows (only show those with games)
  const collectionRows = useMemo(() =>
    COLLECTIONS
      .map(c => ({ title: c.label, games: gamesData.filter(c.filter).slice(0, 10) }))
      .filter(r => r.games.length > 0)
  , []);

  return (
    <div className="gc-page">
      {/* Hero Banner */}
      {heroGame && (
        <div className="gc-hero-container" onClick={() => onSelectGame(heroGame)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={heroGame.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="gc-hero-bg"
              style={{
                backgroundImage: heroGame.banner ? `url(${heroGame.banner})` : undefined,
                backgroundColor: heroGame.banner ? undefined : '#107c10',
                filter: 'blur(2px)',
                transform: 'scale(1.05)'
              }}
            />
          </AnimatePresence>
          <div className="gc-hero-overlay">
            <motion.div
              key={`text-${heroGame.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span style={{ background: '#107c10', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem', fontWeight: 'bold' }}>Featured</span>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem' }}>{heroGame.category}</span>
                {heroGame.difficulty && (
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem' }}>{heroGame.difficulty}</span>
                )}
              </div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: 8 }}>{heroGame.title}</h2>
              <p style={{ maxWidth: 600, fontSize: '1.1rem', marginBottom: 24, color: 'rgba(255,255,255,0.85)' }}>{heroGame.description}</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="gc-btn" onClick={(e) => { e.stopPropagation(); onSelectGame(heroGame); }}>
                  <PlayFilled /> Details
                </button>
              </div>
            </motion.div>
          </div>

          {/* Hero dots indicator */}
          {featured.length > 1 && (
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
              {featured.map((_, i) => (
                <div
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setHeroIndex(i); }}
                  style={{
                    width: i === heroIndex ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === heroIndex ? '#107c10' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Continue Playing */}
      {lastPlayed && (
        <div className="gc-row" style={{ marginTop: 32 }}>
          <h3>Continue Playing</h3>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectGame(lastPlayed)}
            style={{
              background: 'rgba(37, 37, 38, 0.8)',
              borderRadius: 12,
              padding: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              border: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', background: lastPlayed.banner ? `linear-gradient(to right, transparent, rgba(0,0,0,0.5)), url(${lastPlayed.banner})` : 'transparent', backgroundSize: 'cover', opacity: 0.3 }} />
            <div style={{ width: 80, height: 80, background: '#1e1e1e', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', zIndex: 1 }}>
              {lastPlayed.icon}
            </div>
            <div style={{ flex: 1, zIndex: 1 }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>{lastPlayed.title}</h2>
              <div style={{ display: 'flex', gap: 16, color: '#aaa', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckmarkCircleRegular /> Played Recently</span>
                <span>•</span>
                <span>{lastPlayed.category}</span>
              </div>
            </div>
            <button className="gc-btn" onClick={(e) => { e.stopPropagation(); onSelectGame(lastPlayed); }} style={{ zIndex: 1, background: '#107c10', color: '#fff', border: 'none' }}>
              <PlayFilled /> Resume
            </button>
          </motion.div>
        </div>
      )}

      {/* Collections */}
      {collectionRows.slice(0, 4).map(row => (
        <HorizontalScrollRow key={row.title} title={row.title} games={row.games} onSelectGame={onSelectGame} />
      ))}

      {/* Categories */}
      {categoryRows.map(row => (
        <HorizontalScrollRow key={row.title} title={row.title} games={row.games} onSelectGame={onSelectGame} />
      ))}

      {/* More Collections */}
      {collectionRows.slice(4).map(row => (
        <HorizontalScrollRow key={row.title} title={row.title} games={row.games} onSelectGame={onSelectGame} />
      ))}
    </div>
  );
}
