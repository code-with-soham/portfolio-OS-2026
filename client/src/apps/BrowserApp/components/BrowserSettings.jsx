import React, { useEffect, useState } from 'react';
import { SettingsEngine } from '../../../components/settings/SettingsEngine';
import { settingsRegistry } from '../../../components/settings/SettingsEngine/utils/registry';
import { browserSettingsJSON } from './BrowserSettings/config';
import { useBrowserStore } from '../../../store/useBrowserStore';

// Register the browser settings schema into the universal engine
settingsRegistry.register({
  id: 'browser',
  title: 'Browser',
  icon: 'WindowRegular',
  settings: browserSettingsJSON,
  version: '2.0',
  searchable: true,
  priority: 10,
  category: 'Applications'
});

export default function BrowserSettings() {
  const [localValues, setLocalValues] = useState({});

  // Sync with global store where necessary, or keep local
  // For demonstration in VS-BROWSER-SETTINGS PRO, we handle generic state here
  // Real implementation would sync specific keys (like 'theme') to useBrowserStore.

  const handleSettingChange = (settingId, newValue) => {
    setLocalValues(prev => ({
      ...prev,
      [settingId]: newValue
    }));

    // Example of syncing specific setting to store
    if (settingId === 'theme') {
      // In a real scenario, this would call toggleTheme or setTheme
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <SettingsEngine 
        appId="browser"
        values={localValues}
        onChange={handleSettingChange}
      />
    </div>
  );
}
