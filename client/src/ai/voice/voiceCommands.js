import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useSystemAudioStore } from '../../store/useSystemAudioStore';
import { useMusicStore } from '../../store/useMusicStore';
import { aiBrain } from '../aiBrain';

// A mapping of explicit voice commands to system actions.
// This intercepts obvious commands before sending them to the general AI Brain,
// or defines specific complex macros.

export const processVoiceCommand = async (text) => {
  const lowerText = text.toLowerCase();
  
  const openWindow = useWindowStore.getState().openWindow;
  const { toggleStartMenu, toggleNotificationCenter, toggleQuickSettings } = useDesktopStore.getState();

  // Interview Mode Flow
  // We dynamically import useVoiceStore to avoid circular dependencies if it exists
  const state = await import('../../store/useVoiceStore').then(m => m.useVoiceStore.getState());
  if (state.interviewStep > 0) {
    let nextStep = state.interviewStep + 1;
    let response = "";
    if (state.interviewStep === 1) {
      response = "That's great. Question 2: Explain Portfolio OS.";
      state.setInterviewStep(nextStep);
    } else if (state.interviewStep === 2) {
      response = "Interesting architecture. Question 3: Why did you choose Zustand over Redux for state management?";
      state.setInterviewStep(nextStep);
    } else {
      response = "Thank you for sharing. That concludes our short mock interview!";
      state.setInterviewStep(0);
    }
    return response;
  }

  // Navigation
  if (lowerText.includes('open projects') || lowerText.includes('show projects')) {
    openWindow('projects');
    return "Opening Projects.";
  }
  if (lowerText.includes('open resume') || lowerText.includes('show resume')) {
    openWindow('resume');
    return "Opening Resume.";
  }
  if (lowerText.includes('open browser') || lowerText.includes('internet')) {
    openWindow('browser');
    return "Opening Browser.";
  }
  if (lowerText.includes('open vs code') || lowerText.includes('open code')) {
    openWindow('vscode');
    return "Opening VS Code.";
  }
  if (lowerText.includes('open architecture')) {
    openWindow('architecture');
    return "Opening Architecture Explorer.";
  }
  if (lowerText.includes('open recruiter') || lowerText.includes('dashboard')) {
    openWindow('devdashboard');
    return "Opening Recruiter Dashboard.";
  }
  if (lowerText.includes('weather')) {
    openWindow('weather');
    return "Opening Weather app.";
  }

  // System Commands
  if (lowerText.includes('lock screen')) {
    useDesktopStore.getState().setOSState('locked');
    return "Locking screen.";
  }
  if (lowerText.includes('open settings')) {
    openWindow('settings');
    return "Opening Settings.";
  }
  if (lowerText.includes('dark mode')) {
    useThemeStore.getState().setTheme('dark');
    return "Switched to dark mode.";
  }
  if (lowerText.includes('light mode')) {
    useThemeStore.getState().setTheme('light');
    return "Switched to light mode.";
  }

  // Window Commands
  if (lowerText.includes('show desktop')) {
    const windows = useWindowStore.getState().windows;
    windows.forEach(w => useWindowStore.getState().minimizeWindow(w.id));
    return "Showing desktop.";
  }

  // Music Commands
  if (lowerText.includes('play music')) {
    useMusicStore.getState().togglePlayPause();
    return "Toggling music playback.";
  }
  if (lowerText.includes('pause music')) {
    if (useMusicStore.getState().isPlaying) useMusicStore.getState().togglePlayPause();
    return "Pausing music.";
  }
  if (lowerText.includes('next song')) {
    useMusicStore.getState().nextSong();
    return "Playing next song.";
  }

  // Recruiter Mode Complex Commands
  if (lowerText.includes('start presentation') || lowerText.includes('start demo')) {
    window.dispatchEvent(new CustomEvent('START_AUTO_DEMO'));
    return "Starting narrated demo presentation.";
  }

  if (lowerText.includes('take me through your work') || lowerText.includes('show your best work') || lowerText.includes('explain architecture')) {
    // Macro: Open projects, open architecture, open vscode
    setTimeout(() => openWindow('projects'), 1000);
    setTimeout(() => openWindow('architecture'), 4000);
    setTimeout(() => openWindow('vscode'), 7000);
    return "I'd be happy to. Let me walk you through the Projects, the Architecture Explorer, and VS Code.";
  }

  if (lowerText.includes('interview me')) {
    import('../../store/useVoiceStore').then(({ useVoiceStore }) => {
      useVoiceStore.getState().setInterviewStep(1);
    });
    return "Starting interview mode. Question 1: Tell me about yourself.";
  }

  if (lowerText.includes('health score')) {
    openWindow('health'); // Assuming health center app is 'health' or similar
    return "Opening Health Center.";
  }

  if (lowerText.includes('github analytics')) {
    openWindow('github'); // Assuming github app is 'github'
    return "Opening GitHub Dashboard.";
  }

  if (lowerText.includes('placement journey')) {
    openWindow('timeline'); // Assuming journey is in timeline
    return "Opening Placement Journey Timeline.";
  }

  if (lowerText.includes('why hire soham')) {
    openWindow('aitwin'); // Assuming 'aitwin' is the AI Twin app
    return "I'll let the AI Twin explain why you should hire Soham.";
  }

  // If no direct macro matched, send to AI Brain
  const response = aiBrain.processInput(text);
  
  if (response.systemCommand === 'OPEN_APP') {
    // Already handled app opening in AI Brain if it triggered there, 
    // but we can rely on aiBrain returning the spoken string.
  }

  return response.response;
};
