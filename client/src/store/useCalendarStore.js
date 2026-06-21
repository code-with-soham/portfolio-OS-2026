// ============================================
// Portfolio OS 2026 — Calendar Store
// ============================================
// Zustand store for managing calendar events.
// Supports both legacy { date, month, year, time } format
// and the new { startTime, endTime, color, category, tags } format.
// Persisted to localStorage.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const now = new Date();
const today = now.getDate();
const month = now.getMonth();
const year = now.getFullYear();

// Helper to create a Date at a specific hour
const makeDate = (dayOffset, hour, minute = 0) => {
  const d = new Date(year, month, today + dayOffset, hour, minute);
  return d.toISOString();
};

const INITIAL_EVENTS = [
  {
    id: 'evt_init_1',
    title: 'Mock Interview',
    description: 'Practice behavioral and system design questions',
    date: today,
    month,
    year,
    time: '10:00 AM',
    startTime: makeDate(0, 10, 0),
    endTime: makeDate(0, 11, 0),
    color: 'blue',
    category: 'Interview',
    tags: ['Important', 'Work'],
    type: 'interview',
  },
  {
    id: 'evt_init_2',
    title: 'TCS Exam',
    description: 'NQT aptitude and coding sections',
    date: today + 2,
    month,
    year,
    time: '2:00 PM',
    startTime: makeDate(2, 14, 0),
    endTime: makeDate(2, 16, 0),
    color: 'red',
    category: 'Exam',
    tags: ['Urgent', 'Work'],
    type: 'exam',
  },
  {
    id: 'evt_init_3',
    title: 'Hackathon',
    description: 'Weekend hackathon — build something cool!',
    date: today + 5,
    month,
    year,
    time: '9:00 AM',
    startTime: makeDate(5, 9, 0),
    endTime: makeDate(5, 18, 0),
    color: 'purple',
    category: 'Event',
    tags: ['Team', 'Important'],
    type: 'event',
  },
  {
    id: 'evt_init_4',
    title: 'Portfolio Review',
    description: 'Review portfolio website with mentors',
    date: today + 1,
    month,
    year,
    time: '3:00 PM',
    startTime: makeDate(1, 15, 0),
    endTime: makeDate(1, 16, 0),
    color: 'green',
    category: 'Meeting',
    tags: ['Personal'],
    type: 'meeting',
  },
  {
    id: 'evt_init_5',
    title: 'Team Standup',
    description: 'Daily sync with the development team',
    date: today + 3,
    month,
    year,
    time: '11:00 AM',
    startTime: makeDate(3, 11, 0),
    endTime: makeDate(3, 11, 30),
    color: 'teal',
    category: 'Meeting',
    tags: ['Team', 'Work'],
    type: 'meeting',
  },
  {
    id: 'evt_init_6',
    title: 'Gym Session',
    description: 'Upper body workout day',
    date: today + 1,
    month,
    year,
    time: '6:00 PM',
    startTime: makeDate(1, 18, 0),
    endTime: makeDate(1, 19, 30),
    color: 'orange',
    category: 'Personal',
    tags: ['Personal'],
    type: 'personal',
  },
];

export const useCalendarStore = create(
  persist(
    (set, get) => ({
      events: INITIAL_EVENTS,

      addEvent: (event) => set((state) => ({
        events: [...state.events, {
          ...event,
          id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        }]
      })),

      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
      })),

      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(e => e.id !== id)
      })),

      // Bulk operations
      clearAllEvents: () => set({ events: [] }),

      resetToDefaults: () => set({ events: INITIAL_EVENTS }),
    }),
    {
      name: 'portfolio-os-calendar',
    }
  )
);
