import React from 'react';
import { useBrowserStore } from '../../../store/useBrowserStore';

export default function BrowserBookmarksBar() {
  const { bookmarks, navigateTo } = useBrowserStore();

  return (
    <div className="chrome-bookmarks-bar">
      {bookmarks.map(b => (
        <div 
          key={b.id} 
          className="chrome-bookmark-item"
          onClick={() => navigateTo(b.url)}
          title={b.url}
        >
          <span className="chrome-bookmark-icon">{b.icon}</span>
          <span className="chrome-bookmark-title">{b.title}</span>
        </div>
      ))}
    </div>
  );
}
