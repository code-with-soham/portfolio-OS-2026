import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileStore } from './store/useMobileStore';

import MobileStatusBar from './components/MobileStatusBar';
import MobileBottomNav from './components/MobileBottomNav';
import MobileHomeScreen from './components/MobileHomeScreen';
import MobileAppDrawer from './components/MobileAppDrawer';
import MobileQuickSettings from './components/MobileQuickSettings';
import MobileLockScreen from './components/MobileLockScreen';
import MobileRecruiterDashboard from './apps/MobileRecruiterDashboard';
import { BotRegular } from '@fluentui/react-icons';

import './MobileOS.css';

export default function MobileOS() {
  const { isLocked, unlockDevice, activeApp, activeTab, isAppDrawerOpen, isQuickSettingsOpen } = useMobileStore();

  // Disable default touch actions to prevent overscroll/pull-to-refresh on mobile
  useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  const renderActiveTab = () => {
    if (activeApp === 'recruiter') return <MobileRecruiterDashboard />;
    if (activeApp) return <div style={{ padding: '20px' }}>Rendering Lite App: {activeApp} <br/><br/> <button onClick={() => useMobileStore.getState().closeApp()}>Close App</button></div>;

    switch (activeTab) {
      case 'home':
        return <MobileHomeScreen />;
      case 'apps':
        return <div>Apps Tab</div>;
      case 'search':
        return <div>Search Tab</div>;
      case 'ai':
        return <div>AI Tab</div>;
      case 'profile':
        return <div>Profile Tab</div>;
      default:
        return <MobileHomeScreen />;
    }
  };

  return (
    <div className="mobile-os-root">
      <MobileStatusBar />
      
      <main className="mobile-os-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeApp ? activeApp : activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="mobile-page-container"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MobileBottomNav />
      
      {/* AI Assistant FAB */}
      {!isLocked && !activeApp && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => useMobileStore.getState().openApp('aidashboard')}
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            zIndex: 8500,
            cursor: 'pointer'
          }}
        >
          <BotRegular fontSize={28} />
        </motion.button>
      )}

      {/* Overlays */}
      {isLocked && <MobileLockScreen onUnlock={unlockDevice} />}
      
      <AnimatePresence>
        {isAppDrawerOpen && <MobileAppDrawer />}
      </AnimatePresence>
      <AnimatePresence>
        {isQuickSettingsOpen && <MobileQuickSettings />}
      </AnimatePresence>
    </div>
  );
}
