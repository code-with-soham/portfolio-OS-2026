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
        children: [{ name: 'profile.yml', type: 'file', path: '.github/profile.yml' }],
      },
      {
        name: 'about',
        type: 'folder',
        isOpen: true,
        children: [{ name: 'README.md', type: 'file', path: 'about/README.md' }],
      },
      {
        name: 'achievements',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'timeline.log', type: 'file', path: 'achievements/timeline.log' }],
      },
      {
        name: 'connect',
        type: 'folder',
        isOpen: false,
        children: [{ name: 'links.yml', type: 'file', path: 'connect/links.yml' }],
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
        children: [{ name: 'skills.yml', type: 'file', path: 'skills/skills.yml' }],
      },
      { name: '.gitignore', type: 'file', path: '.gitignore' },
      { name: 'LICENSE.txt', type: 'file', path: 'LICENSE.txt' },
      { name: 'CHANGELOG.md', type: 'file', path: 'CHANGELOG.md' },
    ],
  },
];
