import { create } from 'zustand';

export const useBackgroundServiceStore = create((set) => ({
  services: [
    { id: 'clock', name: 'System Clock', status: 'running' },
    { id: 'weather', name: 'Weather Sync', status: 'running' },
    { id: 'github', name: 'GitHub Sync', status: 'running' },
    { id: 'calendar', name: 'Calendar Reminder', status: 'running' },
    { id: 'music', name: 'Audio Engine', status: 'running' }
  ],
  
  stopService: (id) => set((state) => ({
    services: state.services.map(s => s.id === id ? { ...s, status: 'stopped' } : s)
  })),

  startService: (id) => set((state) => ({
    services: state.services.map(s => s.id === id ? { ...s, status: 'running' } : s)
  }))
}));
