export const fileTree = [
  {
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        isOpen: false,
        children: [
          { name: 'Button.jsx', type: 'file' },
          { name: 'Card.jsx', type: 'file' },
        ],
      },
      {
        name: 'App.jsx',
        type: 'file',
      },
      {
        name: 'index.css',
        type: 'file',
      },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];
