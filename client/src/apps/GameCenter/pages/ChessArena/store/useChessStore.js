import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chess } from 'chess.js';
import { playSound } from '../../../../../services/audio/SoundManager';
import { engineService } from '../ai/EngineService';
import { parseEvaluation } from '../ai/evaluationParser';
import { ENGINE_PERSONALITIES } from '../ai/engineSettings';
import { analysisManager } from '../ai/AnalysisManager';
import { classifyMove, calculateAccuracy } from '../ai/moveClassification';

/**
 * Zustand store for Chess Arena Pro
 * Separates strict Game State from UI/Settings State and AI State.
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
        // 3. AI State (Persisted)
        // ==========================
        ai: {
          enabled: true,
          side: 'b', // AI plays black
          personality: 'casual', // maps to ENGINE_PERSONALITIES
          evaluation: 0,
          mate: null,
          depth: 0,
          nodes: 0,
          nps: 0,
          pv: [], // Array of principal variations (strings)
          multiPvList: [], // Array of { move, eval, pv }
          thinking: false,
          engineStatus: 'Initializing...', // Initializing... | Ready | Thinking... | Move Selected
          bestMove: null,
          mate: null,
          analysisMode: false,
        },
        
        // ==========================
        // 4. Analysis State
        // ==========================
        analysis: {
          isAnalyzing: false,
          progress: 0,
          statusText: '',
          moves: [], // Rich move data
          currentMoveIndex: -1, // The move currently being reviewed (-1 means latest)
          accuracy: { w: 0, b: 0 },
          tallies: {
             w: { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 },
             b: { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 }
          }
        },

        // ==========================
        // 5. Transient UI State (Not Persisted)
        // ==========================
        ui: {
          selectedSquare: null,
          legalMoves: [],
          lastMove: null, // { from, to }
          isSaving: false,
          promotionSquare: null,
          promotionSource: null,
          showResultOverlay: false,
          showTutorial: false,
          errorMessage: null,
        },

        // ==========================
        // Engine Communication
        // ==========================
        initEngine: () => {
          engineService.onMessage = (line) => {
            const parsed = parseEvaluation(line);
            
            if (line === 'uciok') {
              set(state => ({ ai: { ...state.ai, engineStatus: 'Ready' } }));
            }
            
            // Only update AI state if we got meaningful data to avoid massive re-renders
            if (Object.keys(parsed).length > 0) {
              set(state => {
                const newAi = { ...state.ai, ...parsed };
                
                // Handle MultiPV array
                if (parsed.multipv && parsed.pv) {
                   const index = parsed.multipv - 1;
                   const updatedList = [...(state.ai.multiPvList || [])];
                   updatedList[index] = {
                     move: parsed.bestMove,
                     eval: parsed.mate ? `M${parsed.mate}` : parsed.evaluation?.toFixed(2),
                     pv: parsed.pv,
                   };
                   newAi.multiPvList = updatedList;
                   // Default pv is the primary line
                   if (parsed.multipv === 1) {
                     newAi.pv = parsed.pv;
                   }
                }

                if (parsed.isFinal) {
                  newAi.thinking = false;
                  newAi.engineStatus = 'Move Selected';
                }
                return { ai: newAi };
              });

              // If it's a final move and AI is enabled and it's AI's turn (not in analysis mode)
              if (parsed.isFinal && get().ai.enabled && !get().ai.analysisMode && get().game.turn === get().ai.side) {
                // Apply AI move
                const moveStr = parsed.bestMove; // e.g. e2e4 or e7e8q
                if (moveStr) {
                  const from = moveStr.substring(0, 2);
                  const to = moveStr.substring(2, 4);
                  const promotion = moveStr.length > 4 ? moveStr.charAt(4) : undefined;
                  
                  // Slight delay for human feel
                  const personality = ENGINE_PERSONALITIES[get().ai.personality];
                  setTimeout(() => {
                    get().makeMove({ from, to, promotion }, true);
                  }, 100); 
                }
              }
            }
          };
          engineService.init();
        },

        triggerEngine: () => {
          const { game, ai } = get();
          if (game.status !== 'active') return;

          const personality = ENGINE_PERSONALITIES[ai.personality];
          engineService.setSkillLevel(personality.skillLevel);
          engineService.send('ucinewgame');
          
          set({ ai: { ...ai, thinking: true, engineStatus: 'Thinking...', evaluation: null, mate: null, depth: 0, nodes: 0, pv: '', bestMove: null } });
          
          // Use moveTime or depth depending on personality
          engineService.send('stop');
          engineService.send(`position fen ${game.fen}`);
          engineService.send(`go movetime ${personality.moveTime} depth ${personality.depth}`);
        },

        // ==========================
        // Analysis Actions
        // ==========================
        startAnalysis: () => {
          const { game } = get();
          
          set({
            ai: { ...get().ai, analysisMode: true },
            analysis: {
              isAnalyzing: true,
              progress: 0,
              statusText: 'Preparing Position...',
              moves: [],
              accuracy: { w: 0, b: 0 },
              tallies: {
                w: { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 },
                b: { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 }
              }
            },
            ui: { ...get().ui, showResultOverlay: false }
          });

          // Build verbose history for analysis manager
          const chessInstance = new Chess(get().game.fen);
          // If we want to analyze the whole game, we need the full history from starting position
          const fullChess = new Chess();
          const history = fullChess.history({ verbose: true }); // Wait, game.history is already strings
          // We need verbose history objects
          const fullHistory = [];
          
          const tempChess = new Chess();
          for (let moveStr of game.history) {
             const m = tempChess.move(moveStr);
             fullHistory.push(m);
          }

          let previousEval = 0.2; // roughly starting pos advantage

          analysisManager.startAnalysis(fullHistory, 
            (progressPercent, moveData, statusText) => {
              // Calculate loss and classification
              // The evaluation is from the perspective of the player who is NEXT to move (the opponent).
              // So the evaluation for the player who just moved is -(moveData.evaluation)
              const evalAfter = moveData.mate ? (moveData.mate > 0 ? -99 : 99) : (moveData.evaluation ? -moveData.evaluation : 0);
              
              const isBookMove = moveData.moveIndex < 10; // simplistic opening book for now
              
              const classification = classifyMove(previousEval, evalAfter, isBookMove);
              
              const enrichedMove = {
                ...moveData,
                evaluation: evalAfter,
                loss: previousEval - evalAfter,
                classification
              };

              // Update previousEval for the next move in sequence
              // Actually, wait, since we analyze progressively, the moves might come in randomly? 
              // No, they are evaluated sequentially from start to finish.
              previousEval = -evalAfter; // The evaluation from the opponent's perspective becomes the 'before' eval for the next move

              set(state => {
                const moves = [...state.analysis.moves];
                
                // Keep the array length consistent with history
                if (!moves[moveData.moveIndex]) moves[moveData.moveIndex] = {};
                moves[moveData.moveIndex] = { ...moves[moveData.moveIndex], ...enrichedMove };

                // Recalculate tallies
                const tallies = {
                  w: { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 },
                  b: { brilliant: 0, great: 0, best: 0, excellent: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 }
                };
                
                moves.forEach(m => {
                  if (m && m.classification) {
                     tallies[m.color][m.classification.id]++;
                  }
                });

                // Calculate Accuracy
                const whiteMoves = moves.filter(m => m && m.color === 'w');
                const blackMoves = moves.filter(m => m && m.color === 'b');

                const accW = calculateAccuracy(whiteMoves);
                const accB = calculateAccuracy(blackMoves);

                return {
                  analysis: {
                    ...state.analysis,
                    progress: progressPercent,
                    statusText: statusText,
                    moves: moves,
                    tallies,
                    accuracy: { w: accW, b: accB }
                  }
                };
              });
            },
            () => {
              // On Complete
              set(state => ({
                 analysis: {
                   ...state.analysis,
                   isAnalyzing: false,
                   progress: 100,
                   statusText: 'Analysis Complete'
                 }
              }));
            }
          );
        },

        stopAnalysis: () => {
          analysisManager.stopAnalysis();
          set(state => ({
             ai: { ...state.ai, analysisMode: false },
             analysis: { ...state.analysis, isAnalyzing: false, currentMoveIndex: -1 }
          }));
        },

        jumpToMove: (index) => {
          set(state => ({
            analysis: { ...state.analysis, currentMoveIndex: index }
          }));
        },

        // ==========================
        // Game Actions
        // ==========================
        makeMove: (move, isEngineMove = false) => {
          const { game, settings, ai } = get();
          const chessInstance = new Chess(game.fen);
          
          // Prevent human moving for AI
          if (!isEngineMove && ai.enabled && game.turn === ai.side) {
            return false;
          }

          try {
            const result = chessInstance.move(move);
            if (result) {
              // Sounds
              try {
                if (settings.soundEnabled) {
                  if (chessInstance.isCheckmate()) playSound('chess.gameover');
                  else if (chessInstance.inCheck()) playSound('chess.check');
                  else if (result.captured) playSound('chess.capture');
                  else if (result.flags.includes('k') || result.flags.includes('q')) playSound('chess.castle');
                  else if (result.promotion) playSound('chess.promotion');
                  else playSound('chess.move');
                }
              } catch (audioError) {
                console.warn('Audio failed:', audioError);
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
                  legalMoves: [],
                  showResultOverlay: status !== 'active'
                }
              });

              // Trigger AI if it's AI's turn
              if (status === 'active' && ai.enabled && chessInstance.turn() === ai.side) {
                get().triggerEngine();
              }

              return true;
            }
          } catch (e) {
            console.error('makeMove failed:', e, move);
            get().setErrorMessage(`Move failed: ${e.message || String(e)}`);
            return false;
          }
          return false;
        },

        undoMove: () => {
          const { game, ai } = get();
          const chessInstance = new Chess(game.fen);
          chessInstance.undo();
          
          // If playing AI, undo two moves (human and AI)
          if (ai.enabled && game.turn === ai.side) {
             chessInstance.undo();
          }

          engineService.stop();

          set({
            game: {
              ...game,
              fen: chessInstance.fen(),
              history: chessInstance.history({ verbose: true }),
              turn: chessInstance.turn(),
              isCheck: chessInstance.inCheck(),
              status: 'active'
            },
            ui: {
              ...get().ui,
              lastMove: null,
              selectedSquare: null,
              legalMoves: [],
              showResultOverlay: false
            },
            ai: {
              ...get().ai,
              thinking: false
            }
          });
          playSound('ui.click');
        },

        resetGame: () => {
          const newGame = new Chess();
          engineService.stop();

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
              legalMoves: [],
              showResultOverlay: false
            },
            ai: {
              ...get().ai,
              thinking: false
            }
          });
          playSound('chess.gameover');
          
          // If AI is white, trigger it immediately
          if (get().ai.enabled && get().ai.side === 'w') {
            get().triggerEngine();
          }
        },

        // UI & Settings Actions
        setSelectedSquare: (square) => {
          if (!get().settings.showLegalMoves) return;
          const { game, ai } = get();
          
          // Don't show moves if it's AI's turn
          if (ai.enabled && game.turn === ai.side) return;

          const chessInstance = new Chess(game.fen);
          const moves = chessInstance.moves({ square, verbose: true }).map(m => m.to);
          set({ ui: { ...get().ui, selectedSquare: square, legalMoves: moves } });
        },
        clearSelection: () => set({ ui: { ...get().ui, selectedSquare: null, legalMoves: [] } }),
        
        updateSettings: (newSettings) => set({ 
          settings: { ...get().settings, ...newSettings } 
        }),

        updateAI: (newAiSettings) => set({
          ai: { ...get().ai, ...newAiSettings }
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

        closeOverlay: () => set({ ui: { ...get().ui, showResultOverlay: false, showTutorial: false, errorMessage: null } }),
        openTutorial: () => set({ ui: { ...get().ui, showTutorial: true } }),
        setErrorMessage: (msg) => set({ ui: { ...get().ui, errorMessage: msg } }),
      };
    },
    {
      name: 'chess-arena-storage',
      partialize: (state) => ({
        game: state.game,
        settings: state.settings,
        ai: {
          enabled: state.ai.enabled,
          side: state.ai.side,
          personality: state.ai.personality,
          analysisMode: state.ai.analysisMode
        }
      })
    }
  )
);
