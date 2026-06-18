import { actionRegistry } from '../actions/actionRegistry';
import { INTENTS } from '../training/intents';
import { useAIAnalyticsStore } from '../../store/useAIAnalyticsStore';

export function executeAction(intent, entities, intentData, contextManager) {
  // If it's a multi-step workflow
  if (intent === INTENTS.PREPARE_RECRUITER) {
    return [
      { action: () => actionRegistry.openApp('resume'), delay: 0 },
      { action: () => actionRegistry.openApp('projects'), delay: 300 },
      { action: () => actionRegistry.openApp('skills'), delay: 600 },
      { action: () => actionRegistry.openApp('vscode'), delay: 900 }
    ];
  }

  if (intent === INTENTS.SHOW_STRONGEST_WORK) {
    return [
      { action: () => actionRegistry.openApp('projects'), delay: 0 },
      // Later we can add a way to dispatch events to the Projects app to highlight Portfolio OS
    ];
  }

  // Single steps
  if (intent === INTENTS.OPEN_APP) {
    let appToOpen = intentData.app || entities.app || 'browser';
    
    // Pronoun or positional resolution
    if (appToOpen === 'it' || entities.positional !== undefined) {
      const lastIntent = contextManager.getLastIntent();
      const listedProjects = contextManager.getMemory('listedProjects');
      
      if (entities.positional !== undefined && listedProjects && listedProjects.length > 0) {
        // Resolve positional from the listed projects
        let idx = entities.positional;
        if (idx === -1) idx = listedProjects.length - 1; // last
        
        if (idx >= 0 && idx < listedProjects.length) {
          appToOpen = 'projects';
          contextManager.setMemory('lastOpenedApp', appToOpen);
          useAIAnalyticsStore.getState().trackAppOpen(appToOpen);
          return [{ action: () => actionRegistry.openApp(appToOpen), delay: 0 }];
        }
      }

      if (lastIntent === INTENTS.PROJECTS) appToOpen = 'projects';
      else if (lastIntent === INTENTS.RESUME) appToOpen = 'resume';
      else if (lastIntent === INTENTS.SKILLS) appToOpen = 'skills';
      else appToOpen = 'projects'; // fallback
    }

    // Memory tracking
    contextManager.setMemory('lastOpenedApp', appToOpen);
    useAIAnalyticsStore.getState().trackAppOpen(appToOpen);
    return [{ action: () => actionRegistry.openApp(appToOpen), delay: 0 }];
  }

  if (intent === INTENTS.LOCK_SCREEN) return [{ action: () => actionRegistry.lockScreen(), delay: 0 }];
  if (intent === INTENTS.SHUTDOWN) return [{ action: () => actionRegistry.shutdown(), delay: 0 }];
  if (intent === INTENTS.RESTART) return [{ action: () => actionRegistry.restart(), delay: 0 }];
  if (intent === INTENTS.PLAY_MUSIC) return [{ action: () => actionRegistry.playMusic(), delay: 0 }];

  return null; // No actions
}
