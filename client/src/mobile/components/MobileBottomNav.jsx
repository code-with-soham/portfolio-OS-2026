import { useMobileStore } from '../store/useMobileStore';
import { 
  HomeRegular, 
  GridRegular, 
  SearchRegular, 
  BotRegular, 
  PersonRegular 
} from '@fluentui/react-icons';

export default function MobileBottomNav() {
  const { activeApp, activeTab, closeApp, openApp, setBottomNavTab } = useMobileStore();

  const NAV_ITEMS = [
    { id: 'home', icon: <HomeRegular className="mobile-nav-icon" />, label: 'Home' },
    { id: 'ai', icon: <BotRegular className="mobile-nav-icon" />, label: 'Ask AI' },
    { id: 'profile', icon: <PersonRegular className="mobile-nav-icon" />, label: 'Profile' }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activeTab === item.id || (activeApp === 'recruiter' && item.id === 'ai') ? 'active' : ''}`}
          onClick={() => {
            if (item.id === 'ai') {
              openApp('recruiter', { tab: 'ai' });
            } else {
              if (activeApp) closeApp();
              setBottomNavTab(item.id);
            }
          }}
        >
          {item.icon}
          <span style={{ fontSize: '10px' }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
