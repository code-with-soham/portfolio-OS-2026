import { useMobileStore } from '../store/useMobileStore';
import { 
  HomeRegular, 
  GridRegular, 
  SearchRegular, 
  BotRegular, 
  PersonRegular 
} from '@fluentui/react-icons';

export default function MobileBottomNav() {
  const { activeTab, setBottomNavTab } = useMobileStore();

  const NAV_ITEMS = [
    { id: 'home', icon: <HomeRegular className="mobile-nav-icon" /> },
    { id: 'search', icon: <SearchRegular className="mobile-nav-icon" /> },
    { id: 'ai', icon: <BotRegular className="mobile-nav-icon" /> },
    { id: 'apps', icon: <GridRegular className="mobile-nav-icon" /> },
    { id: 'profile', icon: <PersonRegular className="mobile-nav-icon" /> },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setBottomNavTab(item.id)}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
}
