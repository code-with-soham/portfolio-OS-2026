import { WeatherSunnyRegular } from '@fluentui/react-icons';

export default function WeatherWidget() {
  return (
    <div
      className="glass-heavy"
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-panel)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(0, 191, 255, 0.05))',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>San Francisco, CA</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>72°</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Sunny</span>
        </div>
      </div>
      <div>
        <WeatherSunnyRegular style={{ fontSize: '3rem', color: '#FFD700' }} />
      </div>
    </div>
  );
}
