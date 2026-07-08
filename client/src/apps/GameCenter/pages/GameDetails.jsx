import { ArrowLeftRegular, PlayFilled } from '@fluentui/react-icons';
import { useWindowStore } from '../../../store/useWindowStore';

export default function GameDetails({ game, onBack }) {
  const openWindow = useWindowStore(s => s.openWindow);

  if (!game) return null;

  const handlePlay = () => {
    openWindow('gameplayer', { game });
  };

  return (
    <div className="gc-page" style={{ padding: 0 }}>
      {/* Hero Banner Area */}
      <div 
        style={{
          width: '100%',
          height: 350,
          backgroundImage: `url(${game.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #1e1e1e 0%, transparent 100%)'
        }} />
        
        <button 
          className="gc-btn" 
          onClick={onBack}
          style={{ position: 'absolute', top: 24, left: 24, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
        >
          <ArrowLeftRegular /> Back
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 40px', marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', marginBottom: 24 }}>
          <div style={{ width: 120, height: 120, background: '#252526', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {game.icon}
          </div>
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <h1 style={{ fontSize: '3rem', margin: '0 0 8px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{game.title}</h1>
            <div style={{ display: 'flex', gap: 16, color: '#aaa', fontSize: '0.9rem', flexWrap: 'wrap' }}>
              <span>{game.developer}</span>
              <span>•</span>
              <span>{game.category}</span>
              <span>•</span>
              <span style={{ color: '#F1C40F' }}>★ {game.rating}</span>
              {game.difficulty && <><span>•</span><span>{game.difficulty}</span></>}
              {game.ageRating && <><span>•</span><span>{game.ageRating}</span></>}
            </div>
          </div>
        </div>

        <button 
          onClick={handlePlay}
          style={{ 
            background: '#107c10', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            padding: '16px 48px', 
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16,124,16,0.3)',
            marginBottom: 40
          }}
        >
          <PlayFilled fontSize={24} /> PLAY NOW
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, paddingBottom: 40 }}>
          <div>
            <h3 style={{ marginBottom: 16 }}>About</h3>
            <p style={{ color: '#ccc', lineHeight: 1.6, fontSize: '1.05rem' }}>
              {game.description}
            </p>

            {/* Collections tags */}
            {game.collections && game.collections.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4 style={{ color: '#aaa', marginBottom: 12, fontSize: '0.9rem' }}>Collections</h4>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {game.collections.map(c => (
                    <span key={c} style={{ background: 'rgba(16,124,16,0.15)', border: '1px solid rgba(16,124,16,0.3)', color: '#4caf50', padding: '4px 12px', borderRadius: 16, fontSize: '0.8rem' }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 12 }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Details</h3>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 4 }}>Controls</div>
              <div>{game.controls}</div>
            </div>

            {game.players && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 4 }}>Players</div>
                <div>{game.players}</div>
              </div>
            )}

            {game.estimatedPlayTime && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 4 }}>Estimated Play Time</div>
                <div>{game.estimatedPlayTime}</div>
              </div>
            )}
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 4 }}>Version</div>
              <div>{game.version}</div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 4 }}>Features</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {game.supportsFullscreen && <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem' }}>Fullscreen</span>}
                {game.supportsGamepad && <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem' }}>Gamepad</span>}
                {game.offline && <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem' }}>Offline</span>}
                {game.supportsSave && <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem' }}>Save Progress</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
