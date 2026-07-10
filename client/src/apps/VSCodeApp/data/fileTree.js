export const fileTree = [
  {
    name: 'SOHAM-KUNDU',
    type: 'folder',
    isOpen: true,
    isRoot: true,
    children: [
      {
        name: '.github',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'profile.json', type: 'file', path: '.github/profile.json' }],
      },
      {
        name: 'about',
        type: 'folder',
        isOpen: true,
        children: [
          { name: 'profile.yml', type: 'file', path: 'about/profile.yml' },
          { name: 'README.md', type: 'file', path: 'about/README.md' }
        ],
      },
      {
        name: 'achievements',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'timeline.log', type: 'file', path: 'achievements/timeline.log' }],
      },
      {
        name: 'analytics',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'telemetry.json', type: 'file', path: 'analytics/telemetry.json' }],
      },
      {
        name: 'assets',
        type: 'folder',
        isOpen: false,
        children: [],
      },
      {
        name: 'certifications',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'certificates.db', type: 'file', path: 'certifications/certificates.db' }],
      },
      {
        name: 'connect',
        type: 'folder',
        isOpen: false,
        children: [
          { name: 'api.tsx', type: 'file', path: 'connect/api.tsx' },
          { name: 'links.yml', type: 'file', path: 'connect/links.yml' }
        ],
      },
      {
        name: 'docs',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'architecture.md', type: 'file', path: 'docs/architecture.md' }],
      },
      {
        name: 'education',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'transcript.pdf', type: 'file', path: 'education/transcript.pdf' }],
      },
      {
        name: 'experience',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'history.log', type: 'file', path: 'experience/history.log' }],
      },
      {
        name: 'playground',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'scratchpad.js', type: 'file', path: 'playground/scratchpad.js' }],
      },
      {
        name: 'projects',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'portfolio.db', type: 'file', path: 'projects/portfolio.db' }],
      },
      {
        name: 'research',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'research.ipynb', type: 'file', path: 'research/research.ipynb' }],
      },
      {
        name: 'skills',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'skills.pkt', type: 'file', path: 'skills/skills.pkt' }],
      },
      {
        name: 'system',
        type: 'folder',
        isOpen: false,
        children: [
          { name: 'time.sys', type: 'file', path: 'system/time.sys' },
          { name: 'deployments.log', type: 'file', path: 'system/deployments.log' }
        ],
      },
      {
        name: 'terminal',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'bash_history', type: 'file', path: 'terminal/bash_history' }],
      },
      { name: '.gitignore', type: 'file', path: '.gitignore' },
      { name: 'resume.pdf', type: 'file', path: 'resume.pdf' },
      { name: 'LICENSE.txt', type: 'file', path: 'LICENSE.txt' }
    ],
  },
];
