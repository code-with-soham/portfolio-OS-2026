import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EVENT_TYPES = {
  WINDOW_OPEN: { color: '#61dafb', icon: '🪟' },
  WINDOW_CLOSE: { color: '#f44336', icon: '❌' },
  STORE_UPDATE: { color: '#f0db4f', icon: '⚡' },
  AI_QUERY: { color: '#e040fb', icon: '🧠' },
  NAVIGATION: { color: '#00bcd4', icon: '🔗' },
  NETWORK: { color: '#ff9800', icon: '🌐' },
  USER_ACTION: { color: '#4CAF50', icon: '👆' },
  SYSTEM: { color: '#9e9e9e', icon: '⚙️' }
};

// Generate some simulated events for demonstration
function generateInitialEvents() {
  const events = [];
  const now = Date.now();
  const types = Object.keys(EVENT_TYPES);

  const templates = [
    { type: 'SYSTEM', source: 'Portfolio OS', message: 'System initialized' },
    { type: 'STORE_UPDATE', source: 'useDesktopStore', message: 'Desktop state hydrated from localStorage' },
    { type: 'STORE_UPDATE', source: 'useThemeStore', message: 'Theme loaded: dark mode' },
    { type: 'NETWORK', source: 'WeatherService', message: 'Fetching weather data for Kolkata' },
    { type: 'SYSTEM', source: 'ServiceWorker', message: 'Service worker registered' },
    { type: 'USER_ACTION', source: 'Desktop', message: 'Desktop icons rendered' },
    { type: 'STORE_UPDATE', source: 'useWindowStore', message: 'Window manager initialized' },
    { type: 'SYSTEM', source: 'ArchitectureExplorer', message: 'Architecture Explorer opened' }
  ];

  templates.forEach((t, i) => {
    events.push({
      id: i,
      timestamp: now - (templates.length - i) * 1200,
      type: t.type,
      source: t.source,
      message: t.message
    });
  });

  return events;
}

export default function EventTimeline() {
  const [events, setEvents] = useState(generateInitialEvents);
  const [filter, setFilter] = useState('ALL');
  const timelineRef = useRef(null);
  const nextIdRef = useRef(100);

  // Simulate live events every few seconds
  useEffect(() => {
    const liveEvents = [
      { type: 'STORE_UPDATE', source: 'useAnalyticsStore', message: 'Event batch flushed' },
      { type: 'USER_ACTION', source: 'Desktop', message: 'Mouse idle detected' },
      { type: 'SYSTEM', source: 'GarbageCollector', message: 'Cleanup cycle completed' },
      { type: 'STORE_UPDATE', source: 'useWidgetStore', message: 'Widget panel state updated' },
      { type: 'NETWORK', source: 'GitHubService', message: 'Repository cache refreshed' },
      { type: 'SYSTEM', source: 'PerformanceObserver', message: 'FPS stable at 60' },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      const template = liveEvents[idx % liveEvents.length];
      const newEvent = {
        id: nextIdRef.current++,
        timestamp: Date.now(),
        type: template.type,
        source: template.source,
        message: template.message
      };
      setEvents(prev => [...prev.slice(-50), newEvent]); // Keep last 50
      idx++;
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [events]);

  const filteredEvents = filter === 'ALL' ? events : events.filter(e => e.type === filter);

  const formatTime = (ts) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '24px 32px 16px', borderBottom: '1px solid #222' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0' }}>Event Timeline</h2>
        <p style={{ color: '#888', margin: '0 0 16px 0', fontSize: '13px' }}>Real-time event log — Chrome Performance style.</p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('ALL')}
            style={{
              padding: '4px 12px', borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 600,
              background: filter === 'ALL' ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: filter === 'ALL' ? '#fff' : '#666', cursor: 'pointer'
            }}
          >
            All ({events.length})
          </button>
          {Object.entries(EVENT_TYPES).map(([type, config]) => {
            const count = events.filter(e => e.type === type).length;
            if (count === 0) return null;
            return (
              <button
                key={type}
                onClick={() => setFilter(filter === type ? 'ALL' : type)}
                style={{
                  padding: '4px 12px', borderRadius: '12px', border: 'none', fontSize: '11px', fontWeight: 500,
                  background: filter === type ? `${config.color}22` : 'transparent',
                  color: filter === type ? config.color : '#666', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}
              >
                {config.icon} {type.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 32px' }} className="custom-scrollbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '87px', top: 0, bottom: 0, width: '1px', background: '#1a1a1a' }} />

          {filteredEvents.map((event, i) => {
            const config = EVENT_TYPES[event.type] || EVENT_TYPES.SYSTEM;
            return (
              <motion.div
                key={event.id}
                initial={i >= filteredEvents.length - 1 ? { opacity: 0, x: -10 } : false}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '6px 0', fontSize: '12px'
                }}
              >
                {/* Timestamp */}
                <span style={{ width: '80px', color: '#555', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', flexShrink: 0, textAlign: 'right' }}>
                  {formatTime(event.timestamp)}
                </span>

                {/* Dot */}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: config.color, flexShrink: 0, zIndex: 1 }} />

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span style={{ fontSize: '12px' }}>{config.icon}</span>
                  <span style={{ color: config.color, fontWeight: 600, fontSize: '12px', flexShrink: 0 }}>{event.source}</span>
                  <span style={{ color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.message}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 32px', borderTop: '1px solid #222', fontSize: '10px', color: '#555',
        display: 'flex', gap: '16px', fontFamily: 'JetBrains Mono, monospace'
      }}>
        <span>Events: {events.length}</span>
        <span>Filtered: {filteredEvents.length}</span>
        <span>Live: Active</span>
      </div>
    </div>
  );
}
