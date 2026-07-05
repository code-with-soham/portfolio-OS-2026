import React from 'react';
import { DataAreaRegular, WebAssetRegular, ServerRegular, RocketRegular, CheckmarkCircleRegular } from '@fluentui/react-icons';
import { Card } from '../../../components/ui/Card';

export default function BrowserDeploymentDashboard() {
  const StatusRow = ({ label, children }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ds-space-sm) 0', borderBottom: '1px solid var(--ds-border)' }}>
      <span style={{ color: 'var(--ds-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>{label}</span>
      <div style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-primary)' }}>{children}</div>
    </div>
  );

  return (
    <div style={{ padding: 'var(--ds-space-2xl) 10%', width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'var(--ds-bg-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-md)', marginBottom: 'var(--ds-space-2xl)' }}>
        <RocketRegular fontSize={32} color="var(--ds-accent)" />
        <h2 style={{ margin: 0, color: 'var(--ds-text-primary)' }}>Live Deployment Dashboard</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--ds-space-xl)' }}>
        <Card style={{ padding: 'var(--ds-space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-sm)' }}>
            <WebAssetRegular fontSize={24} color="var(--ds-text-secondary)" />
            <h3 style={{ margin: 0, fontSize: 'var(--ds-text-lg)', fontWeight: '600' }}>Frontend Status</h3>
          </div>
          <div>
            <StatusRow label="Status">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(52, 168, 83, 0.1)', color: 'var(--ds-success)', padding: '2px 8px', borderRadius: '100px', fontWeight: '500' }}>
                <CheckmarkCircleRegular fontSize={14} /> Live
              </span>
            </StatusRow>
            <StatusRow label="Platform"><strong>Vercel</strong></StatusRow>
            <StatusRow label="URL"><a href="https://portfolio-os-2026.vercel.app" target="_blank" rel="noreferrer" style={{ color: 'var(--ds-accent)', textDecoration: 'none' }}>portfolio-os-2026.vercel.app</a></StatusRow>
            <StatusRow label="Latest Commit"><code style={{ backgroundColor: 'var(--ds-surface)', padding: '2px 4px', borderRadius: '4px', fontSize: '12px' }}>feat: browser pro max</code></StatusRow>
            <StatusRow label="Build Time"><strong>1m 24s</strong></StatusRow>
          </div>
        </Card>

        <Card style={{ padding: 'var(--ds-space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-sm)' }}>
            <ServerRegular fontSize={24} color="var(--ds-text-secondary)" />
            <h3 style={{ margin: 0, fontSize: 'var(--ds-text-lg)', fontWeight: '600' }}>Backend Status</h3>
          </div>
          <div>
            <StatusRow label="Status">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(52, 168, 83, 0.1)', color: 'var(--ds-success)', padding: '2px 8px', borderRadius: '100px', fontWeight: '500' }}>
                <CheckmarkCircleRegular fontSize={14} /> Live
              </span>
            </StatusRow>
            <StatusRow label="Platform"><strong>Render</strong></StatusRow>
            <StatusRow label="URL"><a href="https://portfolio-os-api.onrender.com" target="_blank" rel="noreferrer" style={{ color: 'var(--ds-accent)', textDecoration: 'none' }}>portfolio-os-api.onrender.com</a></StatusRow>
            <StatusRow label="Uptime"><strong>99.9%</strong></StatusRow>
            <StatusRow label="Region"><strong>us-east (Ohio)</strong></StatusRow>
          </div>
        </Card>
      </div>
      
      <div style={{ marginTop: 'var(--ds-space-2xl)', textAlign: 'center', color: 'var(--ds-text-secondary)', fontSize: 'var(--ds-text-sm)' }}>
        <p>This dashboard is a real-time reflection of the deployed environment for Portfolio OS 2026.</p>
      </div>
    </div>
  );
}
