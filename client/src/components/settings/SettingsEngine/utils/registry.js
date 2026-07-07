// Plugin Registry for OS Settings
class SettingsRegistry {
  constructor() {
    this.plugins = new Map();
  }

  /**
   * Registers a full settings plugin
   * @param {Object} plugin - The plugin object
   * @param {string} plugin.id - e.g., 'browser', 'weather'
   * @param {string} plugin.title - e.g., 'Browser'
   * @param {string} plugin.icon - FluentUI icon name e.g. 'WindowRegular'
   * @param {Object} plugin.settings - The JSON configuration object containing categories
   * @param {string} plugin.version - e.g. '1.0'
   * @param {boolean} plugin.searchable - Whether to include in global search
   * @param {number} plugin.priority - Ordering priority in sidebar
   */
  register(plugin) {
    if (!plugin || !plugin.id) {
      console.error('SettingsRegistry: Cannot register invalid plugin');
      return;
    }
    this.plugins.set(plugin.id, plugin);
  }

  /**
   * Retrieves the plugin for an app
   */
  get(appId) {
    return this.plugins.get(appId) || null;
  }

  /**
   * Retrieves all registered plugins sorted by priority
   */
  getAll() {
    return Array.from(this.plugins.values()).sort((a, b) => (a.priority || 99) - (b.priority || 99));
  }

  /**
   * Flattens all settings for a specific app into a single array
   */
  getFlatSettings(appId) {
    const plugin = this.get(appId);
    if (!plugin || !plugin.settings) return [];
    
    let flat = [];
    Object.values(plugin.settings).forEach(categorySettings => {
      if (Array.isArray(categorySettings)) {
        flat = [...flat, ...categorySettings];
      }
    });
    return flat;
  }
}

export const settingsRegistry = new SettingsRegistry();
