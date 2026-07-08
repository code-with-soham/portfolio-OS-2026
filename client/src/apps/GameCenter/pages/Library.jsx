import { useMemo, useState } from 'react';
import GameCard from '../components/GameCard';
import { useGameStore } from '../../../store/useGameStore';
import gamesData from '../data/games.json';

const ALL_CATEGORIES = ['All', ...new Set(gamesData.map(g => g.category))];

export default function Library({ searchQuery = '', onSelectGame }) {
  const favorites = useGameStore(s => s.favorites);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredGames = useMemo(() => {
    let result = gamesData;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.developer?.toLowerCase().includes(q) ||
        g.collections?.some(c => c.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(g => g.category === activeCategory);
    }

    return result;
  }, [favorites, searchQuery, activeCategory]);

  const title = searchQuery
    ? `Search Results for "${searchQuery}"`
    : activeCategory !== 'All'
      ? activeCategory
      : 'All Games';

  return (
    <div className="gc-page">
      <h2>{title}</h2>
      <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 16 }}>{filteredGames.length} games</p>

      {/* Category Chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: activeCategory === cat ? '1px solid #107c10' : '1px solid rgba(255,255,255,0.1)',
              background: activeCategory === cat ? 'rgba(16,124,16,0.2)' : 'rgba(255,255,255,0.05)',
              color: activeCategory === cat ? '#4caf50' : '#ccc',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredGames.length === 0 ? (
        <p style={{ color: '#aaaaaa' }}>
          {searchQuery ? 'No games found matching your search.' : 'No games in this category yet.'}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} onClick={onSelectGame} />
          ))}
        </div>
      )}
    </div>
  );
}
