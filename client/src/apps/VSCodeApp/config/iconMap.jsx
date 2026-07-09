import { Icon } from '@iconify/react';
import { DocumentTextRegular, FolderRegular, FolderOpenRegular } from '@fluentui/react-icons';

const ICON_SIZE = 16;

const FOLDER_ICONS = {
  about: 'vscode-icons:folder-type-user',
  projects: 'vscode-icons:folder-type-project',
  skills: 'vscode-icons:folder-type-tools',
  research: 'vscode-icons:folder-type-science',
  achievements: 'vscode-icons:folder-type-log',
  connect: 'vscode-icons:folder-type-api',
  '.github': 'vscode-icons:folder-type-github',
  src: 'vscode-icons:folder-type-src',
  components: 'vscode-icons:folder-type-components',
  config: 'vscode-icons:folder-type-config',
};

const FILE_ICONS = {
  md: 'vscode-icons:file-type-markdown',
  yml: 'vscode-icons:file-type-yaml',
  json: 'vscode-icons:file-type-json',
  db: 'vscode-icons:file-type-database',
  ipynb: 'vscode-icons:file-type-jupyter',
  log: 'vscode-icons:file-type-log',
  txt: 'vscode-icons:file-type-text',
  gitignore: 'vscode-icons:file-type-git',
  js: 'vscode-icons:file-type-node',
  jsx: 'vscode-icons:file-type-reactjs',
};

// Extracted special filenames (like .gitignore or LICENSE.txt) mapping
const EXACT_FILE_ICONS = {
  '.gitignore': 'vscode-icons:file-type-git',
  'LICENSE.txt': 'vscode-icons:file-type-license',
  'Welcome': 'vscode-icons:default-file',
};

export const getFolderIcon = (folderName, isOpen) => {
  const iconId = FOLDER_ICONS[folderName.toLowerCase()];
  
  // Return the mapped icon, or fallback to fluent icons
  if (iconId) {
    const iconToRender = isOpen ? `${iconId}-opened` : iconId;
    return <Icon icon={iconToRender} width={ICON_SIZE} height={ICON_SIZE} fallback={isOpen ? <FolderOpenRegular /> : <FolderRegular />} />;
  }

  // Fallback default
  return isOpen ? <FolderOpenRegular style={{ color: '#dcb67a' }} /> : <FolderRegular style={{ color: '#dcb67a' }} />;
};

export const getFileIcon = (filename) => {
  // First check exact matches
  if (EXACT_FILE_ICONS[filename]) {
    return <Icon icon={EXACT_FILE_ICONS[filename]} width={ICON_SIZE} height={ICON_SIZE} fallback={<DocumentTextRegular />} />;
  }

  // Then check extensions
  const parts = filename.split('.');
  if (parts.length > 1) {
    const ext = parts.pop().toLowerCase();
    if (FILE_ICONS[ext]) {
      return <Icon icon={FILE_ICONS[ext]} width={ICON_SIZE} height={ICON_SIZE} fallback={<DocumentTextRegular />} />;
    }
  }

  // Fallback default
  return <DocumentTextRegular style={{ color: '#cccccc' }} />;
};
