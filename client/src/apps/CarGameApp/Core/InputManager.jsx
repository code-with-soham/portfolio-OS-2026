// ============================================
// Car Experience — Input Manager
// ============================================
// Centralized handling of global shortcuts (F-keys).
import { useEffect } from 'react';
import { useSettingsStore } from '../Store/useSettingsStore';

export default function InputManager() {
  const toggleDeveloperOverlay = useSettingsStore((s) => s.toggleDeveloperOverlay);
  const toggleAssetInspector = useSettingsStore((s) => s.toggleAssetInspector);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'F3':
          e.preventDefault();
          toggleDeveloperOverlay();
          break;
        case 'F4':
          e.preventDefault();
          toggleAssetInspector();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDeveloperOverlay, toggleAssetInspector]);

  return null;
}
