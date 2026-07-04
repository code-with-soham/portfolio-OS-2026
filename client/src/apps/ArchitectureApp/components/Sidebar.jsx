export default function Sidebar({ tabs, activeTab, onSelectTab }) {
  return (
    <div style={{
      width: '240px',
      borderRight: '1px solid #222',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 8px'
    }}>
      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#666', fontWeight: 600, padding: '0 12px', marginBottom: '12px' }}>
        Explorer Menu
      </div>
      
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              margin: '2px 0',
              borderRadius: '6px',
              border: 'none',
              background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: isActive ? '#fff' : '#888',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'left',
              fontSize: '13px',
              fontWeight: isActive ? 500 : 400
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ display: 'flex', alignItems: 'center', color: isActive ? 'var(--color-accent)' : '#666' }}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
