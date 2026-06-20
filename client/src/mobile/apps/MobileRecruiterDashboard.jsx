import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileStore } from '../store/useMobileStore';
import { 
  ChevronLeftRegular, 
  PersonRegular, 
  BriefcaseRegular, 
  DocumentRegular, 
  BotRegular, 
  CommunicationRegular,
  ArrowDownloadRegular
} from '@fluentui/react-icons';

import OverviewTab from '../components/dashboard/OverviewTab';
import ProjectsTab from '../components/dashboard/ProjectsTab';
import ResumeTab from '../components/dashboard/ResumeTab';
import AITab from '../components/dashboard/AITab';
import ContactTab from '../components/dashboard/ContactTab';

export default function MobileRecruiterDashboard() {
  const { closeApp, appArgs } = useMobileStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (appArgs?.tab) {
      setActiveTab(appArgs.tab);
    }
  }, [appArgs]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <PersonRegular /> },
    { id: 'projects', label: 'Projects', icon: <BriefcaseRegular /> },
    { id: 'resume', label: 'Resume', icon: <DocumentRegular /> },
    { id: 'ai', label: 'Ask AI', icon: <BotRegular /> },
    { id: 'contact', label: 'Contact', icon: <CommunicationRegular /> },
  ];

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.2 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--color-bg-base)',
        zIndex: 8000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* App Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
        <button onClick={closeApp} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}>
          <ChevronLeftRegular fontSize={24} />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 600, marginLeft: '8px' }}>Recruiter Pro</span>
      </div>

      {/* Tab Navigation (Scrollable horizontal if needed, or fixed) */}
      <div style={{ display: 'flex', overflowX: 'auto', background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0, padding: '0 8px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-accent)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ padding: '20px', paddingBottom: '100px' }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'resume' && <ResumeTab />}
            {activeTab === 'ai' && <AITab />}
            {activeTab === 'contact' && <ContactTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(15, 15, 26, 0.85)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--color-border)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10
      }}>
        <button style={{
          flex: 1,
          padding: '12px',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          color: 'var(--color-text-primary)',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ArrowDownloadRegular />
          Resume
        </button>
        <button style={{
          flex: 1.5,
          padding: '12px',
          background: 'var(--color-accent)',
          border: 'none',
          borderRadius: '12px',
          color: '#fff',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)'
        }}>
          Hire Me
        </button>
      </div>
    </motion.div>
  );
}
