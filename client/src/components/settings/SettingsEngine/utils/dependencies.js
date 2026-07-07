/**
 * Dependency Engine for Settings
 * Evaluates whether a setting should be visible based on its dependencies.
 * 
 * @param {Object} setting - The setting schema object
 * @param {Object} currentValues - The current dictionary of all setting values
 * @returns {boolean} - True if dependencies are met (visible), False if not (hidden/disabled)
 */
export function evaluateDependencies(setting, currentValues) {
  if (!setting.dependsOn || !Array.isArray(setting.dependsOn) || setting.dependsOn.length === 0) {
    return true; // No dependencies
  }

  return setting.dependsOn.every(dep => {
    const currentValue = currentValues[dep.id];
    // Strict equality check for now; can be expanded to operators (gt, lt, not)
    return currentValue === dep.value;
  });
}
