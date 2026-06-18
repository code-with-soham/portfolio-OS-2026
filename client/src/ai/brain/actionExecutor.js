import { useWindowStore } from '../../store/useWindowStore';
import { useDesktopStore } from '../../store/useDesktopStore';

export function executeAction(intent, entities, intentData) {
  const windowStore = useWindowStore.getState();
  const desktopStore = useDesktopStore.getState();

  if (intent === 'OPEN_APP') {
    let appToOpen = intentData.app || entities.app || 'browser';
    
    // Pronoun resolution
    if (appToOpen === 'it') {
      // Default to projects if we were talking about projects or a specific project
      appToOpen = 'projects';
    }

    windowStore.openWindow(appToOpen);
    return `Opening ${appToOpen.charAt(0).toUpperCase() + appToOpen.slice(1)}...`;
  }

  if (intent === 'LOCK_SCREEN') {
    desktopStore.setLocked(true);
    return "Locking screen...";
  }

  if (intent === 'SHUTDOWN') {
    desktopStore.setPowerState('off');
    return "Shutting down the system...";
  }

  if (intent === 'RESTART') {
    desktopStore.setPowerState('restarting');
    return "Restarting the system...";
  }

  if (intent === 'PLAY_MUSIC') {
    windowStore.openWindow('music');
    return "Opening Music player. You can play your favorite tracks there!";
  }

  return null; // No action executed
}
