import { DismissRegular } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';
import './FileExplorerApp.css'; 

export default function PropertiesModal({ item, onClose }) {
  if (!item) return null;

  const [activeTab, setActiveTab] = useState('General');

  // Hardcoded or dynamically formatted data to look real
  const isFolder = item.type === 'folder';
  const fileTypeStr = isFolder ? 'File folder' : `File (${item.icon || 'Unknown'})`;
  const opensWith = isFolder ? null : (item.icon === 'pdf' ? 'Browser' : 'Notepad');
  const sizeOnDisk = isFolder ? '0 bytes' : (item.size || '14.2 KB (14,540 bytes)');
  const createdDate = item.created || new Date().toLocaleString();
  const modifiedDate = item.modified || new Date().toLocaleString();
  const locationPath = `C:\\Users\\Soham\\${item.name}`;

  return (
    <div className="explorer-dialog-overlay" onClick={onClose}>
      <div className="properties-dialog" onClick={e => e.stopPropagation()}>
        <div className="properties-dialog-header">
          <span>{item.name} Properties</span>
          <button className="properties-dialog-close" onClick={onClose}>
            <DismissRegular />
          </button>
        </div>

        <div className="properties-dialog-tabs">
          <button className={`properties-tab ${activeTab === 'General' ? 'active' : ''}`} onClick={() => setActiveTab('General')}>General</button>
          <button className={`properties-tab ${activeTab === 'Security' ? 'active' : ''}`} onClick={() => setActiveTab('Security')}>Security</button>
          <button className={`properties-tab ${activeTab === 'Details' ? 'active' : ''}`} onClick={() => setActiveTab('Details')}>Details</button>
        </div>

        <div className="properties-dialog-body">
          {activeTab === 'General' && (
            <div className="properties-general-tab">
              <div className="properties-top-section">
                <div className="properties-icon-large">
                  {/* Reuse the logic for getting the icon or just show generic */}
                  {isFolder ? '📁' : '📄'}
                </div>
                <div className="properties-name-input">
                  <input type="text" value={item.name} readOnly />
                </div>
              </div>

              <div className="properties-separator" />

              <div className="properties-grid">
                <span className="properties-label">Type of file:</span>
                <span>{fileTypeStr}</span>

                {!isFolder && (
                  <>
                    <span className="properties-label">Opens with:</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {opensWith}
                      <button className="properties-change-btn">Change...</button>
                    </span>
                  </>
                )}
              </div>

              <div className="properties-separator" />

              <div className="properties-grid">
                <span className="properties-label">Location:</span>
                <span>{locationPath}</span>

                <span className="properties-label">Size:</span>
                <span>{item.size || '12.0 KB (12,288 bytes)'}</span>

                <span className="properties-label">Size on disk:</span>
                <span>{sizeOnDisk}</span>
              </div>

              <div className="properties-separator" />

              <div className="properties-grid">
                <span className="properties-label">Created:</span>
                <span>{createdDate}</span>

                <span className="properties-label">Modified:</span>
                <span>{modifiedDate}</span>

                <span className="properties-label">Accessed:</span>
                <span>{createdDate}</span>
              </div>
              
              <div className="properties-separator" />
              
              <div className="properties-attributes">
                <span className="properties-label">Attributes:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'not-allowed' }}>
                  <input type="checkbox" readOnly /> Read-only
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'not-allowed' }}>
                  <input type="checkbox" readOnly /> Hidden
                </label>
              </div>

            </div>
          )}

          {activeTab !== 'General' && (
            <div className="properties-other-tab">
              <p>You must have Read permissions to view the properties of this object.</p>
              <p>Click Advanced to continue.</p>
              <button className="properties-change-btn" style={{ marginTop: '16px' }}>Advanced</button>
            </div>
          )}
        </div>

        <div className="properties-dialog-footer">
          <button className="explorer-btn" onClick={onClose}>OK</button>
          <button className="explorer-btn" onClick={onClose}>Cancel</button>
          <button className="explorer-btn" disabled>Apply</button>
        </div>
      </div>
    </div>
  );
}
