// ============================================
// Placement Prep - Rule Engine
// ============================================

const TOPICS = {
  aptitude: ['Percentages', 'Profit & Loss', 'Time & Work', 'Time, Speed & Distance', 'Ratio & Proportion'],
  reasoning: ['Coding-Decoding', 'Series', 'Seating Arrangement', 'Syllogism', 'Blood Relation'],
  verbal: ['Grammar Basics', 'Sentence Correction', 'Vocabulary', 'Reading Comprehension'],
  dsa: ['Arrays', 'Strings', 'HashMap', 'Sliding Window', 'Two Pointers', 'Binary Search', 'Recursion', 'Trees', 'Graphs', 'DP'],
  coreCS: ['DBMS', 'SQL', 'OOPs', 'OS', 'Computer Networks'],
  projects: ['Project Architecture', 'Tech Stack Explanation', 'Deployment']
};

export function generateBaseRoadmap(store) {
  const { duration, companyType, focusMode, placementSeason, dreamCompany } = store;

  let days = 30; // default
  if (duration === '15 Days') days = 15;
  if (duration === '1 Month') days = 30;
  if (duration === '2 Months') days = 60;
  if (duration === '6 Months') days = 180;

  // Weights based on company type
  let weights = { aptitude: 0.2, dsa: 0.4, coreCS: 0.2, projects: 0.1, mocks: 0.1 };
  
  if (companyType === 'Service Based') {
    weights = { aptitude: 0.4, dsa: 0.2, coreCS: 0.2, projects: 0.1, mocks: 0.1 };
  } else if (companyType === 'Startup') {
    weights = { aptitude: 0.1, dsa: 0.3, coreCS: 0.1, projects: 0.4, mocks: 0.1 };
  }

  // Adjust weights slightly based on focus mode
  if (focusMode === 'DSA Heavy') { weights.dsa += 0.2; weights.aptitude -= 0.1; weights.coreCS -= 0.1; }

  // Adjust for Season
  let sprintLabel = 'Placement Sprint';
  if (placementSeason === 'Internship Preparation') sprintLabel = 'Internship Sprint';
  if (placementSeason === 'Hackathon Preparation') sprintLabel = 'Hackathon Build Phase';

  const roadmap = [];
  
  for (let i = 1; i <= days; i++) {
    let phase = 'Foundation';
    if (i > days * 0.3) phase = 'Problem Solving';
    if (i > days * 0.6) phase = 'Core CS & Projects';
    if (i > days * 0.85) phase = sprintLabel;

    // Simplified deterministic generation
    const isMockDay = i % 7 === 0;
    
    let topic = 'Mixed Practice';
    if (weights.dsa > 0.3) topic = TOPICS.dsa[i % TOPICS.dsa.length];
    if (weights.aptitude > 0.3 && i % 2 !== 0) topic = TOPICS.aptitude[i % TOPICS.aptitude.length];
    
    if (placementSeason === 'Hackathon Preparation' && i > days * 0.5) topic = 'Project Development';
    if (isMockDay) topic = `Full Mock Interview: ${dreamCompany || 'General'}`;

    roadmap.push({
      day: i,
      phase,
      mainTopic: topic,
      tasks: [
        { id: `d${i}-1`, title: `Learn concepts of ${topic}`, completed: false },
        { id: `d${i}-2`, title: `Solve 5 questions on ${topic}`, completed: false },
        { id: `d${i}-3`, title: `Add notes to Knowledge Vault`, completed: false }
      ],
      completed: false
    });
  }

  return roadmap;
}
