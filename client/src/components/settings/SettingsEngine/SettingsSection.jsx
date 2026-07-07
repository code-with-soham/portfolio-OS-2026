import React from 'react';

/**
 * Groups multiple SettingsCards under a larger section header.
 */
export const SettingsSection = ({ title, description, children, id }) => {
  return (
    <section id={id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-lg)', marginBottom: 'var(--ds-space-2xl)' }}>
      {title && (
        <div>
          <h2 style={{ fontSize: 'var(--ds-text-lg)', fontWeight: '600', color: 'var(--ds-text-primary)' }}>
            {title}
          </h2>
          {description && (
            <p style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-secondary)', marginTop: 'var(--ds-space-xs)' }}>
              {description}
            </p>
          )}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-xl)' }}>
        {children}
      </div>
    </section>
  );
};
