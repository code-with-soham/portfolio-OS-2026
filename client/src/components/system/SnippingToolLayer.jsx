import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { CameraRegular } from '@fluentui/react-icons';
import { useDesktopStore } from '../../store/useDesktopStore';

export default function SnippingToolLayer() {
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const addNotification = useDesktopStore(s => s.addNotification);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Win + Shift + S (we use Meta for Win)
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsActive(true);
      }
      
      // Escape to cancel
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  const handlePointerDown = (e) => {
    if (!isActive) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!isActive || !isDragging) return;
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = async () => {
    if (!isActive || !isDragging) return;
    setIsDragging(false);
    setIsActive(false);

    // Calculate bounding box
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    if (width < 10 || height < 10) return; // Ignore tiny snips

    // Wait a brief moment for the overlay to disappear before capturing
    await new Promise(res => setTimeout(res, 100));

    try {
      const canvas = await html2canvas(document.body, {
        x, y, width, height,
        useCORS: true,
        backgroundColor: null
      });

      const dataUrl = canvas.toDataURL('image/png');
      
      // Trigger download
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
      a.click();

      // Notify
      addNotification('Snipping Tool', 'Screenshot saved to your downloads folder!', <CameraRegular />, 'info');

    } catch (err) {
      console.error('Failed to capture screen:', err);
      addNotification('Snipping Tool', 'Failed to capture screen.', <CameraRegular />, 'error');
    }
  };

  if (!isActive) return null;

  // Calculate coordinates for the selection box
  const boxLeft = Math.min(startPos.x, currentPos.x);
  const boxTop = Math.min(startPos.y, currentPos.y);
  const boxWidth = Math.abs(currentPos.x - startPos.x);
  const boxHeight = Math.abs(currentPos.y - startPos.y);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.4)',
        cursor: 'crosshair',
        display: 'flex'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={(e) => { e.preventDefault(); setIsActive(false); }}
    >
      {/* Top toolbar (Win11 style Snipping Tool UI) */}
      {!isDragging && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--color-bg-surface)',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          display: 'flex',
          gap: '8px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button style={{ background: 'var(--color-bg-surface-hover)', border: '1px solid var(--color-accent)', padding: '6px 12px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
            Rectangular Snip
          </button>
          <button onClick={() => setIsActive(false)} style={{ background: 'transparent', border: 'none', padding: '6px 12px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )}

      {/* Selection Box */}
      {isDragging && (
        <div
          style={{
            position: 'absolute',
            left: boxLeft,
            top: boxTop,
            width: boxWidth,
            height: boxHeight,
            border: '2px solid var(--color-accent)',
            background: 'transparent',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)' // Creates the "cutout" effect
          }}
        />
      )}
    </div>
  );
}
