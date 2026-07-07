import { motion } from 'framer-motion';
import {
  PersonRegular,
  BriefcaseRegular,
  FolderRegular,
  LightbulbRegular,
  TrophyRegular,
  HatGraduationRegular,
  DocumentRegular,
  CallRegular,
  PresenceAvailableRegular
} from '@fluentui/react-icons';

const SIDEBAR_TABS = [
  { id: 'overview', label: 'Overview', icon: <PersonRegular /> },
  { id: 'experience', label: 'Experience', icon: <BriefcaseRegular /> },
  { id: 'projects', label: 'Projects', icon: <FolderRegular /> },
  { id: 'skills', label: 'Skills', icon: <LightbulbRegular /> },
  { id: 'achievements', label: 'Achievements', icon: <TrophyRegular /> },
  { id: 'education', label: 'Education', icon: <HatGraduationRegular /> },
  { id: 'resume', label: 'Resume', icon: <DocumentRegular /> },
  { id: 'contact', label: 'Contact', icon: <CallRegular /> },
  { id: 'availability', label: 'Availability', icon: <PresenceAvailableRegular color="#2ECC71" /> },
];

export default function AboutSidebar({ activeTab, setActiveTab, profile }) {
  const name = profile?.name || 'Soham';
  return (
    <div className="about-sidebar">
      <div className="about-sidebar-header">
        <div className="sidebar-avatar-container">
          <img src="/src/assets/images/profile 2.jpeg" alt={name} className="sidebar-avatar" />
          <div className="sidebar-availability-ring"></div>
        </div>
      </div>
      <div className="about-sidebar-menu">
        {SIDEBAR_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`about-sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="sidebar-active-indicator" 
                className="sidebar-active-indicator"
              />
            )}
            <span className="sidebar-btn-icon">{tab.icon}</span>
            <span className="sidebar-btn-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
