// ============================================
// Portfolio OS 2026 — Virtual File System
// ============================================
// Static file system tree used by File Explorer.
// Each node is either a 'folder' (has children) or a 'file'.
// Files can have an associated appId to open on double-click.

export const FILE_SYSTEM = {
  name: 'Desktop',
  type: 'folder',
  icon: '🖥️',
  children: [
    {
      name: 'Projects',
      type: 'folder',
      icon: '📁',
      children: [
        {
          name: 'Portfolio OS 2026',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'README.md', type: 'file', icon: '📝', size: '4 KB', modified: '2026-06-14' },
            { name: 'package.json', type: 'file', icon: '📦', size: '1 KB', modified: '2026-06-14' },
            { name: 'architecture.md', type: 'file', icon: '📝', size: '8 KB', modified: '2026-06-12' },
          ],
        },
        {
          name: 'HealthSathi AI',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'README.md', type: 'file', icon: '📝', size: '6 KB', modified: '2026-05-20' },
            { name: 'app.py', type: 'file', icon: '🐍', size: '12 KB', modified: '2026-05-18' },
          ],
        },
        {
          name: 'DevCollab Platform',
          type: 'folder',
          icon: '📁',
          children: [
            { name: 'README.md', type: 'file', icon: '📝', size: '5 KB', modified: '2025-12-15' },
          ],
        },
      ],
    },
    {
      name: 'Certificates',
      type: 'folder',
      icon: '📁',
      children: [
        { name: 'Best_Project_Award.pdf', type: 'file', icon: '🏆', size: '2 MB', modified: '2026-05-15' },
        { name: 'Coding_Competition_1st.pdf', type: 'file', icon: '🥇', size: '1.5 MB', modified: '2023-11-20' },
        { name: 'GitHub_500_Contributions.png', type: 'file', icon: '🖼️', size: '450 KB', modified: '2026-01-01' },
      ],
    },
    {
      name: 'Resume',
      type: 'folder',
      icon: '📁',
      children: [
        {
          name: 'Soham_June_Resume_1_Page.pdf',
          type: 'file',
          icon: '📄',
          size: '138 KB',
          modified: '2026-06-14',
          appId: 'resume', // Double-click opens Resume app
        },
        { name: 'Cover_Letter_Template.docx', type: 'file', icon: '📝', size: '45 KB', modified: '2026-06-01' },
      ],
    },
    {
      name: 'Photos',
      type: 'folder',
      icon: '📁',
      children: [
        { name: 'profile_photo.jpg', type: 'file', icon: '🖼️', size: '1.2 MB', modified: '2026-03-10' },
        { name: 'hackathon_2025.jpg', type: 'file', icon: '🖼️', size: '3.4 MB', modified: '2025-11-05' },
        { name: 'college_campus.jpg', type: 'file', icon: '🖼️', size: '2.8 MB', modified: '2024-09-15' },
      ],
    },
    {
      name: 'Notes',
      type: 'folder',
      icon: '📁',
      children: [
        { name: 'todo.txt', type: 'file', icon: '📝', size: '2 KB', modified: '2026-06-14',
          content: '- Build Phase 5 applications\n- Add search to Start Menu\n- Polish Terminal commands\n- Deploy to production' },
        { name: 'ideas.txt', type: 'file', icon: '📝', size: '3 KB', modified: '2026-06-10',
          content: '- AI chat assistant inside Portfolio OS\n- Music player app\n- Calculator app\n- Paint app with canvas API' },
        { name: 'learning_log.txt', type: 'file', icon: '📝', size: '5 KB', modified: '2026-06-08' },
      ],
    },
    {
      name: 'Downloads',
      type: 'folder',
      icon: '📁',
      children: [],
    },
  ],
};

/**
 * Resolve a path array to a node in the file system.
 * @param {string[]} pathParts - e.g., ['Desktop', 'Projects']
 * @returns {object|null} The node at that path, or null
 */
export function resolveNode(pathParts) {
  if (!pathParts.length) return FILE_SYSTEM;

  let current = FILE_SYSTEM;

  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === current.name && i === 0) continue;

    if (!current.children) return null;

    const found = current.children.find((c) => c.name === pathParts[i]);
    if (!found) return null;
    current = found;
  }

  return current;
}
