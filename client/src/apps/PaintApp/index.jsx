import { useState } from 'react';
import './PaintApp.css';
import PaintTitleBar from './components/PaintTitleBar';
import PaintRibbon from './components/PaintRibbon';
import PaintSidebar from './components/PaintSidebar';
import PaintCanvas from './components/PaintCanvas';
import PaintStatusBar from './components/PaintStatusBar';
import { usePaintStore } from './store/usePaintStore';

export default function PaintApp({ id, dragControls, onClose, onMinimize, onMaximize, isMaximized }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, clientX: -100, clientY: -100 });
  const { brushSize, tool, primaryColor, zoomLevel } = usePaintStore();

  // Create cursor preview
  // Hide cursor preview if tool is not drawing tool or mouse is out
  const showPreview = mousePos.clientX >= 0 && (tool === 'brush' || tool === 'eraser');
  const cursorRadius = brushSize / 2 * zoomLevel;

  return (
    <div className="paint-app">
      
      {/* Title Bar containing standard Windows menus and Controls */}
      <PaintTitleBar 
        dragControls={dragControls}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        isMaximized={isMaximized}
      />
      
      {/* Top Ribbon (Tools, Shapes, Colors) */}
      <PaintRibbon />
      
      {/* Main Workspace (Sidebar + Canvas) */}
      <div className="paint-main">
        {/* Left Side Controls (Brush Size / Opacity) */}
        <PaintSidebar />
        
        {/* Infinite Workspace + Centered Canvas */}
        <PaintCanvas setMousePos={setMousePos} />
      </div>
      
      {/* Bottom Status Bar (Zoom Slider + Coords) */}
      <PaintStatusBar mousePos={mousePos} />

      {/* Floating Cursor Preview */}
      {showPreview && (
        <div 
          className="paint-cursor-preview" 
          style={{
            left: mousePos.clientX,
            top: mousePos.clientY,
            width: cursorRadius * 2,
            height: cursorRadius * 2,
            border: tool === 'eraser' ? '1px solid black' : `1px solid ${primaryColor}`,
            background: tool === 'eraser' ? 'rgba(255,255,255,0.8)' : primaryColor,
            opacity: 0.5
          }}
        />
      )}
    </div>
  );
}
