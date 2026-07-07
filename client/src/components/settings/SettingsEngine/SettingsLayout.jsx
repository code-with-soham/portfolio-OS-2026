import React from 'react';
import { SplitView, SplitPane, Sidebar } from '../../ui/Layout';
import { SettingsSidebar } from './SettingsSidebar';

/**
 * Universal layout wrapper for the Settings Engine.
 * Provides the Sidebar on the left and the scrollable content area on the right.
 */
export const SettingsLayout = ({ 
  categories, 
  activeCategory, 
  onCategorySelect, 
  searchQuery,
  onSearchChange,
  children 
}) => {
  return (
    <SplitView style={{ backgroundColor: 'var(--ds-bg-primary)', height: '100%' }}>
      {/* Settings Sidebar with integrated Search */}
      <Sidebar width={300} style={{ borderRight: '1px solid var(--ds-border)' }}>
        <SettingsSidebar 
          categories={categories}
          activeCategory={activeCategory}
          onSelect={onCategorySelect}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </Sidebar>

      {/* Main Settings Content Area */}
      <SplitPane style={{ overflowY: 'auto', padding: 'var(--ds-space-2xl)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-xl)' }}>
          {children}
        </div>
      </SplitPane>
    </SplitView>
  );
};
