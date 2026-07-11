/**
 * Chess Move Classification Logic
 * Assigns Brilliant, Great, Best, Excellent, Good, Inaccuracy, Mistake, or Blunder
 * based on evaluation swings (centipawn loss) and tactical opportunities.
 */

export const CLASSIFICATIONS = {
  BRILLIANT: { id: 'brilliant', icon: '⭐', label: 'Brilliant', color: '#00b0ff' },
  GREAT: { id: 'great', icon: '💙', label: 'Great Find', color: '#29b6f6' },
  BEST: { id: 'best', icon: '★', label: 'Best Move', color: '#8bc34a' },
  EXCELLENT: { id: 'excellent', icon: '👍', label: 'Excellent', color: '#4caf50' },
  GOOD: { id: 'good', icon: '✓', label: 'Good', color: '#81c784' },
  BOOK: { id: 'book', icon: '📖', label: 'Book Move', color: '#bcaaa4' },
  INACCURACY: { id: 'inaccuracy', icon: '⁈', label: 'Inaccuracy', color: '#ffeb3b' },
  MISTAKE: { id: 'mistake', icon: '?', label: 'Mistake', color: '#ff9800' },
  BLUNDER: { id: 'blunder', icon: '??', label: 'Blunder', color: '#f44336' },
  MISSED_WIN: { id: 'missed_win', icon: '⛔', label: 'Missed Win', color: '#e91e63' }
};

/**
 * Calculates classification based on the evaluation difference between the best move and the played move.
 * @param {number|string} evalBefore - Evaluation before the move (can be "M3")
 * @param {number|string} evalAfter - Evaluation after the move (from the perspective of the player who moved)
 * @param {boolean} isBookMove - If it's a known opening move
 */
export const classifyMove = (evalBefore, evalAfter, isBookMove = false) => {
  if (isBookMove) return CLASSIFICATIONS.BOOK;

  // Handle mate strings like "M3" or "-M2"
  const parseEval = (val) => {
    if (typeof val === 'string' && val.startsWith('M')) {
      const moves = parseInt(val.substring(1), 10);
      return val.startsWith('-') ? -99 + moves : 99 - moves;
    }
    return parseFloat(val) || 0;
  };

  const before = parseEval(evalBefore);
  const after = parseEval(evalAfter);
  
  // Loss is how much worse the evaluation got. (Negative loss means improvement, e.g. opponent blundered)
  const loss = before - after;

  if (loss <= 0.1) {
    return CLASSIFICATIONS.BEST;
  }
  if (loss <= 0.3) {
    return CLASSIFICATIONS.EXCELLENT;
  }
  if (loss <= 0.6) {
    return CLASSIFICATIONS.GOOD;
  }
  if (loss <= 1.2) {
    return CLASSIFICATIONS.INACCURACY;
  }
  if (loss <= 3.0) {
    return CLASSIFICATIONS.MISTAKE;
  }
  
  // If loss > 3.0, it's usually a blunder.
  // Unless we were already completely losing (e.g. -10 to -15 doesn't matter much)
  if (before < -5 && loss < 5) {
    return CLASSIFICATIONS.MISTAKE;
  }

  // Missed Win Check: If we had a mate or +5 advantage, and now we are 0 or losing
  if (before > 3 && after < 1) {
    return CLASSIFICATIONS.MISSED_WIN;
  }

  return CLASSIFICATIONS.BLUNDER;
};

export const calculateAccuracy = (moves) => {
  if (!moves || moves.length === 0) return 100;
  
  let totalLoss = 0;
  let moveCount = 0;

  moves.forEach(m => {
    if (m.classification?.id !== 'book') {
      totalLoss += Math.max(0, m.loss || 0);
      moveCount++;
    }
  });

  if (moveCount === 0) return 100;
  
  // Cap average loss. e.g., 2 pawns average loss = 0% accuracy
  const avgLoss = totalLoss / moveCount;
  let accuracy = 100 - (avgLoss * 30);
  
  return Math.max(0, Math.min(100, Math.round(accuracy)));
};
