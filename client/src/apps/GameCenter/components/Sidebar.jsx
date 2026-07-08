import { 
  HomeRegular, 
  LibraryRegular, 
  TrophyRegular, 
  SettingsRegular 
} from '@fluentui/react-icons';
import gamesData from '../data/games.json';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: <HomeRegular fontSize={20} /> },
    { id: 'library', label: 'Library', icon: <LibraryRegular fontSize={20} />, badge: gamesData.length },
    { id: 'achievements', label: 'Achievements', icon: <TrophyRegular fontSize={20} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsRegular fontSize={20} /> },
  ];

  return (
    <div className="gc-sidebar">
      <div className="gc-logo">
        <span style={{ fontSize: '1.5rem' }}>🎮</span> Game Center
      </div>
      
      <div className="gc-nav">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`gc-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span style={{ flex: 1 }}>{tab.label}</span>
            {tab.badge && (
              <span style={{ 
                fontSize: '0.7rem', 
                background: 'rgba(16,124,16,0.3)', 
                color: '#4caf50', 
                padding: '2px 6px', 
                borderRadius: 8,
                fontWeight: 600
              }}>
                {tab.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
