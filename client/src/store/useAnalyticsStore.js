import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialMetrics = {
  openedApps: 0,
  viewedProjects: 0,
  resumeDownloads: 0,
  githubClicks: 0,
  aiQueries: 0,
  sessionDuration: 0,
  presentationStarted: 0,
  presentationCompleted: 0,
  demoStarted: 0,
  demoCompleted: 0,
};

export const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      lifetime: { ...initialMetrics },
      session: { ...initialMetrics },
      
      // Individual incrementers
      trackAppOpen: (appId) => set((state) => ({
        lifetime: { ...state.lifetime, openedApps: state.lifetime.openedApps + 1 },
        session: { ...state.session, openedApps: state.session.openedApps + 1 }
      })),

      trackProjectView: (projectId) => set((state) => ({
        lifetime: { ...state.lifetime, viewedProjects: state.lifetime.viewedProjects + 1 },
        session: { ...state.session, viewedProjects: state.session.viewedProjects + 1 }
      })),

      trackResumeDownload: () => set((state) => ({
        lifetime: { ...state.lifetime, resumeDownloads: state.lifetime.resumeDownloads + 1 },
        session: { ...state.session, resumeDownloads: state.session.resumeDownloads + 1 }
      })),

      trackGithubClick: () => set((state) => ({
        lifetime: { ...state.lifetime, githubClicks: state.lifetime.githubClicks + 1 },
        session: { ...state.session, githubClicks: state.session.githubClicks + 1 }
      })),

      trackAiQuery: () => set((state) => ({
        lifetime: { ...state.lifetime, aiQueries: state.lifetime.aiQueries + 1 },
        session: { ...state.session, aiQueries: state.session.aiQueries + 1 }
      })),

      trackPresentationStart: () => set((state) => ({
        lifetime: { ...state.lifetime, presentationStarted: state.lifetime.presentationStarted + 1 },
        session: { ...state.session, presentationStarted: state.session.presentationStarted + 1 }
      })),

      trackPresentationComplete: () => set((state) => ({
        lifetime: { ...state.lifetime, presentationCompleted: state.lifetime.presentationCompleted + 1 },
        session: { ...state.session, presentationCompleted: state.session.presentationCompleted + 1 }
      })),

      trackDemoStart: () => set((state) => ({
        lifetime: { ...state.lifetime, demoStarted: state.lifetime.demoStarted + 1 },
        session: { ...state.session, demoStarted: state.session.demoStarted + 1 }
      })),

      trackDemoComplete: () => set((state) => ({
        lifetime: { ...state.lifetime, demoCompleted: state.lifetime.demoCompleted + 1 },
        session: { ...state.session, demoCompleted: state.session.demoCompleted + 1 }
      })),

      // Reset session metrics (could be called on startup or explicitly)
      resetSession: () => set(() => ({
        session: { ...initialMetrics }
      }))
    }),
    {
      name: 'portfolio-os-analytics',
      storage: createJSONStorage(() => localStorage),
      // Only persist lifetime data and maybe some session, 
      // but usually session might be reset on hard refresh. 
      // We will persist both as the user requested "Lifetime + Session".
    }
  )
);
