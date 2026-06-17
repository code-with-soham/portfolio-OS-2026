export default function MusicStats() {
  return (
    <div style={{
      padding: '20px',
      borderTop: '1px solid #333',
      color: '#a0a0a0',
      fontSize: '0.85rem'
    }}>
      <h3 style={{ 
        color: '#ffffff', 
        fontSize: '0.9rem', 
        marginBottom: '12px', 
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Your Stats
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Songs:</span>
          <span style={{ color: '#ffffff' }}>24</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Listening Time:</span>
          <span style={{ color: '#ffffff' }}>1h 48m</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Top Genre:</span>
          <span style={{ color: '#ffffff' }}>Lofi</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Favorites:</span>
          <span style={{ color: '#ffffff' }}>8</span>
        </div>
      </div>
    </div>
  );
}
