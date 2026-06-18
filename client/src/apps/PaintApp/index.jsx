import { useRef, useEffect } from 'react';
import './PaintApp.css';
import PaintTitleBar from './components/PaintTitleBar';
import PaintRibbon from './components/PaintRibbon';
import PaintSidebar from './components/PaintSidebar';
import PaintCanvas from './components/PaintCanvas';
import PaintLayersPanel from './components/PaintLayersPanel';
import PaintStatusBar from './components/PaintStatusBar';
import { usePaintStore } from './store/usePaintStore';
import { useFileSystemStore } from '../../store/useFileSystemStore';

export default function PaintApp({ id, dragControls, onClose, onMinimize, onMaximize, isMaximized, filePath }) {
  const cursorPreviewRef = useRef(null);
  const { 
    brushSize, tool, primaryColor, zoomLevel, 
    activeLayerId, floatingSelection, setFloatingSelection,
    history, historyStep, setHistoryStep,
    setCanvasDimensions
  } = usePaintStore();
  const { getNode } = useFileSystemStore();

  useEffect(() => {
    if (filePath && filePath.length > 0) {
      const fileNode = getNode(filePath);
      if (fileNode && fileNode.content) {
        const img = new Image();
        img.src = fileNode.content;
        img.onload = () => {
          // Adjust canvas dimensions to fit image
          setCanvasDimensions({ width: img.width, height: img.height });
          
          // Small delay to allow canvas DOM elements to resize
          setTimeout(() => {
            const activeCanvas = document.getElementById(`canvas-${activeLayerId}`);
            if (activeCanvas) {
              const ctx = activeCanvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
            }
          }, 50);
        };
      }
    }
  }, [filePath, getNode, activeLayerId, setCanvasDimensions]);

  const cursorRadius = (brushSize / 2) * zoomLevel;
  const showPreview = tool === 'brush' || tool === 'eraser';

  useEffect(() => {
    const handleKeyDown = async (e) => {
      // Only process shortcuts if we are focused (ignoring for now, assuming window manager handles focus)
      
      if (e.ctrlKey && e.key === 'c') {
        // Simple full-canvas copy for now
        const activeCanvas = document.getElementById(`canvas-${activeLayerId}`);
        if (!activeCanvas) return;
        
        try {
          activeCanvas.toBlob(blob => {
            if (blob) {
              const item = new ClipboardItem({ "image/png": blob });
              navigator.clipboard.write([item]);
            }
          });
        } catch (err) {
          console.error("Clipboard copy failed", err);
        }
      }

      if (e.ctrlKey && e.key === 'v') {
        try {
          const items = await navigator.clipboard.read();
          for (const item of items) {
            if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
              const blob = await item.getType(item.types[0]);
              const img = new Image();
              img.src = URL.createObjectURL(blob);
              img.onload = () => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                const ctx = tempCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                setFloatingSelection({
                  imageData: ctx.getImageData(0, 0, img.width, img.height),
                  x: 0,
                  y: 0,
                  width: img.width,
                  height: img.height,
                  active: true
                });
              };
            }
          }
        } catch (err) {
          console.error("Clipboard paste failed", err);
        }
      }

      if (e.key === 'Delete') {
        const activeCanvas = document.getElementById(`canvas-${activeLayerId}`);
        if (activeCanvas) {
          const ctx = activeCanvas.getContext('2d');
          ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLayerId, setFloatingSelection]);

  return (
    <div className="paint-app">
      
      <PaintTitleBar 
        dragControls={dragControls}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        isMaximized={isMaximized}
        filePath={filePath}
      />
      
      <PaintRibbon />
      
      <div className="paint-main">
        <PaintSidebar />
        <PaintCanvas cursorPreviewRef={cursorPreviewRef} />
        <PaintLayersPanel />
      </div>
      
      <PaintStatusBar />

      {/* Floating Cursor Preview (Updated natively via ref for performance) */}
      <div 
        ref={cursorPreviewRef}
        className="paint-cursor-preview" 
        style={{
          display: 'none', // Initially hidden, updated by canvas
          width: cursorRadius * 2,
          height: cursorRadius * 2,
          border: tool === 'eraser' ? '1px solid black' : `1px solid ${primaryColor}`,
          background: tool === 'eraser' ? 'rgba(255,255,255,0.8)' : primaryColor,
          opacity: 0.5
        }}
      />
    </div>
  );
}
