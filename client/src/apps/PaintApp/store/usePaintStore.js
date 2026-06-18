import { create } from 'zustand';

export const usePaintStore = create((set, get) => ({
  tool: 'brush', // brush, eraser, fill, text, picker, magnifier, line, curve, rect, circle, etc.
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  brushSize: 5,
  opacity: 1,
  zoomLevel: 1, // 1 = 100%, 0.25 = 25%, 8 = 800%
  canvasDimensions: { width: 800, height: 600 },
  
  // History for Undo/Redo (stores ImageData objects)
  history: [],
  historyStep: -1,
  
  setTool: (tool) => set({ tool }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setOpacity: (opacity) => set({ opacity }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setCanvasDimensions: (dim) => set({ canvasDimensions: dim }),
  
  // Undo/Redo logic will be handled by the Canvas component directly for performance, 
  // but we store the step here to update UI buttons (enable/disable Undo buttons)
  setHistoryStep: (step, maxSteps) => set({ historyStep: step }),
}));
