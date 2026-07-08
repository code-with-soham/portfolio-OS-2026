import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../../store/useGameStore';
import { WarningRegular } from '@fluentui/react-icons';

export default function GameRuntime({ game, refreshKey }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const recordPlayTime = useGameStore(s => s.recordPlayTime);

  // Record Play Time on unmount
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    return () => {
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (sessionTime > 5 && !hasError) { // Don't record tiny sessions or errors
        recordPlayTime(game.id, sessionTime);
      }
    };
  }, [game.id, refreshKey, hasError, recordPlayTime]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="gp-iframe-container" style={{ background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <WarningRegular fontSize={48} color="#e81123" style={{ marginBottom: 16 }} />
        <h2>Game Unavailable</h2>
        <p style={{ color: '#aaa', maxWidth: 400, textAlign: 'center' }}>
          Could not load the game assets for <strong>{game.title}</strong>. This might be due to a missing local manifest or network error.
        </p>
        <button className="gc-btn" onClick={() => { setHasError(false); setIsLoading(true); }} style={{ marginTop: 24 }}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="gp-iframe-container">
      {isLoading && (
        <div className="gp-loading">
          <div className="gp-spinner"></div>
          <div>Loading Runtime for {game.title}...</div>
        </div>
      )}
      <iframe
        key={refreshKey}
        ref={iframeRef}
        src={game.entry} // Using new 'entry' manifest field
        className="gp-iframe"
        title={game.title}
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
