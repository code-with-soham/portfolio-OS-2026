import { useState } from 'react';
import { SaveRegular, ArrowUndoRegular, ArrowRedoRegular, PlayRegular } from '@fluentui/react-icons';
import { usePaintStore } from '../store/usePaintStore';
import { useFileSystemStore } from '../../../store/useFileSystemStore';

export default function PaintTitleBar({ dragControls, onClose, onMinimize, onMaximize, isMaximized, filePath }) {
  const { 
    historyStep, history, layers, canvasDimensions,
    timeLapseEvents, isReplaying, setIsReplaying
  } = usePaintStore();
  const { updateFileContent, createItem, updateLastOpened } = useFileSystemStore();
  
  const canUndo = historyStep > 0;
  const canRedo = historyStep < history.length - 1;

  const handleSave = () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvasDimensions.width;
    exportCanvas.height = canvasDimensions.height;
    const exportCtx = exportCanvas.getContext("2d");

    // Draw layers from bottom to top
    [...layers].reverse().forEach(layer => {
      if (!layer.visible) return;
      const layerCanvas = document.getElementById(`canvas-${layer.id}`);
      if (layerCanvas) {
        exportCtx.globalAlpha = layer.opacity;
        exportCtx.drawImage(layerCanvas, 0, 0);
      }
    });

    const dataUrl = exportCanvas.toDataURL("image/png");

    if (filePath) {
      // Overwrite existing file in Portfolio OS
      updateFileContent(filePath, dataUrl);
      updateLastOpened(filePath);
    } else {
      // Save new file to Desktop in Portfolio OS
      const newFileName = `Untitled-${Date.now()}.png`;
      createItem(['Desktop'], {
        name: newFileName,
        type: 'file',
        icon: 'image',
        content: dataUrl,
        size: '1 KB'
      });
      updateLastOpened(['Desktop', newFileName]);
    }

    // Also trigger native host download just in case they want it on their real PC
    const link = document.createElement("a");
    link.download = filePath ? filePath[filePath.length - 1] : "Untitled.png";
    link.href = dataUrl;
    link.click();
  };

  const handlePointerDown = (e) => {
    // Only start dragging if not clicking a button
    if (e.target.closest('button') || e.target.closest('.window-control-btn') || e.target.closest('.paint-unsaved-dialog')) {
      return;
    }
    if (dragControls && !isMaximized) {
      dragControls.start(e);
    }
  };

  const [showUnsaved, setShowUnsaved] = useState(false);
  
  const handleCloseClick = (e) => {
    e.stopPropagation();
    if (historyStep > 0) { // Considered "dirty"
      setShowUnsaved(true);
    } else {
      onClose(e);
    }
  };

  const startReplay = () => {
    if (!timeLapseEvents || timeLapseEvents.length === 0 || isReplaying) return;
    setIsReplaying(true);
    
    // Clear the active canvas before replay
    const activeCanvas = document.getElementById('canvas-layer-1');
    const ctx = activeCanvas?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    }

    let i = 0;
    const playNext = () => {
      if (i >= timeLapseEvents.length) {
        setIsReplaying(false);
        return;
      }
      const event = timeLapseEvents[i];
      if (ctx) {
        if (event.type === 'down') {
          ctx.beginPath();
          ctx.strokeStyle = event.color || '#000';
          ctx.lineWidth = event.size || 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalAlpha = event.opacity || 1;
          ctx.moveTo(event.x, event.y);
          ctx.lineTo(event.x, event.y);
          ctx.stroke();
        } else if (event.type === 'move') {
          ctx.lineTo(event.x, event.y);
          ctx.stroke();
        } else if (event.type === 'up') {
          ctx.closePath();
        }
      }
      i++;
      // Fast forward speed by processing multiple events per frame if needed, or just normal rAF
      requestAnimationFrame(playNext);
    };
    requestAnimationFrame(playNext);
  };

  return (
    <div 
      className="paint-titlebar"
      onPointerDown={handlePointerDown}
      onDoubleClick={() => onMaximize && onMaximize()}
      style={{ cursor: isMaximized ? 'default' : 'grab' }}
    >
      
      {/* Unsaved Changes Dialog Overlay */}
      {showUnsaved && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="paint-unsaved-dialog" style={{
            background: 'var(--color-bg-surface)', padding: '24px', borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)', width: '320px', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Save changes to Paint?</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button 
                onClick={(e) => { handleSave(); onClose(e); }} 
                style={{ padding: '6px 12px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >Save</button>
              <button 
                onClick={(e) => onClose(e)} 
                style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', borderRadius: '4px', cursor: 'pointer' }}
              >Don't Save</button>
              <button 
                onClick={() => setShowUnsaved(false)}
                style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="paint-titlebar-left">
        <div className="paint-titlebar-menus">
          <button className="paint-menu-item">File</button>
          <button className="paint-menu-item">Edit</button>
          <button className="paint-menu-item">View</button>
          <button className="paint-menu-item">Image</button>
        </div>
        
        <div className="paint-titlebar-tools">
          <button className="paint-titlebar-tool" title="Save" onClick={handleSave}>
            <SaveRegular fontSize={16} />
          </button>
          <button className="paint-titlebar-tool" disabled={!canUndo} title="Undo">
            <ArrowUndoRegular fontSize={16} />
          </button>
          <button className="paint-titlebar-tool" disabled={!canRedo} title="Redo">
            <ArrowRedoRegular fontSize={16} />
          </button>
          <button 
            className="paint-titlebar-tool" 
            title="Time-Lapse Replay" 
            onClick={startReplay}
            disabled={!timeLapseEvents || timeLapseEvents.length === 0 || isReplaying}
          >
            <PlayRegular fontSize={16} color={isReplaying ? "var(--color-accent)" : "inherit"} />
          </button>
        </div>
      </div>

      <div className="paint-titlebar-right">
        <div className="window-controls" style={{ display: 'flex', height: '100%' }}>
          <button
            onPointerDown={onMinimize}
            className="window-control-btn"
            style={{ width: '46px', background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            ─
          </button>
          <button
            onPointerDown={onMaximize}
            className="window-control-btn"
            style={{ width: '46px', background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            onPointerDown={handleCloseClick}
            className="window-control-btn"
            style={{ width: '46px', background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e81123';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
