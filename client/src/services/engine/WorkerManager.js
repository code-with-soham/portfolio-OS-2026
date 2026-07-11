/**
 * WorkerManager
 * Global registry for web workers in the OS to ensure they are cleaned up
 * and properly tracked to avoid memory leaks.
 */

class WorkerManager {
  constructor() {
    this.workers = new Map();
  }

  createWorker(id, scriptUrl) {
    if (this.workers.has(id)) {
      this.terminateWorker(id);
    }
    const worker = new Worker(scriptUrl);
    this.workers.set(id, worker);
    return worker;
  }

  getWorker(id) {
    return this.workers.get(id);
  }

  terminateWorker(id) {
    const worker = this.workers.get(id);
    if (worker) {
      worker.terminate();
      this.workers.delete(id);
    }
  }

  terminateAll() {
    this.workers.forEach(worker => worker.terminate());
    this.workers.clear();
  }
}

export const workerManager = new WorkerManager();
