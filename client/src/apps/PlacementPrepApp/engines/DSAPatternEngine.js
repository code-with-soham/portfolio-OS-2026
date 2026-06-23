// ============================================
// Placement Prep - DSA Pattern Engine
// ============================================

export function calculatePatternMasteryUpdate(currentMastery, difficulty, isCorrect) {
    // Difficulty modifier: Easy=1, Medium=2, Hard=3
    let diffMod = 1;
    if (difficulty === 'Medium') diffMod = 2;
    if (difficulty === 'Hard') diffMod = 3;

    let newMastery = currentMastery;
    if (isCorrect) {
        // Gain more for harder questions, but tapers off as you get closer to 100
        const gain = (100 - currentMastery) * 0.1 * diffMod;
        newMastery += gain;
    } else {
        // Lose points on failure
        const loss = currentMastery * 0.05;
        newMastery -= loss;
    }

    return Math.max(0, Math.min(100, Math.round(newMastery)));
}
