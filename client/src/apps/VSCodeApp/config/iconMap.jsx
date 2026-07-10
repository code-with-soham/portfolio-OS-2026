import React from 'react';
import { Icon } from '@iconify/react';
import { 
  DocumentTextRegular, 
  FolderRegular, 
  FolderOpenRegular,
  Person24Regular,
  CodeBlock24Regular,
  FolderOpen24Regular,
  Beaker24Regular,
  Trophy24Regular,
  Globe24Regular,
  Desktop24Regular,
  History24Regular,
  HatGraduation24Regular,
  DataHistogram24Regular,
  Certificate24Regular,
  Briefcase24Regular,
  Play24Regular,
  Image24Regular
} from '@fluentui/react-icons';

const ICON_SIZE = 16;

const FOLDER_COLORS = {
  about: '#00bcd4', // Cyan
  projects: '#ff9800', // Orange
  research: '#9c27b0', // Purple
  achievements: '#4caf50', // Green
  skills: '#2196f3', // Blue
  connect: '#009688', // Teal
  system: '#9e9e9e', // Gray
  analytics: '#3f51b5', // Indigo
  education: '#ffeb3b', // Yellow
  docs: '#ffffff', // White
  certifications: '#ffc107',
  experience: '#795548',
  playground: '#e91e63',
  assets: '#8bc34a',
  terminal: '#607d8b'
};

const FOLDER_ICONS_MAP = {
  about: <Person24Regular />,
  skills: <CodeBlock24Regular />,
  projects: <FolderOpen24Regular />,
  research: <Beaker24Regular />,
  achievements: <Trophy24Regular />,
  connect: <Globe24Regular />,
  system: <Desktop24Regular />,
  analytics: <DataHistogram24Regular />,
  education: <HatGraduation24Regular />,
  docs: <DocumentTextRegular />,
  certifications: <Certificate24Regular />,
  experience: <Briefcase24Regular />,
  playground: <Play24Regular />,
  assets: <Image24Regular />,
  terminal: <Desktop24Regular />
};

const FILE_ICONS = {
  md: 'vscode-icons:file-type-markdown',
  yml: 'vscode-icons:file-type-yaml',
  json: 'vscode-icons:file-type-json',
  db: 'vscode-icons:file-type-sqlite',
  ipynb: 'vscode-icons:file-type-jupyter',
  log: 'vscode-icons:file-type-log',
  txt: 'vscode-icons:file-type-text',
  gitignore: 'vscode-icons:file-type-git',
  js: 'vscode-icons:file-type-node',
  jsx: 'vscode-icons:file-type-reactjs',
  tsx: 'vscode-icons:file-type-reactts',
  pkt: 'vscode-icons:file-type-npm',
  sys: 'vscode-icons:file-type-system'
};

const EXACT_FILE_ICONS = {
  '.gitignore': 'vscode-icons:file-type-git',
  'LICENSE.txt': 'vscode-icons:file-type-license',
  'Welcome': 'vscode-icons:default-file',
  'profile.yml': 'vscode-icons:file-type-yaml',
  'skills.pkt': 'vscode-icons:file-type-npm',
  'time.sys': 'vscode-icons:file-type-system',
  'deployments.log': 'vscode-icons:file-type-log'
};

export const getFolderIcon = (folderName, isOpen) => {
  const name = folderName.toLowerCase();
  const iconComponent = FOLDER_ICONS_MAP[name];
  const color = FOLDER_COLORS[name] || '#dcb67a';

  if (iconComponent) {
    return (
      <div style={{ color, display: 'inline-flex', alignItems: 'center', width: ICON_SIZE, height: ICON_SIZE }}>
        {React.cloneElement(iconComponent, { style: { width: '100%', height: '100%' } })}
      </div>
    );
  }

  // Fallback default folder
  return isOpen ? <FolderOpenRegular style={{ color: '#dcb67a' }} /> : <FolderRegular style={{ color: '#dcb67a' }} />;
};

export const getFileIcon = (filename) => {
  if (EXACT_FILE_ICONS[filename]) {
    return <Icon icon={EXACT_FILE_ICONS[filename]} width={ICON_SIZE} height={ICON_SIZE} fallback={<DocumentTextRegular />} />;
  }

  const parts = filename.split('.');
  if (parts.length > 1) {
    const ext = parts.pop().toLowerCase();
    if (FILE_ICONS[ext]) {
      return <Icon icon={FILE_ICONS[ext]} width={ICON_SIZE} height={ICON_SIZE} fallback={<DocumentTextRegular />} />;
    }
  }

  return <DocumentTextRegular style={{ color: '#cccccc' }} />;
};
