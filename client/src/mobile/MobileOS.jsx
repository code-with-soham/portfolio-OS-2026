import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileStore } from './store/useMobileStore';

import MobileStatusBar from './components/MobileStatusBar';
import MobileBottomNav from './components/MobileBottomNav';
import MobileHomeScreen from './components/MobileHomeScreen';
import MobileQuickSettings from './components/MobileQuickSettings';
import MobileLockScreen from './components/MobileLockScreen';
import MobileSplashScreen from './components/MobileSplashScreen';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import MobileNotification from './components/MobileNotification';
import MobileRecruiterDashboard from './apps/MobileRecruiterDashboard';
import MobileAppSettings from './apps/MobileAppSettings';
import MobileWeatherApp from './apps/MobileWeatherApp';
import ProfileTab from './components/ProfileTab';

import './MobileOS.css';

export default function MobileOS() {
  const { isLocked, unlockDevice, activeApp, activeTab, isQuickSettingsOpen } = useMobileStore();
  const [showSplash, setShowSplash] = useState(true);

  // Disable default touch actions to prevent overscroll/pull-to-refresh on mobile
  useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
    
    // Check for PWA shortcuts from URL
    const params = new URLSearchParams(window.location.search);
    const appToOpen = params.get('app');
    if (appToOpen) {
      useMobileStore.getState().openApp(appToOpen);
      useMobileStore.getState().unlockDevice();
    }

    return () => {
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  const renderActiveTab = () => {
    if (activeApp === 'recruiter') return <MobileRecruiterDashboard />;
    if (activeApp === 'settings') return <MobileAppSettings />;
    if (activeApp === 'weather') return <MobileWeatherApp />;
    if (activeApp) return <div style={{ padding: '20px' }}>Rendering Lite App: {activeApp} <br/><br/> <button onClick={() => useMobileStore.getState().closeApp()}>Close App</button></div>;

    switch (activeTab) {
      case 'home':
        return <MobileHomeScreen />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <MobileHomeScreen />;
    }
  };

  if (showSplash) {
    return <MobileSplashScreen onComplete={() => setShowSplash(false)} />;
  }

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

      {/* Overlays */}
      {isLocked && <MobileLockScreen onUnlock={unlockDevice} />}
      <PWAInstallPrompt />
      <MobileNotification />
      
      <AnimatePresence>
        {isQuickSettingsOpen && <MobileQuickSettings />}
      </AnimatePresence>
    </div>
  );
}
