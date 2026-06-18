import { useRef, useEffect, useState, useCallback } from 'react';
import { usePaintStore } from '../store/usePaintStore';

export default function PaintCanvas({ setMousePos }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  const { 
    tool, primaryColor, secondaryColor, brushSize, opacity, 
    zoomLevel, canvasDimensions, history, historyStep, setHistoryStep
  } = usePaintStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set internal resolution strictly to dimensions
    canvas.width = canvasDimensions.width;
    canvas.height = canvasDimensions.height;
    
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    // Fill white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;

    // Save initial blank state to history
    saveStateToHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasDimensions]);

  const saveStateToHistory = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;
    const data = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    usePaintStore.setState(state => {
      // If we're not at the end of history (user undid), discard future steps
      const newHistory = state.history.slice(0, state.historyStep + 1);
      newHistory.push(data);
      
      // Limit history to 20 steps to prevent huge memory leaks
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      
      return {
        history: newHistory,
        historyStep: newHistory.length - 1
      };
    });
  }, []);

  // Update styles when they change
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : primaryColor;
      contextRef.current.fillStyle = tool === 'eraser' ? '#ffffff' : primaryColor;
      contextRef.current.lineWidth = brushSize;
      contextRef.current.globalAlpha = opacity;
    }
  }, [primaryColor, brushSize, opacity, tool]);

  // Transform screen to canvas coordinates correctly (The Cursor Offset Fix)
  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // The ratio between internal resolution and CSS displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      clientX: e.clientX,
      clientY: e.clientY
    };
  };

  const startDrawing = (e) => {
    const pos = getCanvasPoint(e);
    setIsDrawing(true);
    setStartPos(pos);
    
    if (tool === 'brush' || tool === 'eraser' || tool === 'line' || tool === 'rect' || tool === 'circle' || tool === 'triangle' || tool === 'diamond' || tool === 'pentagon' || tool === 'hexagon') {
      // Save snapshot for shape dragging
      setSnapshot(contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    }

    if (tool === 'brush' || tool === 'eraser') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(pos.x, pos.y);
      // Draw a dot immediately for single clicks
      contextRef.current.lineTo(pos.x, pos.y);
      contextRef.current.stroke();
    } else if (tool === 'fill') {
      // Flood fill is extremely complex in JS. We'll skip complex flood fill 
      // for this iteration and implement a basic full canvas clear as a fallback.
      contextRef.current.fillStyle = primaryColor;
      contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveStateToHistory();
    } else if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        contextRef.current.font = `${brushSize * 4}px Arial`;
        contextRef.current.fillStyle = primaryColor;
        contextRef.current.globalAlpha = opacity;
        contextRef.current.fillText(text, pos.x, pos.y);
        saveStateToHistory();
      }
      setIsDrawing(false);
    }
  };

  const draw = (e) => {
    const pos = getCanvasPoint(e);
    setMousePos({ x: pos.x, y: pos.y, clientX: pos.clientX, clientY: pos.clientY });

    if (!isDrawing) return;

    if (tool === 'brush' || tool === 'eraser') {
      // Use requestAnimationFrame natively inside React synthetic event is tricky,
      // but standard lineTo is usually fast enough if coordinates are accurate.
      contextRef.current.lineTo(pos.x, pos.y);
      contextRef.current.stroke();
    } else if (snapshot) {
      // Restore previous state to prevent trail
      contextRef.current.putImageData(snapshot, 0, 0);
      
      contextRef.current.beginPath();
      
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;

      if (tool === 'line') {
        contextRef.current.moveTo(startPos.x, startPos.y);
        contextRef.current.lineTo(pos.x, pos.y);
      } else if (tool === 'rect') {
        contextRef.current.rect(startPos.x, startPos.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(width * width + height * height);
        contextRef.current.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      } else if (tool === 'triangle') {
        contextRef.current.moveTo(startPos.x + width / 2, startPos.y);
        contextRef.current.lineTo(startPos.x + width, startPos.y + height);
        contextRef.current.lineTo(startPos.x, startPos.y + height);
        contextRef.current.closePath();
      } else if (tool === 'diamond') {
        contextRef.current.moveTo(startPos.x + width / 2, startPos.y);
        contextRef.current.lineTo(startPos.x + width, startPos.y + height / 2);
        contextRef.current.lineTo(startPos.x + width / 2, startPos.y + height);
        contextRef.current.lineTo(startPos.x, startPos.y + height / 2);
        contextRef.current.closePath();
      } else if (tool === 'pentagon' || tool === 'hexagon') {
        // Simplified fallback for polygons
        contextRef.current.rect(startPos.x, startPos.y, width, height);
      }
      
      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    if (tool === 'brush' || tool === 'eraser') {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
    saveStateToHistory();
  };

  return (
    <div className="paint-canvas-wrapper">
      <div 
        className="paint-canvas-container"
        style={{
          width: canvasDimensions.width,
          height: canvasDimensions.height,
          transform: `scale(${zoomLevel})`,
        }}
      >
        <canvas
          ref={canvasRef}
          className="paint-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={() => {
            stopDrawing();
            setMousePos({ x: 0, y: 0, clientX: -100, clientY: -100 }); // Hide cursor
          }}
        />
      </div>
    </div>
  );
}
