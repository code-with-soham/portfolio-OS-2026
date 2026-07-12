import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../../components/app/AppShell';
import './MinesweeperApp.css';

// Difficulties
const DIFFICULTIES = {
  Beginner: { rows: 9, cols: 9, mines: 10 },
  Intermediate: { rows: 16, cols: 16, mines: 40 },
  Expert: { rows: 16, cols: 30, mines: 99 },
};

// Directions for neighboring cells (8 directions)
const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export default function MinesweeperApp() {
  const [difficulty, setDifficulty] = useState('Beginner');
  const [board, setBoard] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, playing, won, lost
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  
  const { rows, cols, mines } = DIFFICULTIES[difficulty];

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
    setBoard(newBoard);
    setStatus('idle');
    setFlags(0);
    setTime(0);
    setFirstClick(true);
  }, [rows, cols]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Timer
  useEffect(() => {
    let interval = null;
    if (status === 'playing') {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else if (status !== 'playing' && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const placeMines = (firstRow, firstCol) => {
    const newBoard = [...board].map(row => [...row].map(cell => ({...cell})));
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      // Don't place mine on first click or already placed
      if (!newBoard[r][c].isMine && (Math.abs(r - firstRow) > 1 || Math.abs(c - firstCol) > 1)) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          DIRS.forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
              count++;
            }
          });
          newBoard[r][c].neighborMines = count;
        }
      }
    }
    return newBoard;
  };

  const checkWinCondition = (currentBoard) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = currentBoard[r][c];
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  const revealCell = (r, c) => {
    if (status === 'won' || status === 'lost') return;
    if (board[r][c].isRevealed || board[r][c].isFlagged) return;

    let currentBoard = board;

    if (firstClick) {
      currentBoard = placeMines(r, c);
      setFirstClick(false);
      setStatus('playing');
    }

    const newBoard = [...currentBoard].map(row => [...row].map(cell => ({...cell})));
    
    if (newBoard[r][c].isMine) {
      // Game Over
      newBoard[r][c].isRevealed = true;
      
      // Reveal all mines
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (newBoard[i][j].isMine) {
            newBoard[i][j].isRevealed = true;
          }
        }
      }
      setBoard(newBoard);
      setStatus('lost');
      return;
    }

    // Flood fill algorithm for empty cells
    const stack = [[r, c]];
    while (stack.length > 0) {
      const [currR, currC] = stack.pop();
      if (!newBoard[currR][currC].isRevealed && !newBoard[currR][currC].isFlagged) {
        newBoard[currR][currC].isRevealed = true;
        if (newBoard[currR][currC].neighborMines === 0) {
          DIRS.forEach(([dr, dc]) => {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              stack.push([nr, nc]);
            }
          });
        }
      }
    }

    setBoard(newBoard);

    if (checkWinCondition(newBoard)) {
      setStatus('won');
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (status === 'won' || status === 'lost') return;
    if (board[r][c].isRevealed) return;

    const newBoard = [...board].map(row => [...row]);
    newBoard[r] = [...board[r]];
    const cell = {...newBoard[r][c]};

    if (!cell.isFlagged && flags >= mines) return; // cannot flag more than total mines

    cell.isFlagged = !cell.isFlagged;
    newBoard[r][c] = cell;

    setBoard(newBoard);
    setFlags(f => cell.isFlagged ? f + 1 : f - 1);
  };

  const getNumberColor = (num) => {
    const colors = [
      'transparent', '#2563eb', '#16a34a', '#dc2626', 
      '#7c3aed', '#9333ea', '#0d9488', '#000000', '#57534e'
    ];
    return colors[num] || 'inherit';
  };

  const formatTime = (seconds) => {
    return seconds.toString().padStart(3, '0');
  };

  return (
    <AppShell>
      <div className="minesweeper-app">
        <div className="minesweeper-header">
          <div className="minesweeper-controls">
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="minesweeper-select"
            >
              {Object.keys(DIFFICULTIES).map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
          
          <div className="minesweeper-hud">
            <div className="minesweeper-counter">
              <span className="counter-icon">🚩</span>
              <span className="counter-text">{formatTime(mines - flags)}</span>
            </div>
            
            <button className="minesweeper-face" onClick={initializeBoard}>
              {status === 'won' ? '😎' : status === 'lost' ? '😵' : '😊'}
            </button>

            <div className="minesweeper-counter">
              <span className="counter-icon">⏱️</span>
              <span className="counter-text">{formatTime(time)}</span>
            </div>
          </div>
        </div>

        <div className="minesweeper-board-wrapper">
          <div 
            className={`minesweeper-board ${status === 'lost' ? 'game-over' : ''} ${status === 'won' ? 'game-won' : ''}`}
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)` 
            }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {board.map((row, r) => 
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`mine-cell ${cell.isRevealed ? 'revealed' : 'hidden'} ${cell.isFlagged ? 'flagged' : ''} ${cell.isMine && cell.isRevealed ? 'mine' : ''}`}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  style={{
                    color: cell.isRevealed && !cell.isMine ? getNumberColor(cell.neighborMines) : 'inherit'
                  }}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? '💣' : (cell.neighborMines > 0 ? cell.neighborMines : '')
                  ) : (
                    cell.isFlagged ? '🚩' : ''
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {status === 'won' && (
          <div className="minesweeper-overlay won">
            <div className="minesweeper-dialog glass-panel">
              <h2>You Won! 🎉</h2>
              <p>Time: {time} seconds</p>
              <button className="minesweeper-btn primary" onClick={initializeBoard}>Play Again</button>
            </div>
          </div>
        )}

        {status === 'lost' && (
          <div className="minesweeper-overlay lost">
            <div className="minesweeper-dialog glass-panel">
              <h2>Game Over 💥</h2>
              <button className="minesweeper-btn primary" onClick={initializeBoard}>Try Again</button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
