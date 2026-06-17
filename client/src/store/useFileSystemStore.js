import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FILE_SYSTEM as DEFAULT_FILE_SYSTEM } from '../data/fileSystem';

// Helper to deeply clone the file system tree
const cloneTree = (node) => JSON.parse(JSON.stringify(node));

// Helper to find a node based on an array of path parts
const findNode = (tree, pathParts) => {
  if (!pathParts || pathParts.length === 0) return tree;
  
  let current = tree;
  for (let i = 0; i < pathParts.length; i++) {
    if (pathParts[i] === current.name && i === 0) continue;
    if (!current.children) return null;
    const found = current.children.find((c) => c.name === pathParts[i]);
    if (!found) return null;
    current = found;
  }
  return current;
};

// Helper to format dates
const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const useFileSystemStore = create(
  persist(
    (set, get) => ({
      fileSystem: DEFAULT_FILE_SYSTEM,
      deletedItems: [],

      // Read a node
      getNode: (pathParts) => {
        return findNode(get().fileSystem, pathParts);
      },

      // Create a new file or folder
      createItem: (parentPathParts, newItem) => {
        set((state) => {
          const newFS = cloneTree(state.fileSystem);
          const parent = findNode(newFS, parentPathParts);
          
          if (parent && parent.type === 'folder') {
            // Check if exists
            const exists = parent.children.find(c => c.name === newItem.name);
            if (!exists) {
              parent.children.push({
                ...newItem,
                modified: getTodayDateString(),
                created: getTodayDateString(),
              });
            }
          }
          return { fileSystem: newFS };
        });
      },

      // Update existing file content
      updateFileContent: (pathParts, content) => {
        set((state) => {
          const newFS = cloneTree(state.fileSystem);
          const file = findNode(newFS, pathParts);
          if (file && file.type === 'file') {
            file.content = content;
            file.modified = getTodayDateString();
            file.size = `${Math.max(1, Math.ceil(content.length / 1024))} KB`;
          }
          return { fileSystem: newFS };
        });
      },

      // Delete item
      deleteItem: (pathParts, permanent = false) => {
        if (!pathParts || pathParts.length <= 1) return; // Cannot delete root
        set((state) => {
          const newFS = cloneTree(state.fileSystem);
          const parentPath = pathParts.slice(0, -1);
          const targetName = pathParts[pathParts.length - 1];
          const parent = findNode(newFS, parentPath);
          
          let updatedDeletedItems = [...state.deletedItems];

          if (parent && parent.children) {
            const targetIndex = parent.children.findIndex(c => c.name === targetName);
            if (targetIndex > -1) {
              const [deletedNode] = parent.children.splice(targetIndex, 1);
              if (!permanent) {
                updatedDeletedItems.push({
                  ...deletedNode,
                  originalPath: pathParts,
                  deletedAt: new Date().toISOString()
                });
              }
            }
          }
          return { fileSystem: newFS, deletedItems: updatedDeletedItems };
        });
      },

      // Restore item from Recycle Bin
      restoreItem: (deletedItemId) => {
        set((state) => {
          const itemIndex = state.deletedItems.findIndex(i => i.name === deletedItemId); // Using name as ID for simplicity
          if (itemIndex === -1) return state;

          const itemToRestore = state.deletedItems[itemIndex];
          const newFS = cloneTree(state.fileSystem);
          const parentPath = itemToRestore.originalPath.slice(0, -1);
          const parent = findNode(newFS, parentPath);

          if (parent && parent.type === 'folder') {
            // Re-insert
            const { originalPath, deletedAt, ...restoredNode } = itemToRestore;
            
            // Handle name collision just in case
            let newName = restoredNode.name;
            let counter = 1;
            while (parent.children.some(c => c.name === newName)) {
              const parts = restoredNode.name.split('.');
              if (parts.length > 1) {
                const ext = parts.pop();
                newName = `${parts.join('.')} (${counter}).${ext}`;
              } else {
                newName = `${restoredNode.name} (${counter})`;
              }
              counter++;
            }
            restoredNode.name = newName;
            parent.children.push(restoredNode);
          }

          const newDeletedItems = [...state.deletedItems];
          newDeletedItems.splice(itemIndex, 1);

          return { fileSystem: newFS, deletedItems: newDeletedItems };
        });
      },

      // Empty Recycle Bin
      emptyRecycleBin: () => {
        set({ deletedItems: [] });
      },

      // Rename item
      renameItem: (pathParts, newName) => {
        if (!pathParts || pathParts.length <= 1) return; // Cannot rename root
        set((state) => {
          const newFS = cloneTree(state.fileSystem);
          const file = findNode(newFS, pathParts);
          
          if (file) {
            // Also need to check if target name already exists in parent
            const parentPath = pathParts.slice(0, -1);
            const parent = findNode(newFS, parentPath);
            if (parent && parent.children) {
              const exists = parent.children.some(c => c.name === newName);
              if (!exists) {
                file.name = newName;
                file.modified = getTodayDateString();
              }
            }
          }
          return { fileSystem: newFS };
        });
      },

      // Move item (Drag & Drop)
      moveItem: (sourcePathParts, targetPathParts) => {
        if (!sourcePathParts || sourcePathParts.length <= 1) return;
        
        set((state) => {
          const newFS = cloneTree(state.fileSystem);
          
          // Find source node and its parent
          const sourceParentPath = sourcePathParts.slice(0, -1);
          const sourceName = sourcePathParts[sourcePathParts.length - 1];
          const sourceParent = findNode(newFS, sourceParentPath);
          
          if (!sourceParent || !sourceParent.children) return state;
          
          const sourceNodeIndex = sourceParent.children.findIndex(c => c.name === sourceName);
          if (sourceNodeIndex === -1) return state;
          
          // Find target folder
          const targetFolder = findNode(newFS, targetPathParts);
          if (!targetFolder || targetFolder.type !== 'folder') return state;
          
          // Prevent moving a folder into itself or its children
          const sourcePathStr = sourcePathParts.join('/');
          const targetPathStr = targetPathParts.join('/');
          if (targetPathStr.startsWith(sourcePathStr)) return state;
          
          // Remove from source and add to target
          const [sourceNode] = sourceParent.children.splice(sourceNodeIndex, 1);
          
          // Handle name collisions
          let newName = sourceNode.name;
          let counter = 1;
          while (targetFolder.children.some(c => c.name === newName)) {
            const parts = sourceNode.name.split('.');
            if (parts.length > 1) {
              const ext = parts.pop();
              newName = `${parts.join('.')} (${counter}).${ext}`;
            } else {
              newName = `${sourceNode.name} (${counter})`;
            }
            counter++;
          }
          
          sourceNode.name = newName;
          targetFolder.children.push(sourceNode);
          
          return { fileSystem: newFS };
        });
      },

      // Update lastOpened (for Recent Files)
      updateLastOpened: (pathParts) => {
        set((state) => {
          const newFS = cloneTree(state.fileSystem);
          const file = findNode(newFS, pathParts);
          if (file && file.type === 'file') {
            file.lastOpened = new Date().toISOString();
          }
          return { fileSystem: newFS };
        });
      },

      // Get recent files
      getRecentFiles: () => {
        const { fileSystem } = get();
        const recents = [];
        
        const traverse = (node, currentPath) => {
          if (node.type === 'file' && node.lastOpened) {
            recents.push({ ...node, fullPath: currentPath });
          }
          if (node.children) {
            node.children.forEach(child => {
              traverse(child, [...currentPath, child.name]);
            });
          }
        };
        
        traverse(fileSystem, [fileSystem.name]);
        
        return recents.sort((a, b) => new Date(b.lastOpened) - new Date(a.lastOpened)).slice(0, 10);
      }
    }),
    {
      name: 'portfolio-os-filesystem',
    }
  )
);
