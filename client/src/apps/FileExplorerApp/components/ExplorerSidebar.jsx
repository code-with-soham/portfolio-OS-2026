import { motion } from 'framer-motion';
import { 
  HistoryRegular, 
  PinRegular, 
  FolderRegular, 
  CloudRegular, 
  DeleteRegular, 
  DocumentRegular, 
  TrophyRegular, 
  LightbulbRegular,
  OrganizationRegular,
  WindowDevToolsRegular,
  DataTrendingRegular,
  ChevronRightRegular,
  ChevronDownRegular
} from '@fluentui/react-icons';
import { useState } from 'react';

const SIDEBAR_SECTIONS = [
  {
    title: 'Quick Access',
    items: [
      { id: 'recent', label: 'Recent Files', icon: <HistoryRegular />, path: ['Recent'] },
      { id: 'pinned', label: 'Pinned', icon: <PinRegular />, path: ['Pinned'] },
    ]
  },
  {
    title: 'Portfolio',
    items: [
      { id: 'projects', label: 'Projects', icon: <FolderRegular />, path: ['Portfolio', 'Projects'] },
      { id: 'resume', label: 'Resume', icon: <DocumentRegular />, path: ['Portfolio', 'Resume'] },
      { id: 'certificates', label: 'Certificates', icon: <TrophyRegular />, path: ['Portfolio', 'Certificates'] },
      { id: 'skills', label: 'Skills', icon: <LightbulbRegular />, path: ['Portfolio', 'Skills'] },
      { id: 'architecture', label: 'Architecture', icon: <OrganizationRegular />, path: ['Portfolio', 'Architecture'] },
      { id: 'ai', label: 'AI Models', icon: <WindowDevToolsRegular />, path: ['Portfolio', 'AI Models'] },
    ]
  },
  {
    title: 'Cloud',
    items: [
      { id: 'github', label: 'GitHub', icon: <CloudRegular />, path: ['Cloud', 'GitHub'] },
      { id: 'deployments', label: 'Deployments', icon: <DataTrendingRegular />, path: ['Portfolio', 'Deployments'] },
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'recycle', label: 'Recycle Bin', icon: <DeleteRegular />, path: ['Recycle Bin'] },
    ]
  }
];

export default function ExplorerSidebar({ currentPath, navigateTo }) {
  const [expandedSections, setExpandedSections] = useState(
    SIDEBAR_SECTIONS.reduce((acc, sec) => ({ ...acc, [sec.title]: true }), {})
  );

  const toggleSection = (title) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (path) => {
    return currentPath.join('/') === path.join('/');
  };

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="explorer-sidebar"
    >
      {SIDEBAR_SECTIONS.map((section) => (
        <div key={section.title} className="sidebar-section">
          <div 
            className="sidebar-section-header" 
            onClick={() => toggleSection(section.title)}
          >
            {expandedSections[section.title] ? <ChevronDownRegular fontSize={12} /> : <ChevronRightRegular fontSize={12} />}
            <span>{section.title}</span>
          </div>
          
          {expandedSections[section.title] && (
            <div className="sidebar-section-items">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`explorer-sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigateTo(item.path)}
                >
                  <span className="explorer-sidebar-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}
