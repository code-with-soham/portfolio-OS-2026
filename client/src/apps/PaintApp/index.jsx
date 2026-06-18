import { useState, useRef, useEffect } from 'react';
import { 
  PenRegular, 
  EraserRegular, 
  CircleRegular, 
  SquareRegular, 
  TextFontRegular, 
  SaveRegular 
} from '@fluentui/react-icons';

export default function PaintApp() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush'); // brush, eraser, rect, circle, text
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set internal resolution higher or equal to display size to avoid blur
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    // Fill white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth, tool]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setStartPos({ x: offsetX, y: offsetY });
    
    if (tool === 'brush' || tool === 'eraser') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
    } else if (tool === 'rect' || tool === 'circle') {
      setSnapshot(contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    } else if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        contextRef.current.font = `${lineWidth * 4}px Arial`;
        contextRef.current.fillStyle = color;
        contextRef.current.fillText(text, offsetX, offsetY);
      }
      setIsDrawing(false);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === 'brush' || tool === 'eraser') {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (tool === 'rect' || tool === 'circle') {
      // Restore previous state to prevent trail
      contextRef.current.putImageData(snapshot, 0, 0);
      
      contextRef.current.beginPath();
      if (tool === 'rect') {
        const width = offsetX - startPos.x;
        const height = offsetY - startPos.y;
        contextRef.current.rect(startPos.x, startPos.y, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2));
        contextRef.current.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
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
  };

  const saveCanvas = () => {
    const dataURL = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `paint_export_${Date.now()}.png`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)' }}>
      {/* Toolbar */}
      <div style={{ height: '60px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px', background: 'var(--color-bg-surface)' }}>
        
        <div style={{ display: 'flex', gap: '4px', borderRight: '1px solid var(--color-border)', paddingRight: '16px' }}>
          {[
            { id: 'brush', icon: <PenRegular /> },
            { id: 'eraser', icon: <EraserRegular /> },
            { id: 'rect', icon: <RectangleRegular /> },
            { id: 'circle', icon: <CircleRegular /> },
            { id: 'text', icon: <TextFontRegular /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              style={{
                width: '36px', height: '36px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: tool === t.id ? 'var(--color-accent)' : 'transparent',
                color: tool === t.id ? '#fff' : 'var(--color-text-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid var(--color-border)', paddingRight: '16px' }}>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: '32px', height: '32px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }} />
          <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} style={{ width: '100px' }} />
        </div>

        <button onClick={saveCanvas} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-accent)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}>
          <SaveRegular /> Save
        </button>

      </div>

      {/* Canvas */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-base)' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            cursor: tool === 'text' ? 'text' : 'crosshair'
          }}
        />
      </div>
    </div>
  );
}
