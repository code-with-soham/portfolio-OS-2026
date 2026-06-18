import { useRef, useEffect, useState, useCallback } from 'react';
import { usePaintStore } from '../store/usePaintStore';

export default function PaintCanvas({ cursorPreviewRef }) {
  const containerRef = useRef(null);
  const interactionCanvasRef = useRef(null);
  const debugCanvasRef = useRef(null);
  
  // Keep refs to layer contexts outside of React state
  const layerContextsRef = useRef({});
  
  const { 
    tool, primaryColor, secondaryColor, brushSize, zoomLevel, canvasDimensions,
    layers, activeLayerId, opacity, setCanvasDimensions,
    floatingSelection, setFloatingSelection,
    recordTimeLapseEvent
  } = usePaintStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null); // Used for shapes

  // Initialize Layer Contexts when layers mount
  const setLayerCanvasRef = (id, canvasNode) => {
    if (canvasNode) {
      // Only set width/height if they actually changed to prevent clearing the canvas!
      if (canvasNode.width !== canvasDimensions.width || canvasNode.height !== canvasDimensions.height) {
        canvasNode.width = canvasDimensions.width;
        canvasNode.height = canvasDimensions.height;
        
        const ctx = canvasNode.getContext('2d', { willReadFrequently: true });
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // If this is the background layer and it's new, fill it white
        if (id === 'layer-1' && !layerContextsRef.current[id]) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasNode.width, canvasNode.height);
        }
      }
      
      // Ensure we always have the latest context reference
      layerContextsRef.current[id] = canvasNode.getContext('2d', { willReadFrequently: true });
    }
  };

  useEffect(() => {
    // Initialize Interaction Canvas
    if (interactionCanvasRef.current) {
      interactionCanvasRef.current.width = canvasDimensions.width;
      interactionCanvasRef.current.height = canvasDimensions.height;
      const ctx = interactionCanvasRef.current.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    // Initialize Debug Canvas
    if (debugCanvasRef.current) {
      debugCanvasRef.current.width = canvasDimensions.width;
      debugCanvasRef.current.height = canvasDimensions.height;
    }
  }, [canvasDimensions]);

  // --- Zoom Centering Logic ---
  // Apply zoom from center of container viewport instead of top-left
  // (We'll implement the scroll adjustment in a parent wrapper if needed, 
  // but CSS transform-origin center handles visual zooming well for now)

  const getCanvasPoint = (e) => {
    const canvas = interactionCanvasRef.current;
    if (!canvas) return { x: 0, y: 0, clientX: 0, clientY: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      clientX: e.clientX,
      clientY: e.clientY
    };
  };

  const getActiveCtx = () => {
    return layerContextsRef.current[activeLayerId];
  };

  const commitFloatingSelection = () => {
    // Stamp floating selection onto active layer
    if (!floatingSelection) return;
    const activeCtx = getActiveCtx();
    if (activeCtx) {
      activeCtx.putImageData(floatingSelection.imageData, floatingSelection.x, floatingSelection.y);
    }
    setFloatingSelection(null);
  };

  const handlePointerDown = (e) => {
    const pos = getCanvasPoint(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);

    // Record time-lapse start event
    recordTimeLapseEvent({
      type: 'down', tool, color: primaryColor, size: brushSize,
      x: pos.x, y: pos.y, opacity
    });
    
    // Commit floating selection if clicking outside it (Simplified for now, commit on any click)
    if (floatingSelection) {
      commitFloatingSelection();
      return; // Don't start drawing on the same click
    }

    const activeCtx = getActiveCtx();
    const interactCtx = interactionCanvasRef.current?.getContext('2d');
    if (!activeCtx || !interactCtx) return;

    const drawColor = e.button === 2 ? secondaryColor : primaryColor;
    
    // Setup contexts
    interactCtx.strokeStyle = drawColor;
    interactCtx.fillStyle = drawColor;
    interactCtx.lineWidth = brushSize;
    interactCtx.globalAlpha = opacity;

    activeCtx.strokeStyle = tool === 'eraser' ? '#ffffff' : drawColor;
    activeCtx.fillStyle = tool === 'eraser' ? '#ffffff' : drawColor;
    activeCtx.lineWidth = brushSize;
    activeCtx.globalAlpha = opacity;

    if (['line', 'rect', 'circle', 'triangle', 'diamond', 'pentagon', 'hexagon'].includes(tool)) {
      // For shapes, we draw on the interaction layer to show preview
      // No snapshot needed since interaction layer is cleared every frame!
    } else if (tool === 'brush' || tool === 'eraser') {
      // Draw directly on active layer
      activeCtx.beginPath();
      activeCtx.moveTo(pos.x, pos.y);
      activeCtx.lineTo(pos.x, pos.y);
      activeCtx.stroke();
    } else if (tool === 'fill') {
      activeCtx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
      // saveHistory();
    } else if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        activeCtx.font = `${brushSize * 4}px "Segoe UI Variable", Arial`;
        activeCtx.fillText(text, pos.x, pos.y);
      }
      setIsDrawing(false);
    }
  };

  const handlePointerMove = (e) => {
    const pos = getCanvasPoint(e);
    setCurrentPos(pos);
    
    // Update StatusBar Native DOM
    const coordsDisplay = document.getElementById('paint-coords-display');
    if (coordsDisplay) coordsDisplay.innerText = `${Math.round(pos.x)}, ${Math.round(pos.y)} px`;

    // Update Floating Cursor Preview Native DOM
    if (cursorPreviewRef.current) {
      cursorPreviewRef.current.style.display = 'block';
      cursorPreviewRef.current.style.left = `${pos.clientX}px`;
      cursorPreviewRef.current.style.top = `${pos.clientY}px`;
    }

    // Draw Debug Dot to prove 100% alignment
    if (debugCanvasRef.current) {
      const dbgCtx = debugCanvasRef.current.getContext('2d');
      dbgCtx.clearRect(0, 0, debugCanvasRef.current.width, debugCanvasRef.current.height);
      dbgCtx.fillStyle = 'red';
      dbgCtx.fillRect(pos.x - 2, pos.y - 2, 4, 4);
    }

    if (!isDrawing) return;

    recordTimeLapseEvent({
      type: 'move',
      x: pos.x, y: pos.y
    });

    const activeCtx = getActiveCtx();
    const interactCtx = interactionCanvasRef.current?.getContext('2d');
    if (!activeCtx || !interactCtx) return;

    if (tool === 'brush' || tool === 'eraser') {
      // Interpolate for smoother brush strokes natively
      activeCtx.lineTo(pos.x, pos.y);
      activeCtx.stroke();
    } else if (tool === 'crop') {
      interactCtx.clearRect(0, 0, interactionCanvasRef.current.width, interactionCanvasRef.current.height);
      interactCtx.setLineDash([5, 5]);
      interactCtx.strokeStyle = 'rgba(0, 120, 212, 1)';
      interactCtx.lineWidth = 1;
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;
      interactCtx.strokeRect(startPos.x, startPos.y, width, height);
      interactCtx.setLineDash([]);
    } else if (['line', 'rect', 'circle', 'triangle', 'diamond', 'pentagon', 'hexagon'].includes(tool)) {
      // Draw shape preview on interaction layer
      interactCtx.clearRect(0, 0, interactionCanvasRef.current.width, interactionCanvasRef.current.height);
      interactCtx.beginPath();
      
      const width = pos.x - startPos.x;
      const height = pos.y - startPos.y;

      if (tool === 'line') {
        interactCtx.moveTo(startPos.x, startPos.y);
        interactCtx.lineTo(pos.x, pos.y);
      } else if (tool === 'rect') {
        interactCtx.rect(startPos.x, startPos.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(width * width + height * height);
        interactCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      } else if (tool === 'triangle') {
        interactCtx.moveTo(startPos.x + width / 2, startPos.y);
        interactCtx.lineTo(startPos.x + width, startPos.y + height);
        interactCtx.lineTo(startPos.x, startPos.y + height);
        interactCtx.closePath();
      } else if (tool === 'diamond') {
        interactCtx.moveTo(startPos.x + width / 2, startPos.y);
        interactCtx.lineTo(startPos.x + width, startPos.y + height / 2);
        interactCtx.lineTo(startPos.x + width / 2, startPos.y + height);
        interactCtx.lineTo(startPos.x, startPos.y + height / 2);
        interactCtx.closePath();
      } else if (tool === 'pentagon' || tool === 'hexagon') {
        interactCtx.rect(startPos.x, startPos.y, width, height);
      }
      
      interactCtx.stroke();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    recordTimeLapseEvent({ type: 'up' });

    const activeCtx = getActiveCtx();
    const interactCtx = interactionCanvasRef.current?.getContext('2d');
    
    if (tool === 'brush' || tool === 'eraser') {
      activeCtx.closePath();
    } else if (tool === 'crop') {
      const width = Math.abs(currentPos.x - startPos.x);
      const height = Math.abs(currentPos.y - startPos.y);
      const cropX = Math.min(startPos.x, currentPos.x);
      const cropY = Math.min(startPos.y, currentPos.y);
      
      if (width > 5 && height > 5) {
        // Crop all layers
        layers.forEach(layer => {
          const layerCanvas = document.getElementById(`canvas-${layer.id}`);
          if (layerCanvas) {
            const ctx = layerCanvas.getContext('2d');
            const data = ctx.getImageData(cropX, cropY, width, height);
            layerCanvas.width = width;
            layerCanvas.height = height;
            ctx.putImageData(data, 0, 0);
          }
        });
        
        // Update interaction canvas too
        if (interactionCanvasRef.current) {
          interactionCanvasRef.current.width = width;
          interactionCanvasRef.current.height = height;
        }

        // Apply new dimensions globally
        setCanvasDimensions({ width, height });
      } else {
        // Just clear the interaction canvas if they didn't really crop anything
        interactCtx.clearRect(0, 0, interactionCanvasRef.current.width, interactionCanvasRef.current.height);
      }
    } else if (['line', 'rect', 'circle', 'triangle', 'diamond', 'pentagon', 'hexagon'].includes(tool)) {
      // Stamp interaction layer onto active layer
      activeCtx.drawImage(interactionCanvasRef.current, 0, 0);
      interactCtx.clearRect(0, 0, interactionCanvasRef.current.width, interactionCanvasRef.current.height);
    }
    
    // saveHistory();
  };

  return (
    <div 
      className={`paint-canvas-wrapper ${zoomLevel >= 4 ? 'show-grid' : ''}`} 
      style={{ 
        position: 'relative',
        backgroundSize: `${zoomLevel}px ${zoomLevel}px`
      }}
      ref={containerRef}
    >
      <div 
        className="paint-canvas-container"
        style={{
          width: canvasDimensions.width,
          height: canvasDimensions.height,
          transform: `scale(${zoomLevel})`,
        }}
      >
        {/* Layer Stack */}
        {/* We map in reverse so top layers render on top in the DOM via z-index natively */}
        {[...layers].reverse().map(layer => (
          <canvas
            key={layer.id}
            id={`canvas-${layer.id}`}
            ref={(node) => setLayerCanvasRef(layer.id, node)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: layer.opacity,
              display: layer.visible ? 'block' : 'none',
              pointerEvents: 'none', // They don't take events
              zIndex: layers.findIndex(l => l.id === layer.id)
            }}
          />
        ))}

        {/* Floating Selection Layer (Visual representation) */}
        {floatingSelection && (
          <canvas
            className="paint-floating-selection"
            width={floatingSelection.width}
            height={floatingSelection.height}
            style={{
              left: floatingSelection.x,
              top: floatingSelection.y,
              zIndex: 900
            }}
            ref={node => {
              if (node && floatingSelection.imageData) {
                node.getContext('2d').putImageData(floatingSelection.imageData, 0, 0);
              }
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.target.setPointerCapture(e.pointerId);
              const startX = e.clientX;
              const startY = e.clientY;
              const startLeft = floatingSelection.x;
              const startTop = floatingSelection.y;

              const onMove = (moveEvent) => {
                const zoom = zoomLevel; // Assuming uniform scale
                const dx = (moveEvent.clientX - startX) / zoom;
                const dy = (moveEvent.clientY - startY) / zoom;
                setFloatingSelection({
                  ...floatingSelection,
                  x: startLeft + dx,
                  y: startTop + dy
                });
              };

              const onUp = () => {
                e.target.releasePointerCapture(e.pointerId);
                e.target.removeEventListener('pointermove', onMove);
                e.target.removeEventListener('pointerup', onUp);
              };

              e.target.addEventListener('pointermove', onMove);
              e.target.addEventListener('pointerup', onUp);
            }}
          />
        )}

        {/* Interaction Layer (Catches events, renders active drawing preview) */}
        <canvas
          ref={interactionCanvasRef}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            zIndex: 999, // On top of everything
            cursor: 'none'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={(e) => {
            handlePointerUp();
            if (cursorPreviewRef.current) cursorPreviewRef.current.style.display = 'none';
          }}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Debug Overlay Canvas */}
        <canvas
          ref={debugCanvasRef}
          style={{ 
            position: 'absolute', top: 0, left: 0, 
            pointerEvents: 'none', zIndex: 1000 
          }}
        />
      </div>
    </div>
  );
}
