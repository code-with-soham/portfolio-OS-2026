import React, { useMemo } from 'react';
import { SettingsSection } from './SettingsSection';
import { SettingsCard } from './SettingsCard';
import { SettingsRow } from './SettingsRow';
import { EmptyState } from '../../ui/EmptyState';
import { SearchRegular } from '@fluentui/react-icons';

export const SettingsSearchResults = ({ results, values, onChange, query }) => {
  // Group results by category for organized rendering
  const groupedResults = useMemo(() => {
    const res = {};
    results.forEach(setting => {
      const cat = setting.category || 'General';
      if (!res[cat]) res[cat] = [];
      res[cat].push(setting);
    });
    return res;
  }, [results]);

  if (!results || results.length === 0) {
    return (
      <EmptyState 
        icon={<SearchRegular fontSize={32} />}
        title="No settings found"
        description={`We couldn't find any settings matching "${query}".`}
      />
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 'var(--ds-text-xl)', fontWeight: '600', marginBottom: 'var(--ds-space-2xl)' }}>
        Search Results for "{query}"
      </h2>
      
      {Object.entries(groupedResults).map(([category, items]) => (
        <SettingsSection key={category} title={category.charAt(0).toUpperCase() + category.slice(1)}>
          <SettingsCard>
            {items.map(setting => (
              <SettingsRow 
                key={setting.id}
                setting={setting}
                value={values[setting.id] !== undefined ? values[setting.id] : setting.default}
                onChange={onChange}
              />
            ))}
          </SettingsCard>
        </SettingsSection>
      ))}
    </div>
  );
};
