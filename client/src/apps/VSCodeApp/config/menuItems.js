export const MENU_ITEMS = {
  File: [
    { label: 'New File', id: 'new-file', shortcut: 'Ctrl+N' },
    { label: 'Open File...', id: 'open-file', shortcut: 'Ctrl+O' },
    { label: 'Open Folder...', id: 'open-folder', shortcut: 'Ctrl+K Ctrl+O' },
    { divider: true },
    { label: 'Save', id: 'save', shortcut: 'Ctrl+S' },
    { label: 'Save All', id: 'save-all' },
    { divider: true },
    { label: 'Close Editor', id: 'close-editor', shortcut: 'Ctrl+W' },
    { label: 'Close All Editors', id: 'close-all' },
    { divider: true },
    { label: 'Exit', id: 'exit', shortcut: 'Alt+F4' }
  ],
  Edit: [
    { label: 'Undo', id: 'undo', shortcut: 'Ctrl+Z' },
    { label: 'Redo', id: 'redo', shortcut: 'Ctrl+Y' },
    { divider: true },
    { label: 'Cut', id: 'cut', shortcut: 'Ctrl+X' },
    { label: 'Copy', id: 'copy', shortcut: 'Ctrl+C' },
    { label: 'Paste', id: 'paste', shortcut: 'Ctrl+V' },
    { divider: true },
    { label: 'Find', id: 'find', shortcut: 'Ctrl+F' },
    { label: 'Replace', id: 'replace', shortcut: 'Ctrl+H' }
  ],
  Selection: [
    { label: 'Select All', id: 'select-all', shortcut: 'Ctrl+A' },
    { label: 'Expand Selection', id: 'expand-selection', shortcut: 'Shift+Alt+Right' },
    { label: 'Shrink Selection', id: 'shrink-selection', shortcut: 'Shift+Alt+Left' },
    { divider: true },
    { label: 'Duplicate Line Down', id: 'duplicate-line', shortcut: 'Shift+Alt+Down' },
    { label: 'Move Line Up', id: 'move-line-up', shortcut: 'Alt+Up' },
    { label: 'Move Line Down', id: 'move-line-down', shortcut: 'Alt+Down' }
  ],
  View: [
    { label: 'Command Palette...', id: 'command-palette', shortcut: 'Ctrl+Shift+P' },
    { divider: true },
    { label: 'Explorer', id: 'view-explorer', shortcut: 'Ctrl+Shift+E' },
    { label: 'Search', id: 'view-search', shortcut: 'Ctrl+Shift+F' },
    { label: 'Source Control', id: 'view-git', shortcut: 'Ctrl+Shift+G' },
    { label: 'Run & Debug', id: 'view-debug', shortcut: 'Ctrl+Shift+D' },
    { label: 'Extensions', id: 'view-extensions', shortcut: 'Ctrl+Shift+X' },
    { divider: true },
    { label: 'Problems', id: 'view-problems', shortcut: 'Ctrl+Shift+M' },
    { label: 'Terminal', id: 'view-terminal', shortcut: 'Ctrl+`' }
  ],
  Go: [
    { label: 'Back', id: 'go-back', shortcut: 'Alt+Left' },
    { label: 'Forward', id: 'go-forward', shortcut: 'Alt+Right' },
    { divider: true },
    { label: 'Go to File...', id: 'go-to-file', shortcut: 'Ctrl+P' },
    { label: 'Go to Symbol...', id: 'go-to-symbol', shortcut: 'Ctrl+Shift+O' }
  ],
  Run: [
    { label: 'Start Debugging', id: 'run-start', shortcut: 'F5' },
    { label: 'Run Without Debugging', id: 'run-without', shortcut: 'Ctrl+F5' },
    { divider: true },
    { label: 'Run Project', id: 'run-project' },
    { label: 'Build Project', id: 'build-project' },
    { label: 'Deploy', id: 'deploy-project' }
  ],
  Terminal: [
    { label: 'New Terminal', id: 'terminal-new', shortcut: 'Ctrl+Shift+`' },
    { label: 'Split Terminal', id: 'terminal-split', shortcut: 'Ctrl+Shift+5' },
    { divider: true },
    { label: 'Clear Terminal', id: 'terminal-clear' },
    { label: 'Kill Terminal', id: 'terminal-kill' }
  ],
  Help: [
    { label: 'Documentation', id: 'help-docs' },
    { label: 'Keyboard Shortcuts Reference', id: 'help-shortcuts', shortcut: 'Ctrl+K Ctrl+R' },
    { divider: true },
    { label: 'About Portfolio OS', id: 'help-about' }
  ]
};
