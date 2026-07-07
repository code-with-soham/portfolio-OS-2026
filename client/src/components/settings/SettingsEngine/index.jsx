import React, { useState, useMemo } from 'react';
import { settingsRegistry } from './utils/registry';
import { scoreSettings } from './utils/searchSettings';
import { settingsEventBus } from './utils/eventBus';
import { validateSetting } from './utils/validation';
import { SettingsLayout } from './SettingsLayout';
import { SettingsCategory } from './SettingsCategory';
import { SettingsSearchResults } from './SettingsSearchResults';
import { SettingsBreadcrumb } from './SettingsBreadcrumb';
import { SettingsToast } from './SettingsToast';
import { AnimatePresence } from 'framer-motion';
import { Select } from '../../ui/Select';

/**
 * Universal Settings Engine Root Component.
 * Pass the `appId` to load that application's registered plugin.
 */
export const SettingsEngine = ({ appId, values, onChange }) => {
  const plugin = useMemo(() => settingsRegistry.get(appId), [appId]);
  const schema = plugin?.settings;
  const allSettingsFlat = useMemo(() => settingsRegistry.getFlatSettings(appId), [appId]);
  
  // State
  const [activeCategoryId, setActiveCategoryId] = useState(
    schema ? Object.keys(schema)[0] : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProfile, setActiveProfile] = useState('default');
  const [toast, setToast] = useState({ visible: false, message: '', settingId: null, oldValue: null, requiresRestart: false });

  if (!plugin || !schema) {
    return <div>Error: No settings registered for app "{appId}"</div>;
  }

  const handleLocalChange = (settingId, newValue) => {
    const flat = settingsRegistry.getFlatSettings(appId);
    const setting = flat.find(s => s.id === settingId);

    // 1. Validation Engine
    const validation = validateSetting(newValue, setting);
    if (!validation.isValid) {
      setToast({
        visible: true,
        message: `Error: ${validation.error}`,
        settingId: null,
        oldValue: null
      });
      return;
    }

    // Record old value for Undo
    const oldValue = values[settingId];
    
    // Call parent onChange
    onChange(settingId, newValue);

    // 2. Universal Event Bus Emit
    settingsEventBus.emit(settingId, newValue, oldValue);
    
    // 3. Show Toast with optional Restart Action
    setToast({
      visible: true,
      message: `${setting?.title || settingId} updated.`,
      settingId,
      oldValue,
      requiresRestart: setting?.requiresRestart || false
    });
  };

  const handleUndo = () => {
    if (toast.settingId) {
      onChange(toast.settingId, toast.oldValue);
      settingsEventBus.emit(toast.settingId, toast.oldValue, values[toast.settingId]);
      setToast({ visible: false, message: '', settingId: null, oldValue: null, requiresRestart: false });
    }
  };

  // Derive Sidebar Categories with counters
  const categories = Object.keys(schema).map(key => {
    const categorySettings = schema[key];
    const title = key.charAt(0).toUpperCase() + key.slice(1);
    return { 
      id: key, 
      title,
      count: categorySettings.length
    };
  });

  const activeCategoryTitle = categories.find(c => c.id === activeCategoryId)?.title;
  const isSearching = searchQuery.trim().length > 0;
  const searchResults = isSearching ? scoreSettings(allSettingsFlat, searchQuery) : [];

  return (
    <>
      <SettingsLayout
        categories={categories}
        activeCategory={activeCategoryId}
        onCategorySelect={setActiveCategoryId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SettingsBreadcrumb 
            path={isSearching ? ['Search Results'] : [activeCategoryTitle]} 
          />
          
          {/* Profile Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-sm)', marginBottom: 'var(--ds-space-2xl)' }}>
            <span style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)' }}>Profile:</span>
            <Select 
              value={activeProfile} 
              onChange={(e) => setActiveProfile(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="default">Default</option>
              <option value="developer">Developer</option>
              <option value="minimal">Minimal</option>
              <option value="accessibility">Accessibility</option>
              <option value="demo">Recruiter Demo</option>
            </Select>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {isSearching ? (
            <SettingsSearchResults 
              key="search-results"
              query={searchQuery}
              results={searchResults}
              values={values}
              onChange={handleLocalChange}
            />
          ) : (
            <SettingsCategory
              key={activeCategoryId}
              categorySettings={schema[activeCategoryId] || []}
              values={values}
              onChange={handleLocalChange}
            />
          )}
        </AnimatePresence>
      </SettingsLayout>

      <SettingsToast 
        isVisible={toast.visible}
        message={toast.message}
        onUndo={toast.settingId ? handleUndo : null}
        onDismiss={() => setToast(prev => ({ ...prev, visible: false }))}
        actionLabel={toast.requiresRestart ? 'Restart' : null}
        onAction={() => console.log('Action triggered')}
      />
    </>
  );
};
