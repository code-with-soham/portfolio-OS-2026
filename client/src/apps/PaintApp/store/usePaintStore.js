import { create } from 'zustand';

export const usePaintStore = create((set, get) => ({
  tool: 'brush', // brush, eraser, fill, text, picker, magnifier, line, curve, rect, circle, etc.
  primaryColor: '#000000',
  secondaryColor: '#ffffff',
  brushSize: 5,
  opacity: 1,
  zoomLevel: 1, // 1 = 100%, 0.25 = 25%, 8 = 800%
  canvasDimensions: { width: 800, height: 600 },
  
  // Layer System
  layers: [
    { id: 'layer-1', name: 'Background', visible: true, opacity: 1, isLocked: false }
  ],
  activeLayerId: 'layer-1',

  // Floating Selection (for paste and shapes)
  floatingSelection: null, 
  // { imageData, x, y, width, height, active }

  // History for Undo/Redo
  history: [],
  historyStep: -1,
  
  // Time-Lapse System
  timeLapseEvents: [],
  isReplaying: false,

  setTool: (tool) => set({ tool }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setOpacity: (opacity) => set({ opacity }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setCanvasDimensions: (dim) => set({ canvasDimensions: dim }),
  
  setLayers: (layers) => set({ layers }),
  setActiveLayerId: (id) => set({ activeLayerId: id }),
  setFloatingSelection: (sel) => set({ floatingSelection: sel }),
  
  setHistoryStep: (step) => set({ historyStep: step }),

  recordTimeLapseEvent: (event) => set((state) => {
    if (state.isReplaying) return state; // Don't record during replay
    return { timeLapseEvents: [...state.timeLapseEvents, event] };
  }),
  setIsReplaying: (val) => set({ isReplaying: val }),
  clearTimeLapse: () => set({ timeLapseEvents: [] })
}));
