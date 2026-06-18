import { usePaintStore } from '../store/usePaintStore';

export default function PaintSidebar() {
  const { brushSize, setBrushSize, opacity, setOpacity } = usePaintStore();

  return (
    <div className="paint-sidebar">
      
      <div className="paint-sidebar-slider-container">
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Size</span>
        <input 
          type="range" 
          className="paint-vertical-slider"
          min="1" 
          max="50" 
          value={brushSize} 
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          style={{ appearance: 'slider-vertical', width: '8px', height: '100px' }}
        />
        <span style={{ fontSize: '10px' }}>{brushSize}px</span>
      </div>

      <div className="paint-sidebar-slider-container">
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Opacity</span>
        <input 
          type="range" 
          className="paint-vertical-slider"
          min="0.1" 
          max="1" 
          step="0.1"
          value={opacity} 
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          style={{ appearance: 'slider-vertical', width: '8px', height: '100px' }}
        />
        <span style={{ fontSize: '10px' }}>{Math.round(opacity * 100)}%</span>
      </div>

    </div>
  );
}
