/**
 * Parses raw UCI output from Stockfish into a structured JSON object
 */

export const parseEvaluation = (line) => {
  const result = {};

  if (line.startsWith('info ')) {
    const tokens = line.split(' ');
    
    // Depth
    const depthIndex = tokens.indexOf('depth');
    if (depthIndex !== -1) result.depth = parseInt(tokens[depthIndex + 1], 10);

    // Nodes
    const nodesIndex = tokens.indexOf('nodes');
    if (nodesIndex !== -1) result.nodes = parseInt(tokens[nodesIndex + 1], 10);

    // Speed (NPS)
    const npsIndex = tokens.indexOf('nps');
    if (npsIndex !== -1) result.nps = parseInt(tokens[npsIndex + 1], 10);

    // MultiPV index
    const multipvIndex = tokens.indexOf('multipv');
    if (multipvIndex !== -1) {
      result.multipv = parseInt(tokens[multipvIndex + 1], 10);
    } else {
      result.multipv = 1; // Default to 1
    }

    // Score
    const scoreIndex = tokens.indexOf('score');
    if (scoreIndex !== -1) {
      const type = tokens[scoreIndex + 1]; // cp or mate
      const val = parseInt(tokens[scoreIndex + 2], 10);
      
      if (type === 'cp') {
        result.evaluation = val / 100.0;
        result.mate = null;
      } else if (type === 'mate') {
        result.evaluation = val > 0 ? 99.9 : -99.9;
        result.mate = val;
      }
    }

    // PV (Principal Variation) / Best Move
    const pvIndex = tokens.indexOf('pv');
    if (pvIndex !== -1 && tokens.length > pvIndex + 1) {
      result.bestMove = tokens[pvIndex + 1];
      result.pv = tokens.slice(pvIndex + 1).join(' ');
    }
  } else if (line.startsWith('bestmove ')) {
    const tokens = line.split(' ');
    result.bestMove = tokens[1];
    result.isFinal = true; // Indicates the engine finished searching
  }

  return result;
};

