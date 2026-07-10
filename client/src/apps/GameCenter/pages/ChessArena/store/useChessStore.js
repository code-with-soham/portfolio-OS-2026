import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';
import { playSound } from '../../../../../../services/audio/SoundManager';

/**
 * Zustand store for Chess Arena Pro
 * Separates strict Game State from UI/Settings State.
 */
export const useChessStore = create(
  persist(
    (set, get) => {
      const initialChess = new Chess();
      return {
        // ==========================
        // 1. Core Game State (Persisted)
        // ==========================
        game: {
          fen: initialChess.fen(),
          history: [], // array of move objects
          capturedPieces: { w: [], b: [] },
          turn: 'w',
          status: 'active', // 'active', 'checkmate', 'draw', 'stalemate'
          isCheck: false,
        },
        
        // ==========================
        // 2. Settings & Themes (Persisted)
        // ==========================
        settings: {
          orientation: 'white', // 'white' | 'black'
          boardTheme: 'dark', // 'dark', 'wood', 'glass', 'minimal'
          pieceTheme: 'classic', // 'classic', 'minimal'
          showCoordinates: true,
          showLegalMoves: true,
          soundEnabled: true,
          animationSpeed: 200,
        },
        
        // ==========================
        // 3. Transient UI State (Not Persisted)
        // ==========================
        ui: {
          selectedSquare: null,
          legalMoves: [],
          lastMove: null, // { from, to }
          isSaving: false,
          isThinking: false, // For future AI
        },

        // ==========================
        // Actions
        // ==========================
        makeMove: (move) => {
          const { game, settings } = get();
          const chessInstance = new Chess(game.fen);
          try {
            const result = chessInstance.move(move);
            if (result) {
              // Sounds
              if (settings.soundEnabled) {
                if (chessInstance.isCheckmate()) playSound('chess.gameover');
                else if (chessInstance.inCheck()) playSound('chess.check');
                else if (result.captured) playSound('chess.capture');
                else if (result.flags.includes('k') || result.flags.includes('q')) playSound('chess.castle');
                else if (result.promotion) playSound('chess.promotion');
                else playSound('chess.move');
              }

              // Calculate captured pieces
              let captured = { ...game.capturedPieces };
              if (result.captured) {
                const color = result.color === 'w' ? 'b' : 'w';
                captured[color] = [...captured[color], result.captured];
              }

              let status = 'active';
              if (chessInstance.isCheckmate()) status = 'checkmate';
              else if (chessInstance.isDraw() || chessInstance.isStalemate() || chessInstance.isThreefoldRepetition()) status = 'draw';

              // Show saving animation
              set({ ui: { ...get().ui, isSaving: true } });
              setTimeout(() => set({ ui: { ...get().ui, isSaving: false } }), 1000);

              set({
                game: {
                  fen: chessInstance.fen(),
                  history: chessInstance.history({ verbose: true }),
                  turn: chessInstance.turn(),
                  status: status,
                  isCheck: chessInstance.inCheck(),
                  capturedPieces: captured,
                },
                ui: {
                  ...get().ui,
                  lastMove: { from: result.from, to: result.to },
                  selectedSquare: null,
                  legalMoves: []
                }
              });
              return true;
            }
          } catch (e) {
            return false;
          }
          return false;
        },

        undoMove: () => {
          const { game } = get();
          const chessInstance = new Chess(game.fen);
          chessInstance.undo();
          
          set({
            game: {
              ...game,
              fen: chessInstance.fen(),
              history: chessInstance.history({ verbose: true }),
              turn: chessInstance.turn(),
              isCheck: chessInstance.inCheck(),
            },
            ui: {
              ...get().ui,
              lastMove: null,
              selectedSquare: null,
              legalMoves: []
            }
          });
          playSound('ui.click');
        },

        resetGame: () => {
          const newGame = new Chess();
          set({
            game: {
              fen: newGame.fen(),
              history: [],
              capturedPieces: { w: [], b: [] },
              turn: 'w',
              status: 'active',
              isCheck: false,
            },
            ui: {
              ...get().ui,
              lastMove: null,
              selectedSquare: null,
              legalMoves: []
            }
          });
          playSound('chess.gameover');
        },

        // UI & Settings Actions
        setSelectedSquare: (square) => {
          if (!get().settings.showLegalMoves) return;
          const { game } = get();
          const chessInstance = new Chess(game.fen);
          const moves = chessInstance.moves({ square, verbose: true }).map(m => m.to);
          set({ ui: { ...get().ui, selectedSquare: square, legalMoves: moves } });
        },
        clearSelection: () => set({ ui: { ...get().ui, selectedSquare: null, legalMoves: [] } }),
        
        updateSettings: (newSettings) => set({ 
          settings: { ...get().settings, ...newSettings } 
        }),
        
        toggleOrientation: () => {
          set(state => ({ 
            settings: { 
              ...state.settings, 
              orientation: state.settings.orientation === 'white' ? 'black' : 'white' 
            } 
          }));
          playSound('ui.click');
        },
      };
    },
    {
      name: 'chess-arena-storage',
      partialize: (state) => ({
        game: state.game,
        settings: state.settings
      })
    }
  )
);
