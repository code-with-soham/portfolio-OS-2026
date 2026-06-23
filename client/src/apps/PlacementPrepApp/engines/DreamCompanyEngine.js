export const DREAM_COMPANIES = {
  Google: {
    DSA: 60,
    'System Design': 20,
    'Core CS': 15,
    Projects: 5,
    Aptitude: 0,
    Verbal: 0
  },
  Amazon: {
    DSA: 50,
    'Core CS': 25,
    Projects: 15,
    Behavioral: 10,
    Aptitude: 0,
    Verbal: 0
  },
  Microsoft: {
    DSA: 50,
    'System Design': 15,
    'Core CS': 20,
    Projects: 15,
    Aptitude: 0,
    Verbal: 0
  },
  Adobe: {
    DSA: 55,
    'Core CS': 25,
    Projects: 20,
    Aptitude: 0,
    Verbal: 0
  },
  TCS: {
    DSA: 20,
    Aptitude: 30,
    Verbal: 20,
    'Core CS': 20,
    Communication: 10
  },
  Infosys: {
    DSA: 20,
    Aptitude: 30,
    Verbal: 20,
    'Core CS': 20,
    Communication: 10
  },
  Wipro: {
    DSA: 25,
    Aptitude: 30,
    Verbal: 15,
    'Core CS': 20,
    Communication: 10
  },
  Accenture: {
    DSA: 25,
    Aptitude: 30,
    Verbal: 15,
    'Core CS': 20,
    Communication: 10
  },
  Capgemini: {
    DSA: 25,
    Aptitude: 30,
    Verbal: 15,
    'Core CS': 20,
    Communication: 10
  },
  'Custom Startup': {
    DSA: 30,
    'Core CS': 10,
    Projects: 40,
    'System Design': 20,
    Aptitude: 0,
    Verbal: 0
  }
};

export class DreamCompanyEngine {
  static getProfile(companyName) {
    return DREAM_COMPANIES[companyName] || DREAM_COMPANIES['Custom Startup'];
  }

  static calculateReadiness(store) {
    const profile = this.getProfile(store.dreamCompany);
    
    // Calculate aggregate scores from the store (0-100 scales)
    const dsaValues = Object.values(store.dsaPatterns);
    const dsaAvg = dsaValues.length ? dsaValues.reduce((a, b) => a + b, 0) / dsaValues.length : 0;
    
    const csValues = Object.values(store.coreCSMastery);
    const csAvg = csValues.length ? csValues.reduce((a, b) => a + b, 0) / csValues.length : 0;

    const aptValues = Object.values(store.aptitudeMastery);
    const aptAvg = aptValues.length ? aptValues.reduce((a, b) => a + b, 0) / aptValues.length : 0;

    const mockScoreAvg = store.studyStats?.mockScoreAvg || 0;
    const projectScore = store.completedTopics.filter(t => t.toLowerCase().includes('project')).length * 10; // Simple heuristic

    let readiness = 0;
    
    if (profile.DSA) readiness += (dsaAvg * (profile.DSA / 100));
    if (profile['Core CS']) readiness += (csAvg * (profile['Core CS'] / 100));
    if (profile.Aptitude) readiness += (aptAvg * (profile.Aptitude / 100));
    
    // Approximate others using mock scores and heuristics
    if (profile['System Design']) readiness += (mockScoreAvg * (profile['System Design'] / 100));
    if (profile.Projects) readiness += (Math.min(projectScore, 100) * (profile.Projects / 100));
    if (profile.Behavioral || profile.Communication || profile.Verbal) {
        const commWeight = (profile.Behavioral || 0) + (profile.Communication || 0) + (profile.Verbal || 0);
        readiness += (mockScoreAvg * (commWeight / 100));
    }

    return Math.min(Math.round(readiness), 100);
  }
}
