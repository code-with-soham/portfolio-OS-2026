import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStickyNotesStore = create(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (x = 100, y = 100) => set((state) => {
        const newNote = {
          id: `note_${Date.now()}`,
          text: '',
          color: '#fff2ab', // Default yellow
          x,
          y,
          width: 250,
          height: 250,
          zIndex: state.notes.length > 0 ? Math.max(...state.notes.map(n => n.zIndex || 0)) + 1 : 1
        };
        return { notes: [...state.notes, newNote] };
      }),

      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n)
      })),

      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),

      bringToFront: (id) => set((state) => {
        const maxZ = Math.max(...state.notes.map(n => n.zIndex || 0), 0);
        return {
          notes: state.notes.map(n => n.id === id ? { ...n, zIndex: maxZ + 1 } : n)
        };
      }),
    }),
    {
      name: 'portfolio-os-stickynotes',
    }
  )
);
