// ============================================
// Placement Prep - Weak Topic Engine
// ============================================

// Threshold for a weak topic (e.g., if mock score < 60%)
const WEAK_THRESHOLD = 60;

export function evaluateTopicPerformance(topic, score, currentWeakTopics) {
    let updatedWeakTopics = [...currentWeakTopics];
    
    if (score < WEAK_THRESHOLD) {
        if (!updatedWeakTopics.includes(topic)) {
            updatedWeakTopics.push(topic);
        }
    } else if (score >= WEAK_THRESHOLD + 10) {
        // If score is 70+, remove from weak topics
        updatedWeakTopics = updatedWeakTopics.filter(t => t !== topic);
    }

    return updatedWeakTopics;
}
