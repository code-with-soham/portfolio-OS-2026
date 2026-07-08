import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchRegular } from '@fluentui/react-icons';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Library from './pages/Library';
import Stats from './pages/Stats';
import GameDetails from './pages/GameDetails';
import './GameCenter.css';

export default function GameCenterApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && activeTab !== 'library') {
      setActiveTab('library');
    }
    if (selectedGame) setSelectedGame(null);
  };

  return (
    <div className="game-center-app">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { 
          setActiveTab(tab); 
          setSearchQuery(''); 
          setSelectedGame(null); 
        }} 
      />
      
      <div className="gc-main">
        {/* Header / Search */}
        <div className="gc-header">
          <div className="gc-search">
            <SearchRegular fontSize={18} />
            <input 
              type="text" 
              placeholder="Search games, genres, developers..." 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Content routing */}
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="game-details"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{ height: '100%', overflowY: 'auto' }}
            >
              <GameDetails game={selectedGame} onBack={() => setSelectedGame(null)} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'home' && <Home onSelectGame={setSelectedGame} />}
              {activeTab === 'library' && <Library searchQuery={searchQuery} onSelectGame={setSelectedGame} />}
              {activeTab === 'achievements' && <Stats />}
              {activeTab === 'settings' && (
                <div className="gc-page">
                  <h2>Settings</h2>
                  <p style={{ color: '#aaaaaa' }}>Preferences coming soon...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
