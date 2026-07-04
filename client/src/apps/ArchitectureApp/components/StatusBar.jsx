import { CheckmarkCircleRegular } from '@fluentui/react-icons';

export default function StatusBar() {
  return (
    <div style={{
      height: '32px',
      borderTop: '1px solid #222',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      fontSize: '11px',
      color: '#888',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4CAF50' }}>
        <CheckmarkCircleRegular fontSize={14} />
        <span>Architecture Score 98/100</span>
      </div>
      <div style={{ width: '1px', height: '12px', background: '#333' }} />
      <span>Modular</span>
      <span>Lazy Loaded</span>
      <span>AI Driven</span>
      <span>Mobile Ready</span>
      <span>PWA</span>
      <span>Responsive</span>
      <span>Performance Optimized</span>
    </div>
  );
}
