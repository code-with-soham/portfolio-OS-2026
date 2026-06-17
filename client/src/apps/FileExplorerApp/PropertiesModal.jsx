import { DismissRegular } from '@fluentui/react-icons';
import './FileExplorerApp.css'; // Uses some explorer styles

export default function PropertiesModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="explorer-dialog-overlay" onClick={onClose}>
      <div className="explorer-dialog" onClick={e => e.stopPropagation()}>
        <div className="explorer-dialog-header">
          {item.name} Properties
          <button className="explorer-dialog-close" onClick={onClose}>
            <DismissRegular />
          </button>
        </div>
        <div className="explorer-dialog-body">
          <div className="explorer-prop-row">
            <span className="explorer-prop-label">Type:</span>
            <span>{item.type === 'folder' ? 'File Folder' : `${item.icon || 'File'}`}</span>
          </div>
          <div className="explorer-prop-row">
            <span className="explorer-prop-label">Size:</span>
            <span>{item.size || '0 bytes'}</span>
          </div>
          <div className="explorer-prop-row">
            <span className="explorer-prop-label">Created:</span>
            <span>{item.created || 'Unknown'}</span>
          </div>
          <div className="explorer-prop-row">
            <span className="explorer-prop-label">Modified:</span>
            <span>{item.modified || 'Unknown'}</span>
          </div>
        </div>
        <div className="explorer-dialog-footer">
          <button className="explorer-btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}
