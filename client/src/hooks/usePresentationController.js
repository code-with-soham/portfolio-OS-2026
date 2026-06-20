import { useEffect, useRef } from 'react';
import { usePresentationStore, MODE_F9_PRESENTATION, MODE_F10_DEMO, MODE_NONE } from '../store/usePresentationStore';
import { useWindowStore } from '../store/useWindowStore';
import { useAnalyticsStore } from '../store/useAnalyticsStore';

export function usePresentationController() {
  const { activeMode, startPresentation, startDemo, stopAll, setStep, showHealthScore } = usePresentationStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const trackPresentationStart = useAnalyticsStore((s) => s.trackPresentationStart);
  const trackPresentationComplete = useAnalyticsStore((s) => s.trackPresentationComplete);
  const trackDemoStart = useAnalyticsStore((s) => s.trackDemoStart);
  const trackDemoComplete = useAnalyticsStore((s) => s.trackDemoComplete);
  
  const timerRefs = useRef([]);

  const clearTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const schedule = (delay, callback) => {
    const timer = setTimeout(callback, delay);
    timerRefs.current.push(timer);
  };

  // Run the F9 Guided Tour Sequence
  const runF9Sequence = () => {
    clearTimers();
    trackPresentationStart();
    startPresentation();

    // Step 1: Welcome is already set by startPresentation()
    // Step 2: Open Recruiter Dashboard (Highlighting to be added later inside the app)
    schedule(3000, () => {
      setStep(2, 'Opening Recruiter Dashboard...');
      openWindow('recruiter');
    });

    // Step 3: Open Projects App
    schedule(7000, () => {
      setStep(3, 'Opening Projects...\nHighlighting: Portfolio OS 2026');
      openWindow('projects');
    });

    // Step 4: Open VS Code
    schedule(11000, () => {
      setStep(4, 'Opening VS Code...\nHighlighting: Architecture, Features, Tech Stack');
      openWindow('vscode');
    });

    // Step 5: Open Browser -> Deployment
    schedule(15000, () => {
      setStep(5, 'Opening Browser to Live Deployments...');
      openWindow('browser', { initialUrl: 'portfolio://deployment' });
    });

    // Step 6: AI Assistant
    schedule(19000, () => {
      setStep(6, 'Opening AI Assistant...');
      import('../store/useDesktopStore').then(({ useDesktopStore }) => {
        if (!useDesktopStore.getState().isAIAssistantOpen) {
          useDesktopStore.getState().toggleAIAssistant();
        }
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('AI_AUTO_QUERY', { detail: "What is your strongest project?" }));
        }, 1000);
      });
    });

    // Final
    schedule(23000, () => {
      setStep(6, 'Presentation Complete\nPress F11 to Exit');
      trackPresentationComplete();
    });
  };

  // Run the F10 Auto Demo Sequence
  const runF10Sequence = () => {
    clearTimers();
    trackDemoStart();
    startDemo();

    // Step 1 is welcome
    schedule(4000, () => {
      setStep(2, 'Opening Recruiter Dashboard...');
      openWindow('recruiter');
    });

    schedule(8000, () => {
      setStep(3, 'Exploring Projects...\n(Portfolio OS, CampusHub...)');
      openWindow('projects');
    });

    schedule(12000, () => {
      setStep(4, 'Visualizing OS Layers...\n(Architecture Explorer)');
      openWindow('architecture');
    });

    schedule(16000, () => {
      setStep(5, 'Inspecting Codebase in VS Code...');
      openWindow('vscode');
    });

    schedule(20000, () => {
      setStep(6, 'Reviewing GitHub Analytics...');
      openWindow('browser', { initialUrl: 'https://github.com/code-with-soham' });
    });

    schedule(24000, () => {
      setStep(7, 'Consulting AI Assistant...');
      openWindow('aidashboard');
    });

    // Final WOW step
    schedule(29000, () => {
      setStep(7, 'Demo Complete.\nShowing Portfolio Health Score.');
      showHealthScore();
      trackDemoComplete();
    });
  };

  const killSequence = () => {
    clearTimers();
    stopAll();
  };

  // Expose the triggers
  return {
    runF9Sequence,
    runF10Sequence,
    killSequence
  };
}
