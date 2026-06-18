import { useWindowStore } from '../../store/useWindowStore';
import { useDesktopStore } from '../../store/useDesktopStore';

export const actionRegistry = {
  openApp: (appId) => {
    const windowStore = useWindowStore.getState();
    windowStore.openWindow(appId);
    return `Opening ${appId.charAt(0).toUpperCase() + appId.slice(1)}...`;
  },
  
  lockScreen: () => {
    const desktopStore = useDesktopStore.getState();
    desktopStore.setLocked(true);
    return "Locking screen...";
  },
  
  shutdown: () => {
    const desktopStore = useDesktopStore.getState();
    desktopStore.setPowerState('off');
    return "Shutting down the system...";
  },
  
  restart: () => {
    const desktopStore = useDesktopStore.getState();
    desktopStore.setPowerState('restarting');
    return "Restarting the system...";
  },
  
  playMusic: () => {
    const windowStore = useWindowStore.getState();
    windowStore.openWindow('music');
    return "Opening Music player. You can play your favorite tracks there!";
  }
};
