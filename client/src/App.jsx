// ============================================
// Portfolio OS 2026 — Root Application Component
// ============================================
// Sets up routing and provides global context.
// In future phases, this will wrap the Desktop, Taskbar,
// and Window Manager components.

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore';

/**
 * Desktop — Phase 1 placeholder
 * A Windows 11-inspired boot screen confirming everything is working.
 */
function Desktop() {
  const { theme } = useThemeStore();

  return (
    <div
      id="desktop"
      className="no-select"
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Windows-style logo */}
      <div
        style={{
          width: '64px',
          height: '64px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
          opacity: 0.9,
        }}
      >
        <div style={{ background: '#f25022', borderRadius: '2px' }} />
        <div style={{ background: '#7fba00', borderRadius: '2px' }} />
        <div style={{ background: '#00a4ef', borderRadius: '2px' }} />
        <div style={{ background: '#ffb900', borderRadius: '2px' }} />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 300,
          letterSpacing: '0.05em',
          color: '#ffffff',
          fontFamily: 'var(--font-family)',
        }}
      >
        Portfolio OS 2026
      </h1>

      {/* Status */}
      <p
        style={{
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'var(--font-family)',
        }}
      >
        System initialized • Phase 1 complete
      </p>

      {/* Animated dots */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginTop: '8px',
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--color-accent)',
              animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Inline keyframe animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

/**
 * App — Root component
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Desktop />} />
      </Routes>
    </Router>
  );
}

export default App;
