import React, { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { motion, AnimatePresence } from 'framer-motion';
import { useChessStore } from './store/useChessStore';
import AnalysisBoard from './components/AnalysisBoard';
import ChessTutorial from './components/ChessTutorial';
import './styles/chess.css';
import { 
  ArrowUndoRegular, 
  ArrowRedoRegular, 
  ArrowSyncRegular,
  FlagRegular,
  SettingsRegular,
  BookQuestionMarkRegular
} from '@fluentui/react-icons';

export default function ChessArena() {
  const { 
    game,
    settings,
    ui,
    ai,
    makeMove, 
    undoMove, 
    resetGame,
    toggleOrientation,
    setSelectedSquare,
    clearSelection,
    initEngine,
    closeOverlay,
    openTutorial,
    setErrorMessage,
    startAnalysis
  } = useChessStore();

  const [boardWidth, setBoardWidth] = useState(600);
  const [promotionMove, setPromotionMove] = useState(null);

  // Initialize engine on mount
  useEffect(() => {
    initEngine();
    
    // Break any state deadlocks: if it's AI's turn on mount, trigger it!
    const { game, ai, triggerEngine } = useChessStore.getState();
    if (game.status === 'active' && ai.enabled && game.turn === ai.side) {
      triggerEngine();
    }
  }, [initEngine]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        clearSelection();
        setPromotionMove(null);
        if (ui.showResultOverlay) closeOverlay();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleOrientation();
      } else if (e.key === 'z' && e.ctrlKey && !e.shiftKey) {
        undoMove();
      } else if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        resetGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, closeOverlay, toggleOrientation, undoMove, resetGame, ui.showResultOverlay]);

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
    try {
      // Check if it's a promotion move
      const isPawn = piece && piece.charAt(1) === 'P';
      const isPromotionRow = targetSquare.charAt(1) === '8' || targetSquare.charAt(1) === '1';
      
      if (isPawn && isPromotionRow) {
        setPromotionMove({ from: sourceSquare, to: targetSquare });
        return false; // don't move yet
      }

      return makeMove({
        from: sourceSquare,
        to: targetSquare,
      });
    } catch (e) {
      setErrorMessage(`Drop error: ${e.message}`);
      return false;
    }
  };

  const handlePromotion = (piece) => {
    if (promotionMove) {
      makeMove({
        from: promotionMove.from,
        to: promotionMove.to,
        promotion: piece
      });
      setPromotionMove(null);
    }
  };

  const onSquareClick = (square) => {
    try {
      if (ui.selectedSquare === square) {
        clearSelection();
      } else {
        // If we already have a square selected, see if clicking here is a valid move
        if (ui.selectedSquare && ui.legalMoves.includes(square)) {
          makeMove({
            from: ui.selectedSquare,
            to: square
          });
        } else {
          setSelectedSquare(square);
        }
      }
    } catch (e) {
      setErrorMessage(`Click error: ${e.message}`);
    }
  };

  const historyPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < game.history.length; i += 2) {
      pairs.push([game.history[i], game.history[i + 1]]);
    }
    return pairs;
  }, [game.history]);

  const customDarkTheme = {
    light: '#3a3f44',
    dark: '#24282c', 
    drop: 'rgba(0, 255, 255, 0.5)'
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

  const getEvalText = () => {
    if (ai.mate !== undefined && ai.mate !== null) return `Mate in ${Math.abs(ai.mate)}`;
    if (ai.evaluation === undefined || ai.evaluation === null) return '--';
    return ai.evaluation > 0 ? `+${ai.evaluation.toFixed(2)}` : ai.evaluation.toFixed(2);
  };

  const evalPercent = useMemo(() => {
    if (ai.mate !== undefined && ai.mate !== null) return ai.mate > 0 ? 100 : 0;
    if (ai.evaluation === undefined || ai.evaluation === null) return 50;
    // Map -5 to +5 to 0-100%
    const bounded = Math.max(-5, Math.min(5, ai.evaluation));
    return ((bounded + 5) / 10) * 100;
  }, [ai.evaluation, ai.mate]);

  if (ai.analysisMode) {
    return <AnalysisBoard />;
  }

  return (
    <div className={`chess-arena-container ${game.isCheck ? 'in-check' : ''}`}>
      
      <div className="chess-toolbar">
        <div className="chess-toolbar-title">
          <span>♟️</span> Chess Arena Pro
        </div>
        <div className="chess-toolbar-actions">
          <button className="chess-btn" onClick={openTutorial} title="How to Play">
            <BookQuestionMarkRegular /> Tutorial
          </button>
          <button className="chess-btn" onClick={toggleOrientation} title="Flip Board (F)">
            <ArrowSyncRegular /> Flip
          </button>
          <button className="chess-btn" onClick={resetGame} title="New Game (Ctrl+R)">
            <FlagRegular /> New Game
          </button>
          <button className="chess-btn" title="Settings">
            <SettingsRegular />
          </button>
        </div>
      </div>

      <div className="chess-main">
        <div className="chess-col-left">
          <div className="chess-player-card">
            <div className="chess-player-avatar">🤖</div>
            <div className="chess-player-info">
              <div className="chess-player-name">Stockfish</div>
              <div className="chess-player-rating">{ai.personality.charAt(0).toUpperCase() + ai.personality.slice(1)} • Skill {ai.personality === 'casual' ? 5 : (ai.personality === 'master' ? 20 : 1)}</div>
              <div className="chess-player-status" style={{ fontSize: 11, color: ai.thinking ? '#2196f3' : '#aaa' }}>
                {ai.thinking ? 'Thinking...' : 'Waiting'}
              </div>
              <div className="chess-captured-pieces">
                {game.capturedPieces[settings.orientation === 'white' ? 'w' : 'b'].map((p, i) => (
                  <span key={i} style={{fontSize: 12}}>{p.color === 'w' ? '♙' : '♟'}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="chess-engine-panel">
            <div className="engine-header">
              Engine {ai.thinking && <span className="engine-pulse-dot"></span>}
            </div>
            
            <div className="engine-eval-bar">
              <div className="engine-eval-fill" style={{ width: `${evalPercent}%` }}></div>
              <div className="engine-eval-text">{getEvalText() !== '--' ? getEvalText() : ''}</div>
            </div>

            <div className="engine-stat">
              <span>Evaluation</span>
              <span>{getEvalText()}</span>
            </div>
            <div className="engine-stat">
              <span>Depth</span>
              <span>{ai.depth || '--'}</span>
            </div>
            <div className="engine-stat">
              <span>Speed</span>
              <span>{ai.nps ? (ai.nps / 1000).toFixed(1) + ' kN/s' : '--'}</span>
            </div>
            <div className="engine-stat" style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span>Status</span>
              <span style={{ color: ai.thinking ? '#2196f3' : '#aaa' }}>{ai.thinking ? 'Thinking...' : 'Waiting...'}</span>
            </div>
            
            <div className="engine-pv-lines" style={{ marginTop: '8px' }}>
              <div className="engine-header" style={{ fontSize: '10px' }}>Principal Variations</div>
              {(ai.multiPvList || []).length > 0 ? ai.multiPvList.slice(0, 3).map((line, idx) => (
                <div key={idx} style={{ fontSize: '11px', display: 'flex', gap: '8px', marginBottom: '4px', opacity: 1 - (idx * 0.2) }}>
                  <span style={{ color: '#2196f3', width: '30px' }}>{line.eval > 0 && line.eval !== 'M' ? '+' : ''}{line.eval}</span>
                  <span style={{ color: '#aaa', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {line.pv}
                  </span>
                </div>
              )) : (
                <div style={{ fontSize: '11px', color: '#666' }}>--</div>
              )}
            </div>
          </div>

          <div className="chess-player-card">
            <div className="chess-player-avatar">👤</div>
            <div className="chess-player-info">
              <div className="chess-player-name">You</div>
              <div className="chess-player-rating">1500 Elo • {settings.orientation === 'white' ? 'White' : 'Black'}</div>
              <div className="chess-player-status" style={{ fontSize: 11, color: !ai.thinking ? '#4caf50' : '#aaa' }}>
                {!ai.thinking ? 'Your Turn' : 'Waiting'}
              </div>
              <div className="chess-captured-pieces">
                {game.capturedPieces[settings.orientation === 'white' ? 'b' : 'w'].map((p, i) => (
                   <span key={i} style={{fontSize: 12}}>{p.color === 'w' ? '♙' : '♟'}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

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
              arePiecesDraggable={!(ai.enabled && game.turn === ai.side)}
            />
          </div>

          {/* Error Toast */}
          <AnimatePresence>
            {ui.errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  position: 'absolute',
                  top: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#f44336',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  zIndex: 200,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <span>{ui.errorMessage}</span>
                <button 
                  onClick={() => setErrorMessage(null)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tutorial Overlay */}
          <AnimatePresence>
            {ui.showTutorial && <ChessTutorial onClose={closeOverlay} />}
          </AnimatePresence>

          {/* Promotion Modal Overlay */}
          <AnimatePresence>
            {promotionMove && (
              <motion.div 
                className="promotion-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="promotion-modal"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                >
                  <div className="promotion-title">Choose Promotion</div>
                  <div className="promotion-options">
                    <button onClick={() => handlePromotion('q')}>♕ Queen</button>
                    <button onClick={() => handlePromotion('r')}>♖ Rook</button>
                    <button onClick={() => handlePromotion('b')}>♗ Bishop</button>
                    <button onClick={() => handlePromotion('n')}>♘ Knight</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Result Overlay */}
          <AnimatePresence>
            {ui.showResultOverlay && (
              <motion.div 
                className="result-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="result-modal"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                >
                  <div className="result-title">{game.status.toUpperCase()}</div>
                  <div className="result-subtitle">
                    {game.status === 'checkmate' ? (game.turn === 'w' ? 'Black Wins' : 'White Wins') : 'Game Over'}
                  </div>
                  
                  <div className="result-stats">
                    <div className="result-stat-row">
                      <span>Moves</span>
                      <span>{Math.floor(game.history.length / 2)}</span>
                    </div>
                  </div>

                  <div className="result-actions">
                    <button className="result-btn primary" onClick={startAnalysis}>Analysis Board</button>
                    <button className="result-btn" onClick={() => { closeOverlay(); resetGame(); }}>Play Again</button>
                    <button className="result-btn" onClick={closeOverlay}>Close</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="chess-col-right">
          <div className="chess-history-header">
            Game History
          </div>
          <div className="chess-history-list">
            {historyPairs.length === 0 && (
              <div style={{ padding: '30px 10px', textAlign: 'center', color: '#666', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 32, opacity: 0.5 }}>♟️</span>
                <strong style={{ color: '#aaa', fontSize: 14 }}>Game Not Started</strong>
                <span style={{ fontSize: 12 }}>Play your first move</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10, opacity: 0.3, fontFamily: 'monospace', fontSize: 12 }}>
                  <span>e4</span>
                  <span>d4</span>
                  <span>Nf3</span>
                  <span>c4</span>
                </div>
              </div>
            )}
            {historyPairs.map((pair, idx) => (
              <div className="chess-history-row" key={idx}>
                <div className="chess-history-num">{idx + 1}.</div>
                <div className="chess-history-move">{pair[0]?.san}</div>
                <div className="chess-history-move">{pair[1]?.san || ''}</div>
              </div>
            ))}
          </div>
          
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

      <div className="chess-statusbar">
        <div className="chess-statusbar-left">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: ai.thinking ? '#2196f3' : (ai.engineStatus === 'Ready' ? '#4caf50' : 'inherit') }}>
            {ai.thinking && <span className="engine-pulse-dot" style={{ background: '#2196f3' }}></span>}
            {ai.engineStatus || (ai.thinking ? 'Stockfish Thinking...' : 'Engine Ready')}
          </span>
          <span className="dot">•</span>
          <span>{game.turn === 'w' ? 'White to Move' : 'Black to Move'}</span>
          <span className="dot">•</span>
          <span>Move {Math.floor(game.history.length / 2) + 1}</span>
          <span className="dot">•</span>
          <span>{ai.enabled ? 'Play vs AI' : 'Local Match'}</span>
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
