class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Grid settings
    this.gridSize = 20;
    this.tileCount = this.canvas.width / this.gridSize; // 400 / 20 = 20
    
    // Game state
    this.snake = [];
    this.velocity = { x: 0, y: 0 };
    this.apple = { x: 15, y: 15 };
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('snake-best-score')) || 0;
    this.gameOver = false;
    this.isPaused = false;
    this.gameLoopInterval = null;
    this.speed = 130; // ms per frame
    
    // Achievements
    this.achievementsUnlocked = {
      firstBite: false,
      snakeCharmer: false
    };

    // DOM Elements
    this.scoreEl = document.getElementById('score');
    this.bestScoreEl = document.getElementById('best-score');
    this.messageEl = document.getElementById('game-message');
    this.pauseEl = document.getElementById('pause-message');
    this.finalScoreEl = document.getElementById('final-score');
    
    this.bestScoreEl.textContent = this.bestScore;

    this.setupInputs();
    this.setupButtons();
    this.setupTutorial();
    this.start();
  }

  start() {
    // Reset state
    this.snake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    this.velocity = { x: 0, y: -1 }; // Start moving up
    this.score = 0;
    this.gameOver = false;
    this.isPaused = false;
    this.speed = 130;
    
    this.scoreEl.textContent = this.score;
    this.messageEl.classList.remove('active');
    this.pauseEl.classList.remove('active');
    
    this.spawnApple();
    
    if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
    this.gameLoopInterval = setInterval(() => this.gameLoop(), this.speed);
  }

  gameLoop() {
    if (this.isPaused || this.gameOver) return;
    
    this.update();
    this.draw();
  }

  update() {
    // Move snake
    const head = { 
      x: this.snake[0].x + this.velocity.x, 
      y: this.snake[0].y + this.velocity.y 
    };

    // Check Wall Collision
    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      this.triggerGameOver();
      return;
    }

    // Check Self Collision
    for (let i = 0; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.triggerGameOver();
        return;
      }
    }

    this.snake.unshift(head); // Add new head

    // Check Apple Collision
    if (head.x === this.apple.x && head.y === this.apple.y) {
      this.score += 10;
      this.scoreEl.textContent = this.score;
      
      // Speed up slightly as you progress
      if (this.score % 50 === 0 && this.speed > 65) {
        this.speed -= 3;
        clearInterval(this.gameLoopInterval);
        this.gameLoopInterval = setInterval(() => this.gameLoop(), this.speed);
      }

      // Achievement: First Bite
      if (!this.achievementsUnlocked.firstBite) {
        this.achievementsUnlocked.firstBite = true;
        this.postOSEvent('UNLOCK_ACHIEVEMENT', { achievementId: 'snake_first_bite', title: 'First Bite in Snake' });
      }

      // Achievement: Snake Charmer (Score 500)
      if (this.score === 500 && !this.achievementsUnlocked.snakeCharmer) {
        this.achievementsUnlocked.snakeCharmer = true;
        this.postOSEvent('UNLOCK_ACHIEVEMENT', { achievementId: 'snake_charmer', title: 'Snake Charmer (Score 500)' });
        this.postOSEvent('ADD_XP', { amount: 200 });
      }

      this.spawnApple();
    } else {
      this.snake.pop(); // Remove tail if no apple eaten
    }
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(10, 10, 15, 1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Grid (Optional, subtle)
    this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.05)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < this.canvas.width; i += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }

    // Draw Apple
    this.ctx.fillStyle = '#ff073a';
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#ff073a';
    this.ctx.beginPath();
    this.ctx.arc(
      this.apple.x * this.gridSize + this.gridSize / 2, 
      this.apple.y * this.gridSize + this.gridSize / 2, 
      this.gridSize / 2 - 2, 
      0, 
      Math.PI * 2
    );
    this.ctx.fill();

    // Draw Snake
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#39ff14';
    
    for (let i = 0; i < this.snake.length; i++) {
      const part = this.snake[i];
      
      // Head is white, body is neon green
      this.ctx.fillStyle = i === 0 ? '#ffffff' : '#39ff14';
      
      // Slightly smaller boxes for body to show segments
      this.ctx.fillRect(
        part.x * this.gridSize + 1, 
        part.y * this.gridSize + 1, 
        this.gridSize - 2, 
        this.gridSize - 2
      );
    }
    
    // Reset shadow for next frame
    this.ctx.shadowBlur = 0;
  }

  spawnApple() {
    let newApple;
    let isOccupied = true;
    
    while (isOccupied) {
      newApple = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      };
      
      // Check if apple spawned on snake
      isOccupied = this.snake.some(part => part.x === newApple.x && part.y === newApple.y);
    }
    
    this.apple = newApple;
  }

  triggerGameOver() {
    this.gameOver = true;
    clearInterval(this.gameLoopInterval);
    
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.bestScoreEl.textContent = this.bestScore;
      localStorage.setItem('snake-best-score', this.bestScore);
    }
    
    this.finalScoreEl.textContent = `Score: ${this.score}`;
    this.messageEl.classList.add('active');
    
    // Small XP reward on game over based on score
    if (this.score > 50) {
      this.postOSEvent('ADD_XP', { amount: Math.floor(this.score / 5) });
    }
  }

  togglePause() {
    if (this.gameOver) return;
    
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseEl.classList.add('active');
    } else {
      this.pauseEl.classList.remove('active');
    }
  }

  setupInputs() {
    document.addEventListener('keydown', (e) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        this.togglePause();
        return;
      }

      if (this.isPaused || this.gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (this.velocity.y === 1) break; // can't reverse directly
          this.velocity = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (this.velocity.y === -1) break;
          this.velocity = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (this.velocity.x === 1) break;
          this.velocity = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (this.velocity.x === -1) break;
          this.velocity = { x: 1, y: 0 };
          break;
      }
    });
  }

  setupButtons() {
    document.getElementById('new-game-btn').addEventListener('click', () => {
      // Give focus back to window so keyboard works
      window.focus();
      this.start();
    });
    
    document.getElementById('retry-btn').addEventListener('click', () => {
      window.focus();
      this.start();
    });
    
    document.getElementById('resume-btn').addEventListener('click', () => {
      window.focus();
      this.togglePause();
    });
  }

  setupTutorial() {
    const tutOverlay = document.getElementById('tutorial-overlay');
    const tutClose = document.getElementById('tutorial-close');
    const tutBtn = document.getElementById('tutorial-btn');
    const tutNext = document.getElementById('tut-next-btn');
    const tutPrev = document.getElementById('tut-prev-btn');
    
    let currentStep = 1;
    const totalSteps = 2;

    const updateTutState = () => {
      for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(`tut-step-${i}`).classList.toggle('active', i === currentStep);
        document.getElementById(`tut-dot-${i}`).classList.toggle('active', i === currentStep);
      }
      tutPrev.disabled = currentStep === 1;
      tutNext.textContent = currentStep === totalSteps ? 'Play' : 'Next';
    };

    tutBtn.addEventListener('click', () => {
      currentStep = 1;
      updateTutState();
      tutOverlay.classList.add('active');
      if (!this.isPaused && !this.gameOver) {
        this.togglePause(); // Auto pause game while tutorial is open
      }
    });

    tutClose.addEventListener('click', () => {
      tutOverlay.classList.remove('active');
      window.focus();
      if (this.isPaused && !this.gameOver) {
        this.togglePause();
      }
    });

    tutNext.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateTutState();
      } else {
        tutOverlay.classList.remove('active');
        window.focus();
        if (this.isPaused && !this.gameOver) {
          this.togglePause();
        }
      }
    });

    tutPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateTutState();
      }
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

// Ensure window has focus so keyboard events fire immediately
window.onload = () => {
  window.focus();
  new SnakeGame();
};
