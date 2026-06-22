// ============================================
// Portfolio OS 2026 — App Registry
// ============================================
// Central configuration for all desktop applications.
// Each app entry maps to a lazy-loaded component, default window
// dimensions, and metadata for search/explorer integration.

import { ErrorBoundary } from '../components/common/ErrorBoundary';

import { lazy, Suspense } from 'react';

// App components (Lazy loaded for code splitting)
const AboutApp = lazy(() => import('../apps/AboutApp/index'));
const ProjectsApp = lazy(() => import('../apps/ProjectsApp/index'));
const SkillsApp = lazy(() => import('../apps/SkillsApp/index'));
const ResumeApp = lazy(() => import('../apps/ResumeApp/index'));
const TerminalApp = lazy(() => import('../apps/TerminalApp/index'));
const FileExplorerApp = lazy(() => import('../apps/FileExplorerApp/index'));
const SettingsApp = lazy(() => import('../apps/SettingsApp/index'));
const AboutOSApp = lazy(() => import('../apps/AboutOSApp/index'));
const ControlPanelApp = lazy(() => import('../apps/ControlPanelApp/index'));
const VSCodeApp = lazy(() => import('../apps/VSCodeApp/index'));
const MusicApp = lazy(() => import('../apps/MusicApp/index'));
const BrowserApp = lazy(() => import('../apps/BrowserApp/index'));
const MailApp = lazy(() => import('../apps/MailApp/index'));
const PhotosApp = lazy(() => import('../apps/PhotosApp/index'));
const CalculatorApp = lazy(() => import('../apps/CalculatorApp/index'));
const NotepadApp = lazy(() => import('../apps/NotepadApp/index'));
const RecycleBinApp = lazy(() => import('../apps/RecycleBinApp/index'));
const CalendarApp = lazy(() => import('../apps/CalendarApp/index'));
const PaintApp = lazy(() => import('../apps/PaintApp/index'));
const DeveloperDashboardApp = lazy(() => import('../apps/DeveloperDashboardApp/index'));
const AIDashboardApp = lazy(() => import('../apps/AIDashboardApp/index'));
const RecruiterApp = lazy(() => import('../apps/RecruiterApp/index'));
const AnalyticsCenterApp = lazy(() => import('../apps/AnalyticsCenterApp/index'));
const ArchitectureApp = lazy(() => import('../apps/ArchitectureApp/index'));
const PortfolioHealthApp = lazy(() => import('../apps/PortfolioHealthApp/index'));
const WeatherApp = lazy(() => import('../apps/WeatherApp/index'));

/**
 * Wrap a component in an ErrorBoundary so individual app crashes
 * don't bring down the entire OS shell.
 */
