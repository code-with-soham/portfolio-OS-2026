import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlacementStore = create(
  persist(
    (set, get) => ({
      // User Settings
      duration: '30 Days',
      companyType: 'Product Based',
      dreamCompany: 'Google',
      placementSeason: '2027 On-Campus',
      skillLevel: 'Intermediate',
      availableTime: '2 Hours',
      focusMode: 'Balanced',
      
      setSetting: (key, value) => set((state) => ({ ...state, [key]: value })),

      // Core Progress State
      currentPhase: 'Foundation',
      completedDays: 0,
      streak: 0,
      lastActiveDate: null,
      readinessScore: 0,

      // Roadmaps
      baseRoadmap: [],
      enhancedRoadmap: [],
      
      setRoadmaps: (base, enhanced) => set({ baseRoadmap: base, enhancedRoadmap: enhanced }),

      // Dynamic Queues
      revisionQueue: [],
      weakTopics: [],
      knowledgeVault: [],

      // DSA Pattern Mastery (0-100)
      dsaPatterns: {
        'Arrays': 0,
        'Strings': 0,
        'HashMap': 0,
        'Sliding Window': 0,
        'Two Pointers': 0,
        'Binary Search': 0,
        'Recursion': 0,
        'Trees': 0,
        'Graphs': 0,
        'Dynamic Programming': 0,
      },
      updatePatternMastery: (pattern, value) => set((state) => ({
        dsaPatterns: { ...state.dsaPatterns, [pattern]: value }
      })),

      // Analytics
      mockScores: [],
      addMockScore: (score) => set((state) => ({ mockScores: [...state.mockScores, score] })),

      // V3 Career OS State
      achievements: [],
      addAchievement: (ach) => set((state) => {
        if (!state.achievements.find(a => a.id === ach.id)) {
          return { achievements: [...state.achievements, ach] };
        }
        return state;
      }),

      studyStats: {
        totalHours: 0,
        questionsSolved: 0,
        mockScoreAvg: 0,
        revisionAccuracy: 0,
      },
      updateStudyStats: (updates) => set((state) => ({
        studyStats: { ...state.studyStats, ...updates }
      })),

      interviewExperiences: [],
      addInterviewExperience: (exp) => set((state) => ({
        interviewExperiences: [...state.interviewExperiences, exp]
      })),

      contests: [],
      addContest: (contest) => set((state) => ({
        contests: [...state.contests, contest]
      })),

      heatmapData: {},
      incrementHeatmap: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const currentCount = state.heatmapData[today] || 0;
        return {
          heatmapData: { ...state.heatmapData, [today]: currentCount + 1 }
        };
      }),

      coreCSMastery: {
        'DBMS': 0,
        'Operating Systems': 0,
        'Computer Networks': 0,
        'System Design': 0,
      },
      updateCoreCSMastery: (topic, value) => set((state) => ({
        coreCSMastery: { ...state.coreCSMastery, [topic]: value }
      })),

      aptitudeMastery: {
        'Quantitative': 0,
        'Logical Reasoning': 0,
        'Verbal': 0,
      },
      updateAptitudeMastery: (topic, value) => set((state) => ({
        aptitudeMastery: { ...state.aptitudeMastery, [topic]: value }
      })),

      // Actions
      completedTopics: [],
      completeTopic: (topic) => set((state) => {
        const today = new Date().toDateString();
        let newStreak = state.streak;
        if (state.lastActiveDate !== today) {
           newStreak += 1; // Simplistic streak for demo
        }

        return {
          completedTopics: [...state.completedTopics, topic],
          streak: newStreak,
          lastActiveDate: today,
          studyStats: {
            ...state.studyStats,
            questionsSolved: state.studyStats.questionsSolved + 1
          }
        };
      }),

      addToRevisionQueue: (topic, dueDays) => set((state) => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + dueDays);
          return {
              revisionQueue: [...state.revisionQueue, { topic, dueDate: dueDate.toISOString() }]
          };
      }),

      markWeakTopic: (topic) => set((state) => {
          if (!state.weakTopics.includes(topic)) {
              return { weakTopics: [...state.weakTopics, topic] };
          }
          return state;
      }),

      updateReadinessScore: (score) => set({ readinessScore: score }),
      setPhase: (phase) => set({ currentPhase: phase }),
      
      resetProgress: () => set({
        currentPhase: 'Foundation',
        completedDays: 0,
        streak: 0,
        readinessScore: 0,
        baseRoadmap: [],
        enhancedRoadmap: [],
        revisionQueue: [],
        weakTopics: [],
        completedTopics: [],
        mockScores: [],
        achievements: [],
        interviewExperiences: [],
        contests: [],
        heatmapData: {},
        studyStats: { totalHours: 0, questionsSolved: 0, mockScoreAvg: 0, revisionAccuracy: 0 },
        dsaPatterns: Object.keys(get().dsaPatterns).reduce((acc, curr) => ({...acc, [curr]: 0}), {}),
        coreCSMastery: Object.keys(get().coreCSMastery).reduce((acc, curr) => ({...acc, [curr]: 0}), {}),
        aptitudeMastery: Object.keys(get().aptitudeMastery).reduce((acc, curr) => ({...acc, [curr]: 0}), {})
      })
    }),
    {
      name: 'portfolio-placement-storage',
    }
  )
);
