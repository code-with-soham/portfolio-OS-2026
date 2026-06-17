import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useFileSystemStore } from '../../store/useFileSystemStore';
import './NotepadApp.css';

export default function NotepadApp({ filePath }) {
  const { getNode, updateFileContent, createItem } = useFileSystemStore();
  
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled.txt');
  const [currentPath, setCurrentPath] = useState(null); // e.g. ['Desktop', 'Notes', 'Untitled.txt']
  
  const [isPreview, setIsPreview] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveLocation, setSaveLocation] = useState('Desktop/Notes');
  const [saveName, setSaveName] = useState('Untitled.txt');

  const textAreaRef = useRef(null);

  // Load file if passed via props
  useEffect(() => {
    if (filePath && filePath.length > 0) {
      const node = getNode(filePath);
      if (node && node.type === 'file') {
        setContent(node.content || '');
        setFileName(node.name);
        setCurrentPath(filePath);
      }
    }
  }, [filePath, getNode]);

  // Auto-save logic
  useEffect(() => {
    if (!currentPath) return; // Don't auto-save if never saved/opened
    
    const timeoutId = setTimeout(() => {
      updateFileContent(currentPath, content);
    }, 2000); // Debounced auto-save
    
    return () => clearTimeout(timeoutId);
  }, [content, currentPath, updateFileContent]);

  const handleNew = () => {
    setContent('');
    setFileName('Untitled.txt');
    setCurrentPath(null);
    setMenuOpen(null);
  };

  const handleSave = () => {
    if (currentPath) {
      updateFileContent(currentPath, content);
      setMenuOpen(null);
    } else {
      setSaveName(fileName);
      setShowSaveDialog(true);
      setMenuOpen(null);
    }
  };

  const handleSaveAs = () => {
    setSaveName(fileName);
    setShowSaveDialog(true);
    setMenuOpen(null);
  };

  const executeSaveDialog = () => {
    const parentParts = saveLocation.split('/');
    const fullPath = [...parentParts, saveName];
    
    createItem(parentParts, {
      name: saveName,
      type: 'file',
      icon: saveName.endsWith('.md') ? 'document' : 'document',
      content: content,
      size: `${Math.max(1, Math.ceil(content.length / 1024))} KB`
    });

    setFileName(saveName);
    setCurrentPath(fullPath);
    setShowSaveDialog(false);
  };

  return (
    <div className="notepad-app" onClick={() => setMenuOpen(null)}>
      {/* Menu Bar */}
      <div className="notepad-menubar">
        <div className="notepad-menu-item" onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === 'file' ? null : 'file'); }}>
          File
          {menuOpen === 'file' && (
            <div className="notepad-dropdown">
              <div className="notepad-dropdown-item" onClick={handleNew}>
                <span>New</span> <span className="notepad-shortcut">Ctrl+N</span>
              </div>
              <div className="notepad-dropdown-item">
                <span style={{color: '#888'}}>Open... (Use Explorer)</span>
              </div>
              <div className="notepad-dropdown-item" onClick={handleSave}>
                <span>Save</span> <span className="notepad-shortcut">Ctrl+S</span>
              </div>
              <div className="notepad-dropdown-item" onClick={handleSaveAs}>
                <span>Save As...</span> <span className="notepad-shortcut">Ctrl+Shift+S</span>
              </div>
            </div>
          )}
        </div>
        <div className="notepad-menu-item" onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === 'view' ? null : 'view'); }}>
          View
          {menuOpen === 'view' && (
            <div className="notepad-dropdown">
              <div className="notepad-dropdown-item" onClick={() => setIsPreview(!isPreview)}>
                <span>{isPreview ? 'Edit Mode' : 'Markdown Preview'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="notepad-content-wrapper">
        {isPreview ? (
          <div className="notepad-markdown-preview">
            <ReactMarkdown>{content || '*Empty Document*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textAreaRef}
            className="notepad-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="notepad-status">
        <span>Ln {content.split('\n').length}, Col {content.length - content.lastIndexOf('\n')}</span>
        <span>{isPreview ? 'Markdown Preview' : 'Plain Text'} | UTF-8</span>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="notepad-dialog-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="notepad-dialog" onClick={e => e.stopPropagation()}>
            <div className="notepad-dialog-header">Save As</div>
            <div className="notepad-dialog-body">
              <div className="notepad-dialog-row">
                <div className="notepad-dialog-label">Location:</div>
                <select 
                  className="notepad-dialog-select" 
                  value={saveLocation} 
                  onChange={(e) => setSaveLocation(e.target.value)}
                >
                  <option value="Desktop">Desktop</option>
                  <option value="Desktop/Documents">Desktop/Documents</option>
                  <option value="Desktop/Notes">Desktop/Notes</option>
                </select>
              </div>
              <div className="notepad-dialog-row">
                <div className="notepad-dialog-label">File name:</div>
                <input 
                  type="text" 
                  className="notepad-dialog-input" 
                  value={saveName} 
                  onChange={(e) => setSaveName(e.target.value)} 
                />
              </div>
            </div>
            <div className="notepad-dialog-footer">
              <button className="notepad-btn" onClick={() => setShowSaveDialog(false)}>Cancel</button>
              <button className="notepad-btn primary" onClick={executeSaveDialog}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
