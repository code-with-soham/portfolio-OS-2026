import { SaveRegular, ArrowUndoRegular, ArrowRedoRegular } from '@fluentui/react-icons';
import { usePaintStore } from '../store/usePaintStore';

export default function PaintTitleBar({ dragControls, onClose, onMinimize, onMaximize, isMaximized }) {
  const { historyStep, history } = usePaintStore();
  
  const canUndo = historyStep > 0;
  const canRedo = historyStep < history.length - 1;

  const handlePointerDown = (e) => {
    // Only start dragging if not clicking a button
    if (e.target.closest('button') || e.target.closest('.window-control-btn')) {
      return;
    }
    if (dragControls && !isMaximized) {
      dragControls.start(e);
    }
  };

  return (
    <div 
      className="paint-titlebar"
      onPointerDown={handlePointerDown}
      onDoubleClick={() => onMaximize && onMaximize()}
      style={{ cursor: isMaximized ? 'default' : 'grab' }}
    >
      <div className="paint-titlebar-left">
        <div className="paint-titlebar-menus">
          <button className="paint-menu-item">File</button>
          <button className="paint-menu-item">Edit</button>
          <button className="paint-menu-item">View</button>
        </div>
        
        <div className="paint-titlebar-tools">
          <button className="paint-titlebar-tool" title="Save">
            <SaveRegular fontSize={16} />
          </button>
          <button className="paint-titlebar-tool" disabled={!canUndo} title="Undo">
            <ArrowUndoRegular fontSize={16} />
          </button>
          <button className="paint-titlebar-tool" disabled={!canRedo} title="Redo">
            <ArrowRedoRegular fontSize={16} />
          </button>
        </div>
      </div>
      
      <div className="paint-titlebar-right">
        <div className="window-controls">
          <button
            onPointerDown={(e) => { e.stopPropagation(); onMinimize && onMinimize(e); }}
            className="window-control-btn"
            title="Minimize"
          >
            ─
          </button>
          <button
            onPointerDown={(e) => { e.stopPropagation(); onMaximize && onMaximize(e); }}
            className="window-control-btn"
            title="Maximize"
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            onPointerDown={(e) => { e.stopPropagation(); onClose && onClose(e); }}
            className="window-control-btn close"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
