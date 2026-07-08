import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeftRegular, 
  ArrowClockwiseRegular, 
  HeartRegular, 
  HeartFilled,
  ShareRegular,
  FullScreenMaximizeRegular,
  DismissRegular
} from '@fluentui/react-icons';
import { useWindowStore } from '../../store/useWindowStore';
import { useGameStore } from '../../store/useGameStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import GameRuntime from './components/GameRuntime';
import './GamePlayer.css';

export default function GamePlayerApp({ windowId, game, onClose, onMaximize, isMaximized, dragControls }) {
  const addNotification = useNotificationStore(s => s.addNotification);
  
  const toggleFavorite = useGameStore(s => s.toggleFavorite);
  const isFavorite = useGameStore(s => s.favorites.includes(game?.id));
  const recordGamePlayed = useGameStore(s => s.recordGamePlayed);

  const [refreshKey, setRefreshKey] = useState(0);

  // Record game launch
  useEffect(() => {
    if (game?.id) {
      recordGamePlayed(game.id);
    }
  }, [game]);

  if (!game) {
    return <div className="game-player-app">No game selected.</div>;
  }

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  const handleFavorite = () => {
    toggleFavorite(game.id);
  };

  const handleShare = () => {
    addNotification('Share', `${game.title} link copied to clipboard!`, 'system');
  };

  const handleFullscreen = () => {
    if (onMaximize) onMaximize();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="game-player-app">
      {/* Edge-like Toolbar */}
      <div 
        className="gp-toolbar"
        onPointerDown={(e) => {
          // Prevent drag if clicking buttons
          if (e.target.closest('button')) return;
          if (!isMaximized && dragControls) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={handleFullscreen}
        style={{ touchAction: 'none' }}
      >
        <div className="gp-toolbar-left">
          <button className="gp-btn" onClick={handleClose} title="Back to Hub">
            <ArrowLeftRegular fontSize={20} />
          </button>
          <button className="gp-btn" onClick={handleRefresh} title="Reload Game">
            <ArrowClockwiseRegular fontSize={20} />
          </button>
          <div className="gp-toolbar-title" style={{ marginLeft: 8 }}>
            <span>{game.icon}</span> {game.title}
          </div>
        </div>
        
        <div className="gp-toolbar-right">
          <button 
            className={`gp-btn ${isFavorite ? 'active' : ''}`} 
            onClick={handleFavorite}
            title="Favorite"
          >
            {isFavorite ? <HeartFilled fontSize={20} /> : <HeartRegular fontSize={20} />}
          </button>
          <button className="gp-btn" onClick={handleShare} title="Share">
            <ShareRegular fontSize={20} />
          </button>
          <button className="gp-btn" onClick={handleFullscreen} title="Fullscreen">
            <FullScreenMaximizeRegular fontSize={20} />
          </button>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
          <button className="gp-btn" onClick={handleClose} title="Close Game" style={{ color: '#ff5f56' }}>
            <DismissRegular fontSize={20} />
          </button>
        </div>
      </div>

      {/* Game Runtime Layer */}
      <GameRuntime game={game} refreshKey={refreshKey} />
    </div>
  );
}
