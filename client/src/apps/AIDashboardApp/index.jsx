import { useState, useEffect } from 'react';
import { useAIAnalyticsStore } from '../../store/useAIAnalyticsStore';
import { SparkleRegular, DeleteRegular, HistoryRegular, DataBarVerticalRegular } from '@fluentui/react-icons';

export default function AIDashboardApp() {
  const analytics = useAIAnalyticsStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Trigger re-render every few seconds in case analytics update while open
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SparkleRegular fontSize={24} color="#0078d4" />
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>AI Expert Brain Dashboard</h2>
        </div>
        <button
          onClick={analytics.clearAnalytics}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
        >
          <DeleteRegular fontSize={16} />
          Clear Data
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', padding: '0 16px', background: 'var(--color-bg-surface-hover)' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{ padding: '12px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === 'overview' ? '2px solid #0078d4' : '2px solid transparent', color: activeTab === 'overview' ? '#0078d4' : 'var(--color-text-secondary)', fontWeight: activeTab === 'overview' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <DataBarVerticalRegular fontSize={18} />
          Overview Metrics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{ padding: '12px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === 'history' ? '2px solid #0078d4' : '2px solid transparent', color: activeTab === 'history' ? '#0078d4' : 'var(--color-text-secondary)', fontWeight: activeTab === 'history' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <HistoryRegular fontSize={18} />
          Query History
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--color-bg-surface-content)' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--color-bg-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Total Queries Processed</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0078d4' }}>{analytics.totalQueries}</div>
            </div>
            
            <div style={{ background: 'var(--color-bg-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Most Triggered Intent</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', wordBreak: 'break-word' }}>{analytics.mostAskedIntent}</div>
            </div>

            <div style={{ background: 'var(--color-bg-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Average Response Time</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#107c10' }}>{analytics.averageResponseTimeMs} <span style={{ fontSize: '1rem', fontWeight: 400 }}>ms</span></div>
            </div>

            <div style={{ gridColumn: '1 / -1', background: 'var(--color-bg-surface)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', marginTop: '16px' }}>
              <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '16px' }}>Intent Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(analytics.intentsTriggered).sort((a, b) => b[1] - a[1]).map(([intent, count]) => (
                  <div key={intent} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '150px', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{intent}</div>
                    <div style={{ flex: 1, background: 'var(--color-bg-surface-hover)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#0078d4', width: `${(count / analytics.totalQueries) * 100}%` }}></div>
                    </div>
                    <div style={{ width: '30px', fontSize: '0.875rem', textAlign: 'right', fontWeight: 600 }}>{count}</div>
                  </div>
                ))}
                {Object.keys(analytics.intentsTriggered).length === 0 && (
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', fontStyle: 'italic' }}>No queries processed yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics.recentQueries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-tertiary)' }}>No query history available.</div>
            ) : (
              analytics.recentQueries.map((q, i) => (
                <div key={i} style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>"{q.text}"</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{new Date(q.time).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ padding: '2px 8px', background: 'rgba(0, 120, 212, 0.1)', color: '#0078d4', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{q.intent}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
