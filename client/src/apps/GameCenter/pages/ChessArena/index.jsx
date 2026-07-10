import React, { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessStore } from './store/useChessStore';
import './styles/chess.css';
import { 
  ArrowUndoRegular, 
  ArrowRedoRegular, 
  ArrowSyncRegular,
  FlagRegular,
  SettingsRegular
} from '@fluentui/react-icons';

export default function ChessArena() {
  const { 
    game,
    settings,
    ui,
    makeMove, 
    undoMove, 
    resetGame,
    toggleOrientation,
    setSelectedSquare,
    clearSelection,
  } = useChessStore();

  const [boardWidth, setBoardWidth] = useState(600);

  // Resize observer to keep the board responsive
  useEffect(() => {
    const handleResize = () => {
      const wrapper = document.getElementById('chess-board-container');
      if (wrapper) {
        setBoardWidth(Math.min(wrapper.clientWidth, 600));
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDrop = (sourceSquare, targetSquare, piece) => {
    let promotion = piece[1].toLowerCase() ?? 'q';
    return makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotion,
    });
  };

  const onSquareClick = (square) => {
    if (ui.selectedSquare === square) {
      clearSelection();
    } else {
      setSelectedSquare(square);
    }
  };

  // Convert flat history to pairs for display
  const historyPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < game.history.length; i += 2) {
      pairs.push([game.history[i], game.history[i + 1]]);
    }
    return pairs;
  }, [game.history]);

  // Theme setup
  const customDarkTheme = {
    light: '#3a3f44', // slate gray
    dark: '#24282c',  // deep graphite
    drop: 'rgba(0, 255, 255, 0.5)' // cyan highlights
  };

  const customSquareStyles = {};
  if (ui.lastMove) {
    customSquareStyles[ui.lastMove.from] = { backgroundColor: 'rgba(0, 255, 255, 0.2)' };
    customSquareStyles[ui.lastMove.to] = { backgroundColor: 'rgba(0, 255, 255, 0.4)' };
  }
  if (ui.selectedSquare) {
    customSquareStyles[ui.selectedSquare] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
  }
  ui.legalMoves.forEach(sq => {
    customSquareStyles[sq] = { 
      background: 'radial-gradient(circle, rgba(0,255,255,0.4) 20%, transparent 20%)',
      borderRadius: '50%'
    };
  });
  
  // Find King square if in check
  let checkSquare = null;
  if (game.isCheck) {
    // A bit hacky to find the king without the full board state natively exposed, 
    // but the piece styles will handle it if we knew the square.
    // For now, we apply a general check animation class to the board.
  }

  return (
    <div className={`chess-arena-container ${game.isCheck ? 'in-check' : ''}`}>
      
      {/* Top Toolbar */}
      <div className="chess-toolbar">
        <div className="chess-toolbar-title">
          <span>♟️</span> Chess Arena Pro
        </div>
        <div className="chess-toolbar-actions">
          <button className="chess-btn" onClick={toggleOrientation} title="Flip Board">
            <ArrowSyncRegular /> Flip
          </button>
          <button className="chess-btn" onClick={resetGame} title="Resign / New Game">
            <FlagRegular /> Resign
          </button>
          <button className="chess-btn" title="Settings">
            <SettingsRegular />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="chess-main">
        
        {/* Left Col - Player / Captures / Engine (Sprint 1.5 prep) */}
        <div className="chess-col-left">
          {/* Opponent (Top) */}
          <div className="chess-player-card">
            <div className="chess-player-avatar">🤖</div>
            <div className="chess-player-info">
              <div className="chess-player-name">Stockfish (Mock)</div>
              <div className="chess-player-rating">3200 ELO</div>
              <div className="chess-captured-pieces">
                {game.capturedPieces[settings.orientation === 'white' ? 'w' : 'b'].map((p, i) => (
                  <span key={i} style={{fontSize: 12}}>{p.color === 'w' ? '♙' : '♟'}</span>
                ))}
              </div>
            </div>
            <div className="chess-clock">10:00</div>
          </div>

          {/* Engine Evaluation Panel (Reserved for Sprint 2) */}
          <div className="chess-engine-panel">
            <div className="engine-header">Engine (Reserved)</div>
            <div className="engine-stat">
              <span>Depth</span>
              <span>--</span>
            </div>
            <div className="engine-stat">
              <span>Evaluation</span>
              <span>--</span>
            </div>
            <div className="engine-stat">
              <span>Best Move</span>
              <span>--</span>
            </div>
          </div>

          {/* Player (Bottom) */}
          <div className="chess-player-card">
            <div className="chess-player-avatar">👤</div>
            <div className="chess-player-info">
              <div className="chess-player-name">Soham Kundu</div>
              <div className="chess-player-rating">1500 ELO</div>
              <div className="chess-captured-pieces">
                {game.capturedPieces[settings.orientation === 'white' ? 'b' : 'w'].map((p, i) => (
                   <span key={i} style={{fontSize: 12}}>{p.color === 'w' ? '♙' : '♟'}</span>
                ))}
              </div>
            </div>
            <div className="chess-clock">10:00</div>
          </div>
        </div>

        {/* Center Col - Board */}
        <div className="chess-col-center" id="chess-board-container">
          <div className="chess-board-wrapper">
            <Chessboard
              id="ChessArenaBoard"
              position={game.fen}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              boardOrientation={settings.orientation}
              customDarkSquareStyle={{ backgroundColor: customDarkTheme.dark }}
              customLightSquareStyle={{ backgroundColor: customDarkTheme.light }}
              customDropSquareStyle={{ boxShadow: `inset 0 0 1px 6px ${customDarkTheme.drop}` }}
              customSquareStyles={customSquareStyles}
              animationDuration={settings.animationSpeed}
              boardWidth={boardWidth}
              showBoardNotation={settings.showCoordinates}
            />
          </div>
        </div>

        {/* Right Col - Move History */}
        <div className="chess-col-right">
          <div className="chess-history-header">
            Game History
          </div>
          <div className="chess-history-list">
            {historyPairs.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>No moves yet</div>
            )}
            {historyPairs.map((pair, idx) => (
              <div className="chess-history-row" key={idx}>
                <div className="chess-history-num">{idx + 1}.</div>
                <div className="chess-history-move">{pair[0]?.san}</div>
                <div className="chess-history-move">{pair[1]?.san || ''}</div>
              </div>
            ))}
          </div>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: 4, padding: 12, borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.5)' }}>
            <button className="chess-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={undoMove}>
              <ArrowUndoRegular /> Undo
            </button>
            <button className="chess-btn" style={{ flex: 1, justifyContent: 'center' }}>
              <ArrowRedoRegular /> Redo
            </button>
          </div>
        </div>

      </div>

      {/* Status Bar */}
      <div className="chess-statusbar">
        <div className="chess-statusbar-left">
          <span>Engine Ready</span>
          <span className="dot">•</span>
          <span>{game.turn === 'w' ? 'White to Move' : 'Black to Move'}</span>
          <span className="dot">•</span>
          <span>Move {Math.floor(game.history.length / 2) + 1}</span>
          <span className="dot">•</span>
          <span>Local Match</span>
        </div>
        <div className="chess-statusbar-right">
          {ui.isSaving ? (
            <span className="saving-text">Saving...</span>
          ) : (
            <span className="saved-text">Saved ✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
