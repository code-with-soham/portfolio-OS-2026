import { EngineService } from './EngineService';
import { parseEvaluation } from './evaluationParser';
import { classifyMove } from './moveClassification';

/**
 * Orchestrates progressive analysis pipeline over a set of moves.
 */
class AnalysisManager {
  constructor() {
    this.engine = new EngineService('analysis-engine');
    this.queue = []; // array of { fen, moveIndex, san, playedMove }
    this.depths = [10, 14, 18];
    this.currentDepthIndex = 0;
    this.isAnalyzing = false;
    this.onProgress = null; // callback(progressPercent, moveData)
    this.onComplete = null;
    this.currentMoveEvaluation = null;
  }

  init() {
    this.engine.onMessage = (line) => {
      const parsed = parseEvaluation(line);
      if (Object.keys(parsed).length > 0) {
        // Keep the latest evaluation during analysis
        if (parsed.evaluation !== undefined || parsed.mate !== undefined) {
           this.currentMoveEvaluation = parsed;
        }

        if (parsed.isFinal) {
           this.processNextMove();
        }
      }
    };
    this.engine.init();
    this.engine.send('setoption name MultiPV value 1'); // Faster analysis for baseline
  }

  startAnalysis(history, onProgress, onComplete) {
    this.init();
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.isAnalyzing = true;
    this.currentDepthIndex = 0;

    // Build the queue from history.
    // history is an array of verbose move objects from chess.js
    // We need the FEN *before* the move was played to evaluate it.
    this.queue = history.map((move, idx) => ({
      fen: move.before,
      afterFen: move.after,
      moveIndex: idx,
      san: move.san,
      color: move.color,
      playedMove: move.lan || (move.from + move.to + (move.promotion || ''))
    }));

    this.analyzeCurrentDepth();
  }

  analyzeCurrentDepth() {
    if (this.currentDepthIndex >= this.depths.length) {
      this.isAnalyzing = false;
      if (this.onComplete) this.onComplete();
      return;
    }

    this.currentQueue = [...this.queue];
    this.processNextMove();
  }

  processNextMove() {
    if (!this.isAnalyzing) return;

    // If we just finished evaluating a move
    if (this.currentMove && this.currentMoveEvaluation) {
      const targetDepth = this.depths[this.currentDepthIndex];
      const result = {
        ...this.currentMove,
        depth: targetDepth,
        evaluation: this.currentMoveEvaluation.evaluation,
        mate: this.currentMoveEvaluation.mate,
        bestMove: this.currentMoveEvaluation.bestMove,
        pv: this.currentMoveEvaluation.pv,
      };

      // Notify progress
      const totalPasses = this.depths.length;
      const currentPass = this.currentDepthIndex;
      const totalMoves = this.queue.length;
      const movesDone = totalMoves - this.currentQueue.length;
      const percent = Math.round(((currentPass * totalMoves + movesDone) / (totalPasses * totalMoves)) * 100);

      if (this.onProgress) {
        this.onProgress(percent, result, `Depth ${targetDepth} - Move ${result.moveIndex + 1} / ${totalMoves}`);
      }
    }

    if (this.currentQueue.length === 0) {
      // Finished this depth pass
      this.currentDepthIndex++;
      this.analyzeCurrentDepth();
      return;
    }

    // Get next move to evaluate
    this.currentMove = this.currentQueue.shift();
    this.currentMoveEvaluation = null;

    const targetDepth = this.depths[this.currentDepthIndex];
    // We evaluate the position AFTER the move was played.
    // The evaluation returned will be from the perspective of the player who is next to move (the opponent).
    this.engine.evaluatePosition(this.currentMove.afterFen, targetDepth);
  }

  stopAnalysis() {
    this.isAnalyzing = false;
    this.engine.stop();
  }
}

export const analysisManager = new AnalysisManager();
