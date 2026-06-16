// ============================================
// Portfolio OS 2026 — App Registry
// ============================================
// Central configuration for all desktop applications.
// Each app entry maps to a lazy-loaded component, default window
// dimensions, and metadata for search/explorer integration.

import { ErrorBoundary } from '../components/common/ErrorBoundary';

// App components (direct imports — Vite handles tree-shaking)
import AboutApp from '../apps/AboutApp/index';
import ProjectsApp from '../apps/ProjectsApp/index';
import SkillsApp from '../apps/SkillsApp/index';
import ResumeApp from '../apps/ResumeApp/index';
import TerminalApp from '../apps/TerminalApp/index';
import FileExplorerApp from '../apps/FileExplorerApp/index';
import SettingsApp from '../apps/SettingsApp/index';
import AboutOSApp from '../apps/AboutOSApp/index';
import VSCodeApp from '../apps/VSCodeApp/index';

/**
 * Wrap a component in an ErrorBoundary so individual app crashes
 * don't bring down the entire OS shell.
 */
function withErrorBoundary(Component, appName) {
  return function WrappedApp(props) {
    return (
      <ErrorBoundary appName={appName}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

import userIco from '../assets/icons/system/User.ico';
import projectsIco from '../assets/icons/system/Briefcase.ico';
import skillsIco from '../assets/icons/system/Hardware.ico';
import terminalIco from '../assets/icons/system/Windows_Terminal_logo.svg.ico';
import resumeIco from '../assets/icons/system/Notes.ico';
import fileExplorerIco from '../assets/icons/system/Explorer.ico';
import settingsIco from '../assets/icons/system/Settings.ico';
import infoIco from '../assets/icons/system/Info.ico';
import pcIco from '../assets/icons/system/Computer.ico';
import vscodeIco from '../assets/icons/apps/vscode.svg';

export const APPS = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: userIco,
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
  aboutos: {
    id: 'aboutos',
    title: 'About Portfolio OS',
    icon: infoIco,
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
};
