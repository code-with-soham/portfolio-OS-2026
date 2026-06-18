import React, { useState } from 'react';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { SearchRegular, HistoryRegular, DeleteRegular, MoreVerticalRegular } from '@fluentui/react-icons';
import '../BrowserHistory.css';

export default function BrowserHistory() {
  const { history, clearHistory, navigateTo } = useBrowserStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by date
  const groupedHistory = filteredHistory.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="chrome-internal-page history-page">
      <div className="chrome-settings-sidebar">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HistoryRegular /> History
        </h3>
        <ul>
          <li className="active">Chrome history</li>
          <li>Tabs from other devices</li>
          <li style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#5f6368' }} onClick={clearHistory}>
            <DeleteRegular /> Clear browsing data
          </li>
        </ul>
      </div>

      <div className="history-content-area">
        <div className="history-header">
          <div className="history-search">
            <SearchRegular />
            <input 
              placeholder="Search history" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="history-list">
          {Object.entries(groupedHistory).length === 0 ? (
            <div className="history-empty">Your browsing history appears here</div>
          ) : (
            Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="history-group">
                <div className="history-date-header">{date}</div>
                <div className="history-items">
                  {items.map((item, idx) => {
                    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={idx} className="history-item-row" onClick={() => navigateTo(item.url)}>
                        <div className="history-time">{time}</div>
                        <div className="history-favicon">
                          {item.url.startsWith('https://') ? '🔒' : '🌐'}
                        </div>
                        <div className="history-details">
                          <span className="history-title">{item.title}</span>
                          <span className="history-url">{item.url}</span>
                        </div>
                        <button className="history-action-btn" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalRegular />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
