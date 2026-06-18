import { usePaintStore } from '../store/usePaintStore';

export default function PaintStatusBar({ mousePos }) {
  const { zoomLevel, setZoomLevel, canvasDimensions } = usePaintStore();

  return (
    <div className="paint-statusbar">
      <div className="paint-statusbar-left">
        <span>
          {Math.round(mousePos.x)}, {Math.round(mousePos.y)} px
        </span>
        <div style={{ width: '1px', height: '16px', background: 'var(--color-border)' }} />
        <span>
          {canvasDimensions.width} × {canvasDimensions.height} px
        </span>
      </div>

      <div className="paint-statusbar-right">
        <span>{Math.round(zoomLevel * 100)}%</span>
        <input 
          type="range" 
          className="paint-zoom-slider"
          min="0.25" 
          max="8" 
          step="0.25"
          value={zoomLevel} 
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}
