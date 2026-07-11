import { workerManager } from '../../../../../services/engine/WorkerManager';

export class EngineService {
  constructor(workerId = 'chess-engine') {
    this.workerId = workerId;
    this.worker = null;
    this.onMessage = null;
    this.isReady = false;
  }

  init() {
    if (this.worker) return;

    const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    const scriptUrl = wasmSupported ? '/stockfish/stockfish.wasm.js' : '/stockfish/stockfish.js';
    
    this.worker = workerManager.createWorker(this.workerId, scriptUrl);
    
    this.worker.onmessage = (event) => {
      const line = event.data;
      if (line === 'uciok') {
        this.isReady = true;
        this.send('setoption name MultiPV value 3'); // Enable MultiPV
      }
      if (this.onMessage) {
        this.onMessage(line);
      }
    };

    // Initialize UCI protocol
    this.send('uci');
  }

  send(command) {
    if (this.worker) {
      this.worker.postMessage(command);
    }
  }

  stop() {
    this.send('stop');
  }

  quit() {
    this.send('quit');
    workerManager.terminateWorker(this.workerId);
    this.worker = null;
  }

  setSkillLevel(level) {
    // level: 0 to 20
    this.send(`setoption name Skill Level value ${level}`);
  }

  evaluatePosition(fen, depth = 15) {
    this.send('stop');
    this.send(`position fen ${fen}`);
    this.send(`go depth ${depth}`);
  }
}

export const engineService = new EngineService();
