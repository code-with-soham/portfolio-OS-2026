import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_EVENTS = [
  { id: '1', date: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear(), title: 'Mock Interview', type: 'interview', time: '10:00 AM' },
  { id: '2', date: new Date().getDate() + 2, month: new Date().getMonth(), year: new Date().getFullYear(), title: 'TCS Exam', type: 'exam', time: '2:00 PM' },
  { id: '3', date: new Date().getDate() + 5, month: new Date().getMonth(), year: new Date().getFullYear(), title: 'Hackathon', type: 'event', time: '9:00 AM' }
];

export const useCalendarStore = create(
  persist(
    (set, get) => ({
      events: INITIAL_EVENTS,

      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: `evt_${Date.now()}` }]
      })),

      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
      })),

      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      }))
    }),
    {
      name: 'portfolio-os-calendar',
    }
  )
);
