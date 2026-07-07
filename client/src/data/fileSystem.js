// ============================================
// Portfolio OS 2026 — Virtual File System
// ============================================
// Static file system tree used by File Explorer.
// Redesigned for VS-EXPLORER PRO v3.0 (Windows 11 Hub).

export const FILE_SYSTEM = {
  name: 'Portfolio',
  type: 'folder',
  icon: 'computer',
  children: [
    {
      name: 'Projects',
      type: 'folder',
      icon: 'folder-projects',
      children: [
        {
          name: 'Portfolio OS 2026',
          type: 'folder',
          icon: 'folder',
          children: [
            { name: 'README.md', type: 'file', icon: 'markdown', size: '12 KB', modified: '2026-06-14', rating: '★★★★★' },
            { name: 'architecture.md', type: 'file', icon: 'markdown', size: '8 KB', modified: '2026-06-12', rating: '★★★★☆' },
            { name: 'package.json', type: 'file', icon: 'json', size: '1 KB', modified: '2026-06-14', rating: '★★★☆☆' },
          ],
        },
        {
          name: 'CampusHub',
          type: 'folder',
          icon: 'folder',
          children: [
            { name: 'CampusHub_Pitch.pdf', type: 'file', icon: 'pdf', size: '2 MB', modified: '2025-10-10', rating: '★★★★★' },
            { name: 'schema.prisma', type: 'file', icon: 'code', size: '4 KB', modified: '2025-10-05', rating: '★★★★☆' },
          ],
        },
        {
          name: 'Placement Predictor',
          type: 'folder',
          icon: 'folder',
          children: [
            { name: 'model.py', type: 'file', icon: 'python', size: '15 KB', modified: '2025-08-20', rating: '★★★★★' },
            { name: 'dataset.csv', type: 'file', icon: 'excel', size: '4.2 MB', modified: '2025-08-15', rating: '★★★☆☆' },
          ],
        },
      ],
    },
    {
      name: 'Resume',
      type: 'folder',
      icon: 'folder-resume',
      children: [
        {
          name: 'Soham_Resume_2026.pdf',
          type: 'file',
          icon: 'pdf',
          size: '138 KB',
          modified: '2026-06-14',
          appId: 'resume',
          rating: '★★★★★',
          atsScore: '96%'
        },
        { name: 'Cover_Letter_Template.docx', type: 'file', icon: 'word', size: '45 KB', modified: '2026-06-01', rating: '★★★☆☆' },
      ],
    },
    {
      name: 'Certificates',
      type: 'folder',
      icon: 'folder-certificates',
      children: [
        { name: 'AWS_Solutions_Architect.pdf', type: 'file', icon: 'pdf', size: '2.1 MB', modified: '2025-12-01', rating: '★★★★★' },
        { name: 'MongoDB_NodeJS_Developer.pdf', type: 'file', icon: 'pdf', size: '1.5 MB', modified: '2025-09-15', rating: '★★★★☆' },
        { name: 'Smart_India_Hackathon_Winner.png', type: 'file', icon: 'image', size: '4.5 MB', modified: '2024-11-20', rating: '★★★★★' },
      ],
    },
    {
      name: 'Skills',
      type: 'folder',
      icon: 'folder-skills',
      children: [
        { name: 'frontend.json', type: 'file', icon: 'json', size: '2 KB', modified: '2026-06-01', rating: '★★★★★' },
        { name: 'backend.json', type: 'file', icon: 'json', size: '2 KB', modified: '2026-06-01', rating: '★★★★☆' },
        { name: 'cloud.json', type: 'file', icon: 'json', size: '1 KB', modified: '2026-06-01', rating: '★★★★☆' },
      ],
    },
    {
      name: 'Architecture',
      type: 'folder',
      icon: 'folder-architecture',
      children: [
        { name: 'OS_Kernel_Diagram.png', type: 'file', icon: 'image', size: '1.2 MB', modified: '2026-06-10', rating: '★★★★★' },
        { name: 'Microservices_Flow.pdf', type: 'file', icon: 'pdf', size: '3.4 MB', modified: '2025-10-05', rating: '★★★★☆' },
      ],
    },
    {
      name: 'AI Models',
      type: 'folder',
      icon: 'folder-ai',
      children: [
        { name: 'llama_3_finetune.py', type: 'file', icon: 'python', size: '8 KB', modified: '2026-04-12', rating: '★★★★★' },
        { name: 'system_prompts.json', type: 'file', icon: 'json', size: '14 KB', modified: '2026-06-15', rating: '★★★★☆' },
      ],
    },
    {
      name: 'Deployments',
      type: 'folder',
      icon: 'folder-deployments',
      children: [
        { name: 'Vercel_Analytics.csv', type: 'file', icon: 'excel', size: '45 KB', modified: '2026-06-20', rating: '★★★★☆' },
        { name: 'Docker_Compose.yml', type: 'file', icon: 'yaml', size: '3 KB', modified: '2026-05-10', rating: '★★★★★' },
      ],
    },
    {
      name: 'Screenshots',
      type: 'folder',
      icon: 'folder-screenshots',
      children: [
        { name: 'hero_section_v1.png', type: 'file', icon: 'image', size: '5.2 MB', modified: '2026-02-10', rating: '★★★☆☆' },
        { name: 'hero_section_final.png', type: 'file', icon: 'image', size: '6.1 MB', modified: '2026-03-15', rating: '★★★★★' },
      ],
    },
  ],
};

/**
 * Resolve a path array to a node in the file system.
 * @param {string[]} pathParts - e.g., ['Portfolio', 'Projects']
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
