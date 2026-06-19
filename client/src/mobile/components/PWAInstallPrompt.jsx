import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Don't show immediately, maybe wait a bit or check if already dismissed
      if (!localStorage.getItem('pwa_prompt_dismissed')) {
        setTimeout(() => setIsVisible(true), 3000); // Show after 3s
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  // Only render if there's a prompt available
  if (!deferredPrompt) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '16px',
            right: '16px',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '20px',
            zIndex: 9999,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--color-accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>SK</div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Install Portfolio OS</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>Add to your Home Screen for a faster, full-screen native experience.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button onClick={handleInstall} style={{ flex: 1, padding: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600 }}>Install</button>
            <button onClick={handleDismiss} style={{ flex: 1, padding: '10px', background: 'var(--color-bg-surface-hover)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>Later</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
