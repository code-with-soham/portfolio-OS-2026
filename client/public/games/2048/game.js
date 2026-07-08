class Game2048 {
  constructor() {
    this.size = 4;
    this.grid = [];
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('2048-best-score')) || 0;
    this.won = false;
    this.over = false;
    this.keepPlaying = false;
    this.achievementsUnlocked = {
      reached2048: false,
      firstMerge: false
    };

    // DOM Elements
    this.gridContainer = document.getElementById('tile-container');
    this.scoreEl = document.getElementById('score');
    this.bestScoreEl = document.getElementById('best-score');
    this.scoreAdditionEl = document.getElementById('score-addition');
    this.messageEl = document.getElementById('game-message');
    this.messageText = document.getElementById('message-text');

    this.bestScoreEl.textContent = this.bestScore;

    this.setupInputs();
    this.setupButtons();
    this.start();
  }

  start() {
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    this.score = 0;
    this.won = false;
    this.over = false;
    this.keepPlaying = false;
    this.updateScore(0);
    this.gridContainer.innerHTML = '';
    this.hideMessage();
    
    // Spawn two initial tiles
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  // --- Core Logic ---

  addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) emptyCells.push({ r, c });
      }
    }
    
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;
      this.grid[r][c] = { value, id: Math.random().toString(36).substr(2, 9), isNew: true };
    }
  }

  move(direction) {
    if (this.over || (this.won && !this.keepPlaying)) return;

    // 0: up, 1: right, 2: down, 3: left
    let moved = false;
    let scoreGained = 0;

    // Remove isNew and isMerged flags
    this.grid.forEach(row => row.forEach(tile => {
      if (tile) {
        tile.isNew = false;
        tile.isMerged = false;
      }
    }));

    const vector = this.getVector(direction);
    const traversals = this.buildTraversals(vector);

    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        const r = y;
        const c = x;
        const tile = this.grid[r][c];

        if (tile) {
          const { farthest, next } = this.findFarthestPosition({ r, c }, vector);
          const nextTile = next.r >= 0 && next.r < this.size && next.c >= 0 && next.c < this.size 
            ? this.grid[next.r][next.c] : null;

          if (nextTile && nextTile.value === tile.value && !nextTile.isMerged) {
            // Merge
            const newValue = tile.value * 2;
            this.grid[next.r][next.c] = {
              value: newValue,
              id: nextTile.id, // Keep target ID for animation
              isMerged: true
            };
            this.grid[r][c] = null;
            moved = true;
            scoreGained += newValue;

            // Achievement: First Merge
            if (!this.achievementsUnlocked.firstMerge) {
              this.achievementsUnlocked.firstMerge = true;
              this.postOSEvent('UNLOCK_ACHIEVEMENT', { achievementId: '2048_first_merge', title: 'First Merge in 2048' });
            }

            // Achievement/Win: 2048
            if (newValue === 2048 && !this.won) {
              this.won = true;
              if (!this.achievementsUnlocked.reached2048) {
                this.achievementsUnlocked.reached2048 = true;
                this.postOSEvent('UNLOCK_ACHIEVEMENT', { achievementId: '2048_victory', title: 'Reached 2048!' });
                this.postOSEvent('ADD_XP', { amount: 500 });
              }
            }
          } else if (farthest.r !== r || farthest.c !== c) {
            // Move
            this.grid[farthest.r][farthest.c] = tile;
            this.grid[r][c] = null;
            moved = true;
          }
        }
      });
    });

    if (moved) {
      this.updateScore(scoreGained);
      this.addRandomTile();
      this.render();

      if (!this.movesAvailable()) {
        this.over = true;
        this.showGameOver();
      } else if (this.won && !this.keepPlaying) {
        this.showWin();
      }
    }
  }

  getVector(direction) {
    const map = {
      0: { x: 0,  y: -1 }, // Up
      1: { x: 1,  y: 0  }, // Right
      2: { x: 0,  y: 1  }, // Down
      3: { x: -1, y: 0  }  // Left
    };
    return map[direction];
  }

  buildTraversals(vector) {
    const traversals = { x: [], y: [] };
    for (let pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }
    if (vector.x === 1) traversals.x.reverse();
    if (vector.y === 1) traversals.y.reverse();
    return traversals;
  }

  findFarthestPosition(cell, vector) {
    let previous;
    do {
      previous = cell;
      cell = { r: previous.r + vector.y, c: previous.c + vector.x };
    } while (
      cell.r >= 0 && cell.r < this.size &&
      cell.c >= 0 && cell.c < this.size &&
      !this.grid[cell.r][cell.c]
    );

    return {
      farthest: previous,
      next: cell
    };
  }

  movesAvailable() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) return true;
        const val = this.grid[r][c].value;
        if (
          (r < this.size - 1 && this.grid[r + 1][c] && this.grid[r + 1][c].value === val) ||
          (c < this.size - 1 && this.grid[r][c + 1] && this.grid[r][c + 1].value === val)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // --- Rendering ---

  render() {
    this.gridContainer.innerHTML = '';
    
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const tile = this.grid[r][c];
        if (tile) {
          const tileEl = document.createElement('div');
          
          let classes = ['tile', `tile-${tile.value > 2048 ? 'super' : tile.value}`, `tile-pos-${r}-${c}`];
          if (tile.isNew) classes.push('tile-new');
          if (tile.isMerged) classes.push('tile-merged');
          
          tileEl.className = classes.join(' ');
          
          const inner = document.createElement('div');
          inner.className = 'tile-inner';
          inner.textContent = tile.value;
          
          tileEl.appendChild(inner);
          this.gridContainer.appendChild(tileEl);
        }
      }
    }
  }

  updateScore(added) {
    this.score += added;
    this.scoreEl.textContent = this.score;
    
    if (added > 0) {
      this.scoreAdditionEl.textContent = `+${added}`;
      this.scoreAdditionEl.classList.remove('active');
      // trigger reflow
      void this.scoreAdditionEl.offsetWidth;
      this.scoreAdditionEl.classList.add('active');
    }

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.bestScoreEl.textContent = this.bestScore;
      localStorage.setItem('2048-best-score', this.bestScore);
    }
  }

  showWin() {
    this.messageEl.className = 'game-message active game-won';
    this.messageText.textContent = 'You Win!';
    document.getElementById('keep-playing-btn').style.display = 'block';
  }

  showGameOver() {
    this.messageEl.className = 'game-message active game-over';
    this.messageText.textContent = 'Game Over!';
    document.getElementById('keep-playing-btn').style.display = 'none';
  }

  hideMessage() {
    this.messageEl.className = 'game-message';
  }

  // --- Inputs ---

  setupInputs() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
      const map = {
        ArrowUp: 0, w: 0, W: 0,
        ArrowRight: 1, d: 1, D: 1,
        ArrowDown: 2, s: 2, S: 2,
        ArrowLeft: 3, a: 3, A: 3
      };
      if (map[e.key] !== undefined) {
        e.preventDefault();
        this.move(map[e.key]);
      }
    });

    // Touch / Swipe
    let touchStartClientX, touchStartClientY;
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) return;
      touchStartClientX = e.touches[0].clientX;
      touchStartClientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling on mobile
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      if (e.touches.length > 0) return;
      const dx = e.changedTouches[0].clientX - touchStartClientX;
      const dy = e.changedTouches[0].clientY - touchStartClientY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
          this.move(dx > 0 ? 1 : 3); // Right or Left
        } else {
          this.move(dy > 0 ? 2 : 0); // Down or Up
        }
      }
    });
  }

  setupButtons() {
    document.getElementById('new-game-btn').addEventListener('click', () => this.start());
    document.getElementById('retry-btn').addEventListener('click', () => this.start());
    document.getElementById('keep-playing-btn').addEventListener('click', () => {
      this.keepPlaying = true;
      this.hideMessage();
    });
  }

  // --- OS Integration ---
  
  postOSEvent(action, payload) {
    if (window.parent) {
      window.parent.postMessage({
        type: 'OS_GAME_EVENT',
        payload: { action, ...payload }
      }, '*');
    }
  }
}

// Start Game
window.onload = () => {
  new Game2048();
};
