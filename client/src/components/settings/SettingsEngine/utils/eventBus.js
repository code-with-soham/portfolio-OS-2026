/**
 * Universal Event System for Settings
 * Enables pub/sub so that decoupled apps can listen to setting changes globally.
 */
class SettingsEventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to a specific setting change
   * @param {string} settingId - The ID of the setting to listen to
   * @param {Function} callback - Called with (newValue, oldValue)
   */
  subscribe(settingId, callback) {
    if (!this.listeners.has(settingId)) {
      this.listeners.set(settingId, new Set());
    }
    this.listeners.get(settingId).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(settingId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(settingId);
        }
      }
    };
  }

  /**
   * Emit a setting change event
   * @param {string} settingId - The ID of the setting
   * @param {any} newValue - The new value
   * @param {any} oldValue - The previous value
   */
  emit(settingId, newValue, oldValue) {
    if (this.listeners.has(settingId)) {
      this.listeners.get(settingId).forEach(callback => {
        try {
          callback(newValue, oldValue);
        } catch (error) {
          console.error(`SettingsEventBus error in callback for ${settingId}:`, error);
        }
      });
    }
    
    // Also emit a global wildcard event if needed
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(callback => callback(settingId, newValue, oldValue));
    }
  }
}

export const settingsEventBus = new SettingsEventBus();
