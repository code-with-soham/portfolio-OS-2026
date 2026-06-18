import { 
  PenRegular, 
  EraserRegular, 
  PaintBucketRegular, 
  TextFontRegular,
  ColorRegular,
  SearchRegular,
  LineRegular,
  SquareRegular,
  CircleRegular,
  TriangleRegular,
  DiamondRegular,
  PentagonRegular,
  HexagonRegular
} from '@fluentui/react-icons';
import { usePaintStore } from '../store/usePaintStore';

export default function PaintRibbon() {
  const { tool, setTool, primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor } = usePaintStore();

  const handleColorChange = (e, isPrimary) => {
    if (isPrimary) setPrimaryColor(e.target.value);
    else setSecondaryColor(e.target.value);
  };

  const tools = [
    { id: 'brush', icon: <PenRegular fontSize={18} />, label: 'Brush' },
    { id: 'eraser', icon: <EraserRegular fontSize={18} />, label: 'Eraser' },
    { id: 'fill', icon: <PaintBucketRegular fontSize={18} />, label: 'Fill' },
    { id: 'text', icon: <TextFontRegular fontSize={18} />, label: 'Text' },
    { id: 'picker', icon: <ColorRegular fontSize={18} />, label: 'Color Picker' },
    { id: 'magnifier', icon: <SearchRegular fontSize={18} />, label: 'Magnifier' },
  ];

  const shapes = [
    { id: 'line', icon: <LineRegular fontSize={18} /> },
    { id: 'rect', icon: <SquareRegular fontSize={18} /> },
    { id: 'circle', icon: <CircleRegular fontSize={18} /> },
    { id: 'triangle', icon: <TriangleRegular fontSize={18} /> },
    { id: 'diamond', icon: <DiamondRegular fontSize={18} /> },
    { id: 'pentagon', icon: <PentagonRegular fontSize={18} /> },
    { id: 'hexagon', icon: <HexagonRegular fontSize={18} /> },
  ];

  const palette = [
    '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
    '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'
  ];

  return (
    <div className="paint-ribbon">
      
      {/* Tools Group */}
      <div className="paint-ribbon-group">
        <div className="paint-ribbon-group-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {tools.map(t => (
            <button 
              key={t.id} 
              className={`paint-tool-btn ${tool === t.id ? 'active' : ''}`}
              onClick={() => setTool(t.id)}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>
        <span className="paint-ribbon-group-label">Tools</span>
      </div>

      <div className="paint-ribbon-separator" />

      {/* Shapes Group */}
      <div className="paint-ribbon-group">
        <div className="paint-ribbon-group-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
          {shapes.map(s => (
            <button 
              key={s.id} 
              className={`paint-tool-btn ${tool === s.id ? 'active' : ''}`}
              onClick={() => setTool(s.id)}
            >
              {s.icon}
            </button>
          ))}
        </div>
        <span className="paint-ribbon-group-label">Shapes</span>
      </div>

      <div className="paint-ribbon-separator" />

      {/* Colors Group */}
      <div className="paint-ribbon-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '16px' }}>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <input 
              type="color" 
              value={primaryColor} 
              onChange={(e) => handleColorChange(e, true)}
              style={{ width: '32px', height: '32px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            />
            <span className="paint-ribbon-group-label" style={{ fontSize: '10px' }}>Color 1</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <input 
              type="color" 
              value={secondaryColor} 
              onChange={(e) => handleColorChange(e, false)}
              style={{ width: '32px', height: '32px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            />
            <span className="paint-ribbon-group-label" style={{ fontSize: '10px' }}>Color 2</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
          {palette.map((color, i) => (
            <div 
              key={i}
              className="paint-color-swatch"
              style={{ backgroundColor: color }}
              onClick={() => setPrimaryColor(color)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSecondaryColor(color);
              }}
              title={color}
            />
          ))}
        </div>
        
      </div>

    </div>
  );
}
