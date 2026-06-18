import React from 'react';
import { AddRegular, DismissRegular } from '@fluentui/react-icons';
import { useBrowserStore } from '../../../store/useBrowserStore';

export default function BrowserTabs({ dragControls, onClose, onMinimize, onMaximize, isMaximized }) {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab } = useBrowserStore();

  const handlePointerDown = (e) => {
    // Only start dragging if not clicking a tab or button
    if (e.target.closest('.chrome-tab') || e.target.closest('.chrome-new-tab-btn') || e.target.closest('.window-controls')) {
      return;
    }
    if (dragControls && !isMaximized) {
      dragControls.start(e);
    }
  };

  return (
    <div 
      className="chrome-tabs-container"
      onPointerDown={handlePointerDown}
      onDoubleClick={() => onMaximize && onMaximize()}
      style={{ cursor: isMaximized ? 'default' : 'grab', userSelect: 'none', touchAction: 'none' }}
    >
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={`chrome-tab ${tab.id === activeTabId ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <div className="chrome-tab-background">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <symbol id="chrome-tab-geometry-left" viewBox="0 0 214 36">
                  <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"/>
                </symbol>
                <symbol id="chrome-tab-geometry-right" viewBox="0 0 214 36">
                  <use xlinkHref="#chrome-tab-geometry-left"/>
                </symbol>
                <clipPath id="crop">
                  <rect className="mask" width="100%" height="100%" x="0"/>
                </clipPath>
              </defs>
              <svg width="52%" height="100%">
                <use xlinkHref="#chrome-tab-geometry-left" width="214" height="36" className="chrome-tab-geometry"/>
              </svg>
              <g transform="scale(-1, 1)">
                <svg width="52%" height="100%" x="-100%" y="0">
                  <use xlinkHref="#chrome-tab-geometry-right" width="214" height="36" className="chrome-tab-geometry"/>
                </svg>
              </g>
            </svg>
          </div>
          <div className="chrome-tab-content">
            <div className="chrome-tab-icon">{tab.icon}</div>
            <div className="chrome-tab-title">{tab.title}</div>
            <div 
              className="chrome-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <DismissRegular fontSize={12} />
            </div>
          </div>
        </div>
      ))}
      <div className="chrome-new-tab-btn" onClick={() => addTab()}>
        <AddRegular fontSize={16} />
      </div>

      <div style={{ flex: 1 }} />

      <div className="window-controls chrome-window-controls">
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
  );
}
