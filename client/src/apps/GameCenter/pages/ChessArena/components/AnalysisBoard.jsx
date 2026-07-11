import React, { useMemo, useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { useChessStore } from '../store/useChessStore';
import { 
  PlayRegular, 
  PreviousRegular, 
  NextRegular, 
  ArrowStepBackRegular, 
  ArrowStepInRegular,
  DismissRegular
} from '@fluentui/react-icons';
import { CLASSIFICATIONS } from '../ai/moveClassification';
import '../styles/analysis.css';

export default function AnalysisBoard() {
  const { 
    game, 
    settings, 
    analysis, 
    ai, 
    jumpToMove, 
    stopAnalysis 
  } = useChessStore();
  
  const [boardWidth, setBoardWidth] = useState(500);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Resize observer
  useEffect(() => {
    const handleResize = () => {
      const wrapper = document.getElementById('analysis-board-container');
      if (wrapper) {
        setBoardWidth(Math.min(wrapper.clientWidth, 500));
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') stopAnalysis();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [analysis.currentMoveIndex, analysis.moves]);

  // Autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setInterval(() => {
        const nextIdx = analysis.currentMoveIndex === -1 ? 0 : analysis.currentMoveIndex + 1;
        if (nextIdx < analysis.moves.length) {
          jumpToMove(nextIdx);
        } else {
          setIsAutoPlaying(false);
        }
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [isAutoPlaying, analysis.currentMoveIndex, analysis.moves.length, jumpToMove]);

  // Navigation
  const handlePrev = () => {
    if (analysis.currentMoveIndex === -1) {
      jumpToMove(analysis.moves.length - 2);
    } else if (analysis.currentMoveIndex > 0) {
      jumpToMove(analysis.currentMoveIndex - 1);
    }
  };
  const handleNext = () => {
    if (analysis.currentMoveIndex !== -1 && analysis.currentMoveIndex < analysis.moves.length - 1) {
      jumpToMove(analysis.currentMoveIndex + 1);
    } else if (analysis.currentMoveIndex === analysis.moves.length - 1) {
      jumpToMove(-1);
    }
  };

  // Determine current position to display
  const currentMoveData = analysis.currentMoveIndex === -1 
    ? analysis.moves[analysis.moves.length - 1] 
    : analysis.moves[analysis.currentMoveIndex];
    
  const displayFen = currentMoveData ? currentMoveData.afterFen : game.fen;

  // Format Graph Data
  const graphData = useMemo(() => {
    return analysis.moves.map((m, idx) => {
      // Stockfish eval is from perspective of the player to move
      // To graph it cleanly, we want White's advantage to always be positive.
      // m.evaluation is from opponent's perspective. Wait.
      // When m is evaluated, it was evaluated from the opponent's perspective. 
      // If m is white's move, m.evaluation (before inversion) was black's perspective.
      // But in useChessStore we set m.evaluation to White's perspective if it was White's move.
      // Wait, we did: evalAfter = -(moveData.evaluation). So it's from the player who moved.
      // If white moved, m.evaluation is positive if white is better.
      // If black moved, m.evaluation is positive if black is better.
      // To plot an absolute graph where + is white advantage, we must flip back if black moved.
      let absoluteEval = m.color === 'w' ? m.evaluation : -m.evaluation;
      
      // Cap at +10 / -10 for graph readability
      absoluteEval = Math.max(-10, Math.min(10, absoluteEval));

      return {
        move: idx,
        eval: absoluteEval,
        classification: m.classification?.id,
        color: m.color
      };
    });
  }, [analysis.moves]);

  // Styling for the board
  const customDarkTheme = {
    light: '#3a3f44',
    dark: '#24282c', 
  };
  
  const customSquareStyles = {};
  if (currentMoveData && currentMoveData.playedMove) {
    const from = currentMoveData.playedMove.substring(0, 2);
    const to = currentMoveData.playedMove.substring(2, 4);
    customSquareStyles[from] = { backgroundColor: 'rgba(0, 255, 255, 0.2)' };
    customSquareStyles[to] = { backgroundColor: 'rgba(0, 255, 255, 0.4)' };
    
    // Highlight classification
    if (currentMoveData.classification && currentMoveData.classification.id !== 'book' && currentMoveData.classification.id !== 'best') {
      customSquareStyles[to] = { 
        ...customSquareStyles[to],
        boxShadow: `inset 0 0 0 3px ${currentMoveData.classification.color}`
      };
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const moveObj = analysis.moves[data.move];
      return (
        <div className="graph-tooltip">
          <div>{moveObj.color === 'w' ? 'White' : 'Black'} Move {Math.floor(data.move / 2) + 1}</div>
          <div>{moveObj.san}</div>
          <div style={{ color: moveObj.classification?.color || '#fff' }}>
            {moveObj.classification?.label}
          </div>
          <div>Eval: {data.eval > 0 ? '+' : ''}{data.eval.toFixed(2)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analysis-board">
      
      {/* 1. Summary Header */}
      <div className="analysis-summary">
        <div className="analysis-header-title">
          <span>Game Analysis</span>
          <button className="chess-btn" onClick={stopAnalysis}>
            <DismissRegular /> Exit Analysis
          </button>
        </div>
        
        <div className="analysis-progress-bar">
          <div className="analysis-progress-fill" style={{ width: `${analysis.progress}%` }}></div>
        </div>
        <div className="analysis-progress-text">
          {analysis.statusText}
        </div>

        <div className="analysis-accuracy-dashboard">
          <div className="accuracy-card white">
            <div className="acc-score">{analysis.accuracy.w}%</div>
            <div className="acc-label">White Accuracy</div>
            <div className="acc-tallies">
              <span title="Brilliant">⭐ {analysis.tallies.w.brilliant}</span>
              <span title="Great">💙 {analysis.tallies.w.great}</span>
              <span title="Best">★ {analysis.tallies.w.best}</span>
              <span title="Inaccuracy" style={{color: CLASSIFICATIONS.INACCURACY.color}}>⁈ {analysis.tallies.w.inaccuracy}</span>
              <span title="Mistake" style={{color: CLASSIFICATIONS.MISTAKE.color}}>? {analysis.tallies.w.mistake}</span>
              <span title="Blunder" style={{color: CLASSIFICATIONS.BLUNDER.color}}>?? {analysis.tallies.w.blunder}</span>
            </div>
          </div>
          <div className="accuracy-card black">
            <div className="acc-score">{analysis.accuracy.b}%</div>
            <div className="acc-label">Black Accuracy</div>
            <div className="acc-tallies">
              <span title="Brilliant">⭐ {analysis.tallies.b.brilliant}</span>
              <span title="Great">💙 {analysis.tallies.b.great}</span>
              <span title="Best">★ {analysis.tallies.b.best}</span>
              <span title="Inaccuracy" style={{color: CLASSIFICATIONS.INACCURACY.color}}>⁈ {analysis.tallies.b.inaccuracy}</span>
              <span title="Mistake" style={{color: CLASSIFICATIONS.MISTAKE.color}}>? {analysis.tallies.b.mistake}</span>
              <span title="Blunder" style={{color: CLASSIFICATIONS.BLUNDER.color}}>?? {analysis.tallies.b.blunder}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3 Columns */}
      <div className="analysis-main-cols">
        
        {/* Left: Move Explorer */}
        <div className="analysis-col explorer">
          <div className="explorer-header">Move Explorer</div>
          <div className="explorer-list custom-scrollbar">
            {analysis.moves.length === 0 && <div style={{padding: 20, color:'#666'}}>Analyzing...</div>}
            {Array.from({ length: Math.ceil(analysis.moves.length / 2) }).map((_, i) => {
              const wIndex = i * 2;
              const bIndex = i * 2 + 1;
              const wMove = analysis.moves[wIndex];
              const bMove = analysis.moves[bIndex];

              return (
                <div className="explorer-row" key={i}>
                  <div className="explorer-num">{i + 1}.</div>
                  <div 
                    className={`explorer-move ${analysis.currentMoveIndex === wIndex ? 'active' : ''}`}
                    onClick={() => jumpToMove(wIndex)}
                  >
                    {wMove?.san}
                    {wMove?.classification && (
                      <span className="move-icon" style={{color: wMove.classification.color}}>
                        {wMove.classification.icon}
                      </span>
                    )}
                  </div>
                  <div 
                    className={`explorer-move ${analysis.currentMoveIndex === bIndex ? 'active' : ''}`}
                    onClick={() => jumpToMove(bIndex)}
                  >
                    {bMove?.san}
                    {bMove?.classification && (
                      <span className="move-icon" style={{color: bMove.classification.color}}>
                        {bMove.classification.icon}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="explorer-controls">
            <button onClick={() => jumpToMove(0)}><ArrowStepBackRegular /></button>
            <button onClick={handlePrev}><PreviousRegular /></button>
            <button onClick={() => setIsAutoPlaying(!isAutoPlaying)}>
              <PlayRegular style={{ color: isAutoPlaying ? '#4caf50' : '#fff' }} />
            </button>
            <button onClick={handleNext}><NextRegular /></button>
            <button onClick={() => jumpToMove(-1)}><ArrowStepInRegular /></button>
          </div>
        </div>

        {/* Center: Board */}
        <div className="analysis-col board" id="analysis-board-container">
          <div className="chess-board-wrapper">
            <Chessboard
              id="AnalysisBoard"
              position={displayFen}
              boardOrientation={settings.orientation}
              customDarkSquareStyle={{ backgroundColor: customDarkTheme.dark }}
              customLightSquareStyle={{ backgroundColor: customDarkTheme.light }}
              customSquareStyles={customSquareStyles}
              animationDuration={200}
              boardWidth={boardWidth}
              showBoardNotation={settings.showCoordinates}
              arePiecesDraggable={false} // Read-only in analysis
            />
          </div>
        </div>

        {/* Right: Engine / Coaching */}
        <div className="analysis-col engine">
          <div className="engine-header">Engine Suggestions</div>
          
          {currentMoveData ? (
            <div className="analysis-engine-details">
              <div className="ae-stat-large">
                <span style={{color: currentMoveData.classification?.color || '#fff'}}>
                  {currentMoveData.classification?.label || 'Analyzed'}
                </span>
                <span>{currentMoveData.evaluation > 0 ? '+' : ''}{currentMoveData.evaluation.toFixed(2)}</span>
              </div>
              
              {(currentMoveData.classification?.id === 'mistake' || currentMoveData.classification?.id === 'blunder') && (
                <div className="ae-suggestion">
                  <strong>Better was:</strong> {currentMoveData.bestMove}
                  <br />
                  <span style={{ fontSize: '12px', color: '#aaa' }}>
                    Evaluation drop: {currentMoveData.loss.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="ae-pv">
                <strong>Principal Variation:</strong>
                <div>{currentMoveData.pv || '--'}</div>
              </div>
            </div>
          ) : (
            <div style={{padding: 20, color:'#666'}}>Select a move to view details.</div>
          )}
        </div>

      </div>

      {/* Bottom: Evaluation Graph */}
      <div className="analysis-graph">
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={graphData} onClick={(e) => {
            if (e && e.activeTooltipIndex !== undefined) {
               jumpToMove(e.activeTooltipIndex);
            }
          }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="move" hide />
            <YAxis domain={[-10, 10]} width={30} tick={{fill: '#666', fontSize: 10}} />
            <RechartsTooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
            <Line 
              type="monotone" 
              dataKey="eval" 
              stroke="#2196f3" 
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (!payload.classification) return null;
                const cls = CLASSIFICATIONS[payload.classification.toUpperCase()];
                if (cls && cls.id !== 'book' && cls.id !== 'best' && cls.id !== 'good') {
                   return <circle cx={cx} cy={cy} r={4} fill={cls.color} key={payload.move} />;
                }
                return null;
              }}
              activeDot={{ r: 6, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
