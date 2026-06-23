// ============================================
// Placement Prep - Readiness Engine
// ============================================

export function calculateReadinessScore(state) {
  // Formula: DSA(35%) + CoreCS(25%) + Aptitude(15%) + Projects(10%) + Mocks(10%) + Streak(5%)
  
  // Calculate DSA Score (average of pattern mastery)
  const dsaValues = Object.values(state.dsaPatterns || {});
  const dsaAvg = dsaValues.length ? dsaValues.reduce((a, b) => a + b, 0) / dsaValues.length : 0;
  const dsaScore = dsaAvg * 0.35;

  // Mock Score
  const mockValues = state.mockScores || [];
  const mockAvg = mockValues.length ? mockValues.reduce((a, b) => a + b, 0) / mockValues.length : 0;
  const mockScore = mockAvg * 0.10;

  // Streak Contribution (max 100 for streak >= 30)
  const streakScore = Math.min((state.streak / 30) * 100, 100) * 0.05;

  // Topic Completion Contribution (Simplistic proxy for Core CS, Aptitude, Projects)
  const totalCompleted = state.completedTopics?.length || 0;
  const completionScore = Math.min((totalCompleted / 50) * 100, 100) * 0.50; // remaining 50%

  const total = dsaScore + mockScore + streakScore + completionScore;
  return Math.round(Math.min(total, 100));
}
