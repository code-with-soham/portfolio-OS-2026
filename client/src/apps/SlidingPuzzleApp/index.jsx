import { useState, useEffect, useCallback } from 'react';
import { PlayRegular, ArrowClockwiseRegular, CheckmarkCircleRegular, TrophyRegular } from '@fluentui/react-icons';
import './SlidingPuzzleApp.css';

const GRID_SIZES = [3, 4, 5];

const IMAGES = [
  { id: 'city', name: 'Cyberpunk City', url: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop' },
  { id: 'forest', name: 'Fantasy Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop' },
  { id: 'space', name: 'Deep Space', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop' }
];

export default function SlidingPuzzleApp({ windowId }) {
  const [gridSize, setGridSize] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [emptyPos, setEmptyPos] = useState({ r: 2, c: 2 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [selectedImage, setSelectedImage] = useState(IMAGES[0]);

  // Solvability check
  const isSolvable = useCallback((puzzleArray, size) => {
    let invCount = 0;
    for (let i = 0; i < puzzleArray.length - 1; i++) {
      for (let j = i + 1; j < puzzleArray.length; j++) {
        if (puzzleArray[i] && puzzleArray[j] && puzzleArray[i] > puzzleArray[j]) {
          invCount++;
        }
      }
    }
    if (size % 2 !== 0) {
      return invCount % 2 === 0;
    } else {
      const emptyRowFromBottom = size - Math.floor(puzzleArray.indexOf(0) / size);
      if (emptyRowFromBottom % 2 === 0) {
        return invCount % 2 !== 0;
      } else {
        return invCount % 2 === 0;
      }
    }
  }, []);

  const initGame = useCallback(() => {
    let newTiles = [];
    let n = gridSize * gridSize;
    let puzzleArray = [];
    do {
      puzzleArray = Array.from({ length: n }, (_, i) => i);
      for (let i = puzzleArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzleArray[i], puzzleArray[j]] = [puzzleArray[j], puzzleArray[i]];
      }
    } while (!isSolvable(puzzleArray, gridSize));

    let emptyR = 0;
    let emptyC = 0;

    for (let r = 0; r < gridSize; r++) {
      let row = [];
      for (let c = 0; c < gridSize; c++) {
        const val = puzzleArray[r * gridSize + c];
        row.push(val);
        if (val === 0) {
          emptyR = r;
          emptyC = c;
        }
      }
      newTiles.push(row);
    }
    
    setTiles(newTiles);
    setEmptyPos({ r: emptyR, c: emptyC });
    setMoves(0);
    setTime(0);
    setIsWin(false);
    setIsPlaying(true);
  }, [gridSize, isSolvable]);

  // Timer
  useEffect(() => {
    let timer;
    if (isPlaying && !isWin) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isWin]);

  const checkWin = (currentTiles) => {
    let count = 1;
    let n = gridSize * gridSize;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (r === gridSize - 1 && c === gridSize - 1) {
          if (currentTiles[r][c] !== 0) return false;
        } else {
          if (currentTiles[r][c] !== count) return false;
        }
        count++;
      }
    }
    return true;
  };

  const handleTileClick = (r, c) => {
    if (!isPlaying || isWin) return;
    
    const dr = Math.abs(r - emptyPos.r);
    const dc = Math.abs(c - emptyPos.c);
    
    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
      // Valid move
      let newTiles = tiles.map(row => [...row]);
      newTiles[emptyPos.r][emptyPos.c] = newTiles[r][c];
      newTiles[r][c] = 0;
      
      setTiles(newTiles);
      setEmptyPos({ r, c });
      setMoves(m => m + 1);
      
      if (checkWin(newTiles)) {
        setIsWin(true);
      }
    }
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Preview initial setup if not playing
  useEffect(() => {
    if (!isPlaying) {
      let t = [];
      let count = 1;
      for (let r = 0; r < gridSize; r++) {
        let row = [];
        for (let c = 0; c < gridSize; c++) {
          if (r === gridSize - 1 && c === gridSize - 1) {
            row.push(0);
          } else {
            row.push(count++);
          }
        }
        t.push(row);
      }
      setTiles(t);
      setEmptyPos({ r: gridSize - 1, c: gridSize - 1 });
    }
  }, [gridSize, isPlaying]);

  return (
    <div className="puzzle-app">
      <div className="puzzle-sidebar">
        <h2>Settings</h2>
        
        <div className="setting-group">
          <label>Difficulty (Grid Size)</label>
          <div className="grid-buttons">
            {GRID_SIZES.map(s => (
              <button 
                key={s} 
                className={`puzzle-btn ${gridSize === s ? 'active' : ''}`}
                onClick={() => { setGridSize(s); setIsPlaying(false); }}
              >
                {s}x{s}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Image Theme</label>
          <div className="theme-buttons">
            {IMAGES.map(img => (
              <div 
                key={img.id}
                className={`theme-preview ${selectedImage.id === img.id ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
                style={{ backgroundImage: `url(${img.url})` }}
                title={img.name}
              >
                {selectedImage.id === img.id && <CheckmarkCircleRegular className="check-icon" />}
              </div>
            ))}
          </div>
        </div>

        <div className="stats-box">
          <div className="stat-item">
            <span>Moves:</span>
            <strong>{moves}</strong>
          </div>
          <div className="stat-item">
            <span>Time:</span>
            <strong>{formatTime(time)}</strong>
          </div>
        </div>

        <button className="puzzle-primary-btn" onClick={initGame}>
          {isPlaying ? <><ArrowClockwiseRegular /> Restart Game</> : <><PlayRegular /> Start Game</>}
        </button>
      </div>

      <div className="puzzle-main">
        <div 
          className={`puzzle-board ${isWin ? 'won' : ''}`}
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`
          }}
        >
          {tiles.map((row, r) => 
            row.map((val, c) => {
              if (val === 0) {
                return <div key={`empty-${r}-${c}`} className="puzzle-tile empty" />;
              }
              
              const bgSize = gridSize * 100;
              const correctR = Math.floor((val - 1) / gridSize);
              const correctC = (val - 1) % gridSize;
              
              return (
                <div 
                  key={val} 
                  className={`puzzle-tile ${val !== 0 ? 'filled' : ''}`}
                  onClick={() => handleTileClick(r, c)}
                  style={{
                    backgroundImage: `url(${selectedImage.url})`,
                    backgroundSize: `${bgSize}% ${bgSize}%`,
                    backgroundPosition: `${(correctC / (gridSize - 1)) * 100}% ${(correctR / (gridSize - 1)) * 100}%`
                  }}
                >
                  <span className="tile-number">{val}</span>
                </div>
              );
            })
          )}
          
          {isWin && (
            <div className="puzzle-win-overlay">
              <TrophyRegular fontSize={64} color="#ffd700" />
              <h3>Puzzle Solved!</h3>
              <p>Moves: {moves}</p>
              <p>Time: {formatTime(time)}</p>
              <button className="puzzle-primary-btn" onClick={initGame}>Play Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
