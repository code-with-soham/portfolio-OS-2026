// ============================================
// Placement Prep - Revision Engine
// ============================================

export function calculateNextRevisionDates(completionDate) {
  const baseDate = new Date(completionDate);
  const intervals = [1, 3, 7, 15, 30]; // Days
  
  return intervals.map(days => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  });
}

export function getDueRevisions(revisionQueue, currentDateString) {
    const today = new Date(currentDateString).getTime();
    return revisionQueue.filter(item => {
        const dueTime = new Date(item.dueDate).getTime();
        return dueTime <= today;
    });
}