function withErrorBoundary(Component, appName) {
  return function WrappedApp(props) {
    return (
      <ErrorBoundary appName={appName}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            <div className="loading-spinner" style={{ marginRight: '12px', width: '20px', height: '20px', border: '2px solid var(--color-border)', borderTop: '2px solid var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            Loading {appName}...
          </div>
        }>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

import userIco from '../assets/icons/system/User.ico';
import projectsIco from '../assets/icons/system/Briefcase.ico';
import terminalIco from '../assets/icons/system/Windows_Terminal_logo.svg.ico';
import fileExplorerIco from '../assets/icons/system/Explorer.ico';
import settingsIco from '../assets/icons/system/Settings.ico';
import infoIco from '../assets/icons/system/Info.ico';
import pcIco from '../assets/icons/system/Computer.ico';
import controlPanelIco from '../assets/icons/system/Control Panel.ico';
import vscodeIco from '../assets/icons/apps/vscode.svg';
import musicIco from '../assets/icons/system/Folder Music.ico';
import recycleBinIco from '../assets/icons/system/Trash Empty.ico';

// New Custom Icons
import aboutIco from '../assets/icons/apps/icons8-about-me-48.png';
import skillsIco from '../assets/icons/apps/icons8-skill-48.png';
import resumeIco from '../assets/icons/apps/icons8-resume-64.png';
import browserIco from '../assets/icons/apps/icons8-chrome-48.png';
import mailIco from '../assets/icons/apps/icons8-gmail-48.png';
import photosIco from '../assets/icons/apps/icons8-photos-48.png';
import calculatorIco from '../assets/icons/apps/icons8-calculator-94.png';
import documentIco from '../assets/icons/apps/icons8-notepad-48.png';
import calendarIco from '../assets/icons/apps/icons8-google-calendar-100.png';
import paintIco from '../assets/icons/apps/icons8-paint-94.png';
import aiDashboardIco from '../assets/icons/apps/icons8-dashboard-60.png';
import aiAssistantIco from '../assets/icons/apps/icons8-gemini-ai-48.png';
import aboutOsIco from '../assets/icons/apps/icons8-windows-defender-50.png';

export const APPS = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: aboutIco,
    component: withErrorBoundary(AboutApp, 'About Me'),
    defaultWidth: 600,
    defaultHeight: 550,
    category: 'Portfolio',
    version: '1.0.0',
    description: 'Profile, bio, social links, and timeline',
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: projectsIco,
    component: withErrorBoundary(ProjectsApp, 'Projects'),
    defaultWidth: 800,
    defaultHeight: 600,
    category: 'Portfolio',
    version: '1.0.0',
    description: 'Browse all projects with search and filters',
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    icon: skillsIco,
    component: withErrorBoundary(SkillsApp, 'Skills'),
    defaultWidth: 650,
    defaultHeight: 500,
    category: 'Portfolio',
    version: '1.0.0',
    description: 'Tech stack with proficiency levels',
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: terminalIco,
    component: withErrorBoundary(TerminalApp, 'Terminal'),
    defaultWidth: 700,
    defaultHeight: 450,
    category: 'System',
    version: '1.0.0',
    description: 'Command-line interface with real commands',
  },
  resume: {
    id: 'resume',
    title: 'Resume',
    icon: resumeIco,
    component: withErrorBoundary(ResumeApp, 'Resume'),
    defaultWidth: 800,
    defaultHeight: 900,
    category: 'Portfolio',
    version: '1.0.0',
    description: 'View and download resume PDF',
  },
  fileexplorer: {
    id: 'fileexplorer',
    title: 'File Explorer',
    icon: fileExplorerIco,
    component: withErrorBoundary(FileExplorerApp, 'File Explorer'),
    defaultWidth: 750,
    defaultHeight: 500,
    category: 'System',
    version: '1.0.0',
    description: 'Browse virtual file system',
  },
  mypc: {
    id: 'mypc',
    title: 'This PC',
    icon: pcIco,
    component: withErrorBoundary(FileExplorerApp, 'This PC'),
    defaultWidth: 750,
    defaultHeight: 500,
    category: 'System',
    version: '1.0.0',
    description: 'View drives and devices',
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: settingsIco,
    component: withErrorBoundary(SettingsApp, 'Settings'),
    defaultWidth: 700,
    defaultHeight: 500,
    category: 'System',
    version: '1.0.0',
    description: 'Theme, accent color, and system preferences',
  },
  controlpanel: {
    id: 'controlpanel',
    title: 'Task Manager',
    icon: controlPanelIco,
    component: withErrorBoundary(ControlPanelApp, 'Task Manager'),
    defaultWidth: 750,
    defaultHeight: 550,
    category: 'System',
    version: '1.0.0',
    description: 'System Monitoring',
  },
  aboutos: {
    id: 'aboutos',
    title: 'About Portfolio OS',
    icon: aboutOsIco,
    component: withErrorBoundary(AboutOSApp, 'About Portfolio OS'),
    defaultWidth: 400,
    defaultHeight: 450,
  },
  vscode: {
    id: 'vscode',
    title: 'VS Code',
    icon: vscodeIco,
    component: withErrorBoundary(VSCodeApp, 'VS Code'),
    defaultWidth: 800,
    defaultHeight: 600,
    category: 'Development',
    version: '1.0.0',
    description: 'Code Editor',
  },
  music: {
    id: 'music',
    title: 'Music Player',
    icon: musicIco,
    component: withErrorBoundary(MusicApp, 'Music Player'),
    defaultWidth: 800,
    defaultHeight: 500,
    category: 'Entertainment',
    version: '1.0.0',
    description: 'Listen to local tunes',
  },
  browser: {
    id: 'browser',
    title: 'Web Browser',
    icon: browserIco,
    component: withErrorBoundary(BrowserApp, 'Web Browser'),
    defaultWidth: 900,
    defaultHeight: 650,
    category: 'Internet',
    version: '1.0.0',
    description: 'Browse the web and internal apps',
    hideTitleBar: true,
  },
  mail: {
    id: 'mail',
    title: 'Mail',
    icon: mailIco,
    component: withErrorBoundary(MailApp, 'Mail'),
    defaultWidth: 850,
    defaultHeight: 600,
    category: 'Communication',
    version: '1.0.0',
    description: 'Email client with mock recruiter emails',
  },
  photos: {
    id: 'photos',
    title: 'Photos',
    icon: photosIco,
    component: withErrorBoundary(PhotosApp, 'Photos'),
    defaultWidth: 900,
    defaultHeight: 650,
    category: 'Entertainment',
    version: '1.0.0',
    description: 'Image gallery and slideshow',
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    icon: calculatorIco,
    component: withErrorBoundary(CalculatorApp, 'Calculator'),
    defaultWidth: 400,
    defaultHeight: 600,
    category: 'Utilities',
    version: '1.0.0',
    description: 'Standard, Scientific, and Programmer calculator',
  },
  notepad: {
    id: 'notepad',
    title: 'Notepad',
    icon: documentIco,
    component: withErrorBoundary(NotepadApp, 'Notepad'),
    defaultWidth: 800,
    defaultHeight: 600,
    category: 'Productivity',
    version: '1.0.0',
    description: 'Simple text editor with Markdown support',
  },
  calendar: {
    id: 'calendar',
    title: 'Calendar',
    icon: calendarIco,
    component: withErrorBoundary(CalendarApp, 'Calendar'),
    defaultWidth: 900,
    defaultHeight: 650,
    category: 'Productivity',
    version: '1.0.0',
    description: 'Keep track of your events and schedules',
  },
  paint: {
    id: 'paint',
    title: 'Paint',
    icon: paintIco,
    component: withErrorBoundary(PaintApp, 'Paint'),
    defaultWidth: 800,
    defaultHeight: 600,
    category: 'Accessories',
    version: '1.0.0',
    description: 'Create and edit drawings',
    hideTitleBar: true,
  },
  recyclebin: {
    id: 'recyclebin',
    title: 'Recycle Bin',
    icon: recycleBinIco,
    component: withErrorBoundary(RecycleBinApp, 'Recycle Bin'),
    defaultWidth: 800,
    defaultHeight: 600,
    category: 'System',
    version: '1.0.0',
    description: 'Manage deleted files',
  },
  devdashboard: {
    id: 'devdashboard',
    title: 'Developer Dashboard',
    icon: infoIco,
    component: withErrorBoundary(DeveloperDashboardApp, 'Developer Dashboard'),
    defaultWidth: 900,
    defaultHeight: 700,
    category: 'Development',
    version: '1.0.0',
    description: 'Recruiter Showcase Mode Metrics',
  },
  aidashboard: {
    id: 'aidashboard',
    title: 'AI Dashboard',
    icon: aiDashboardIco,
    component: withErrorBoundary(AIDashboardApp, 'AI Dashboard'),
    defaultWidth: 900,
    defaultHeight: 700,
    category: 'System',
    version: '1.0.0',
    description: 'AI Expert Brain Metrics',
  },
  recruiter: {
    id: 'recruiter',
    title: 'Recruiter Dashboard',
    icon: userIco, // Reusing user icon for now
    component: withErrorBoundary(RecruiterApp, 'Recruiter Dashboard'),
    defaultWidth: 1000,
    defaultHeight: 700,
    category: 'Showcase',
    version: '1.0.0',
    description: 'Exclusive Recruiter Workspace',
    hideTitleBar: false,
  },
  analytics: {
    id: 'analytics',
    title: 'Analytics Center',
    icon: infoIco,
    component: withErrorBoundary(AnalyticsCenterApp, 'Analytics Center'),
    defaultWidth: 900,
    defaultHeight: 650,
    category: 'System',
    version: '1.0.0',
    description: 'Real-time telemetry and metrics',
  },
  architecture: {
    id: 'architecture',
    title: 'Architecture Explorer',
    icon: infoIco, // Using info/layer icon
    component: withErrorBoundary(ArchitectureApp, 'Architecture Explorer'),
    defaultWidth: 1000,
    defaultHeight: 700,
    category: 'Showcase',
    version: '1.0.0',
    description: 'Visualizing the OS layers',
  },
  portfoliohealth: {
    id: 'portfoliohealth',
    title: 'Portfolio Health',
    icon: infoIco, // Or a health icon
    component: withErrorBoundary(PortfolioHealthApp, 'Portfolio Health'),
    defaultWidth: 900,
    defaultHeight: 700,
    category: 'Showcase',
    version: '1.0.0',
    description: 'Real-time Portfolio Analysis',
  },
  weather: {
    id: 'weather',
    title: 'Weather Pro',
    icon: '☀️',
    component: withErrorBoundary(WeatherApp, 'Weather Pro'),
    defaultWidth: 1000,
    defaultHeight: 750,
    category: 'System',
    version: '2.0.0',
    description: 'Premium live weather radar and forecast',
  },
  voicecenter: {
    id: 'voicecenter',
    title: 'Voice Center',
    icon: aiAssistantIco, // Using emoji for now, or could use terminal/info icon
    component: withErrorBoundary(lazy(() => import('../apps/VoiceCenterApp/index')), 'Voice Center'),
    defaultWidth: 800,
    defaultHeight: 600,
    category: 'System',
    version: '1.0.0',
    description: 'VS-36 AI Voice Copilot History',
  },
};
