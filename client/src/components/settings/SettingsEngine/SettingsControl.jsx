import React from 'react';
import { Toggle } from '../../ui/Toggle';
import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

/**
 * Universal switch for resolving setting JSON types to React components.
 */
export const SettingsControl = ({ setting, value, onChange }) => {
  const { type, options, placeholder, actionLabel, min, max, step } = setting;

  switch (type) {
    case 'toggle':
    case 'switch':
    case 'checkbox': // We can alias checkbox to toggle for now
      return (
        <Toggle 
          checked={!!value} 
          onChange={(checked) => onChange(setting.id, checked)} 
        />
      );
      
    case 'select':
    case 'dropdown':
      return (
        <Select 
          value={value} 
          onChange={(e) => onChange(setting.id, e.target.value)}
          style={{ width: '200px' }}
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      );

    case 'input':
    case 'text':
    case 'shortcut':
    case 'keybinding':
    case 'folder':
    case 'link':
    case 'color':
      return (
        <Input
          type={type === 'color' ? 'color' : 'text'}
          value={value || ''}
          onChange={(e) => onChange(setting.id, e.target.value)}
          placeholder={placeholder || (type === 'folder' ? '/path/to/folder' : '')}
          style={{ width: '240px' }}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(setting.id, Number(e.target.value))}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          style={{ width: '120px' }}
        />
      );

    case 'slider':
      return (
        <input 
          type="range"
          min={min || 0}
          max={max || 100}
          step={step || 1}
          value={value || 0}
          onChange={(e) => onChange(setting.id, Number(e.target.value))}
          style={{ width: '200px', cursor: 'pointer' }}
        />
      );

    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(setting.id, e.target.value)}
          placeholder={placeholder}
          style={{
            width: '240px',
            minHeight: '60px',
            padding: '8px',
            borderRadius: 'var(--ds-radius-md)',
            border: '1px solid var(--ds-border)',
            backgroundColor: 'var(--ds-bg-primary)',
            color: 'var(--ds-text-primary)'
          }}
        />
      );

    case 'button':
    case 'action':
      return (
        <Button variant="secondary" onClick={() => onChange(setting.id, 'action_triggered')}>
          {actionLabel || 'Action'}
        </Button>
      );
      
    case 'radio':
      return (
        <div style={{ display: 'flex', gap: '16px' }}>
          {options?.map(opt => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name={setting.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(setting.id, e.target.value)}
              />
              <span style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-primary)' }}>{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case 'badge':
    case 'info':
      return (
        <span style={{ 
          fontSize: 'var(--ds-text-sm)', 
          color: 'var(--ds-text-secondary)',
          backgroundColor: 'var(--ds-surface)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          {value || actionLabel || 'Info'}
        </span>
      );

    default:
      return (
        <div style={{ color: 'var(--ds-text-tertiary)', fontSize: 'var(--ds-text-sm)' }}>
          Unsupported control: {type}
        </div>
      );
  }
};
