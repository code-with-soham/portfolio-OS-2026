import React, { useMemo } from 'react';
import { SettingsSection } from './SettingsSection';
import { SettingsCard } from './SettingsCard';
import { SettingsRow } from './SettingsRow';
import { evaluateDependencies } from './utils/dependencies';
import { motion } from 'framer-motion';

export const SettingsCategory = ({ categorySettings, values, onChange }) => {
  // Group settings by section, then by card group, while filtering by dependencies
  const structure = useMemo(() => {
    const res = {};
    categorySettings.forEach(setting => {
      // 1. Dependency Engine: skip if dependencies not met
      const isVisible = evaluateDependencies(setting, values);
      if (!isVisible) return;

      const sectionName = setting.section || 'General';
      const groupName = setting.group || 'Settings';
      
      if (!res[sectionName]) res[sectionName] = {};
      if (!res[sectionName][groupName]) res[sectionName][groupName] = [];
      
      res[sectionName][groupName].push(setting);
    });
    return res;
  }, [categorySettings, values]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {Object.entries(structure).map(([sectionName, groups]) => (
        <SettingsSection key={sectionName} id={sectionName} title={sectionName}>
          {Object.entries(groups).map(([groupName, settings]) => (
            <SettingsCard key={groupName} title={groupName !== 'Settings' ? groupName : null}>
              {settings.map(setting => (
                <SettingsRow 
                  key={setting.id}
                  setting={setting}
                  value={values[setting.id] !== undefined ? values[setting.id] : setting.default}
                  onChange={onChange}
                  disabled={false}
                />
              ))}
            </SettingsCard>
          ))}
        </SettingsSection>
      ))}
    </motion.div>
  );
};
