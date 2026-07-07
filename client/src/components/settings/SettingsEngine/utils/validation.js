/**
 * Validation Engine for Settings
 * Validates a value against a schema definition.
 * 
 * @param {any} value - The new value to validate
 * @param {Object} schema - The setting schema object
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateSetting(value, schema) {
  if (!schema) return { isValid: true, error: null };

  const { type, min, max, regex, mustExist } = schema;

  if (type === 'number') {
    if (min !== undefined && value < min) return { isValid: false, error: `Value must be at least ${min}` };
    if (max !== undefined && value > max) return { isValid: false, error: `Value must be at most ${max}` };
  }

  if (type === 'input' && regex) {
    try {
      const re = new RegExp(regex);
      if (!re.test(value)) {
        return { isValid: false, error: schema.validationError || 'Invalid format' };
      }
    } catch (e) {
      console.error('Invalid regex in schema', e);
    }
  }

  // Placeholder for folder/file validation that would normally require IPC/backend
  if (type === 'folder' && mustExist) {
    if (!value || typeof value !== 'string') {
      return { isValid: false, error: 'Valid path required' };
    }
  }

  return { isValid: true, error: null };
}
