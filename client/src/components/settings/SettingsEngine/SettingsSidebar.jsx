import React, { useRef, useEffect } from 'react';
import { SearchField } from '../../ui/SearchField';
import { SearchRegular } from '@fluentui/react-icons';

export const SettingsSidebar = ({ categories, activeCategory, onSelect, searchQuery, onSearchChange }) => {
  const searchRef = useRef(null);

  // Ctrl+F or Cmd+F shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sticky Header with Title and Search */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        backgroundColor: 'var(--ds-panel)', 
        zIndex: 10,
        padding: 'var(--ds-space-xl)',
        borderBottom: '1px solid var(--ds-border)'
      }}>
        <h2 style={{ 
          fontSize: 'var(--ds-text-xl)', 
          fontWeight: '600', 
          marginBottom: 'var(--ds-space-lg)',
          color: 'var(--ds-text-primary)'
        }}>
          Settings
        </h2>
        
        <SearchField 
          ref={searchRef}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Settings... (Ctrl+F)"
          iconLeft={<SearchRegular fontSize={16} />}
          style={{ width: '100%' }}
        />
      </div>

      {/* Categories List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--ds-space-md) 0' }} className="ds-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className="ds-transition-btn"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-space-md)',
              padding: 'var(--ds-space-md) var(--ds-space-xl)',
              backgroundColor: activeCategory === category.id ? 'var(--ds-surface-hover)' : 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              outline: 'none',
              color: activeCategory === category.id ? 'var(--ds-accent)' : 'var(--ds-text-primary)',
              fontWeight: activeCategory === category.id ? '500' : '400'
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== category.id) {
                e.currentTarget.style.backgroundColor = 'var(--ds-surface)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            onFocus={(e) => e.currentTarget.style.outline = '2px solid var(--ds-focus-ring)'}
            onBlur={(e) => e.currentTarget.style.outline = 'none'}
          >
            {category.icon && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px' }}>
                {category.icon}
              </div>
            )}
            <span style={{ flex: 1 }}>{category.title}</span>
            {category.count !== undefined && (
              <span style={{ 
                fontSize: '10px', 
                backgroundColor: 'var(--ds-surface-hover)', 
                color: 'var(--ds-text-secondary)',
                padding: '2px 6px',
                borderRadius: '8px',
                fontWeight: '500'
              }}>
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
