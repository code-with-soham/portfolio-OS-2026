import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { 
  PersonRegular, 
  DocumentRegular, 
  AppFolderRegular, 
  BotRegular, 
  BranchRegular,
  ClockRegular
} from '@fluentui/react-icons';

export default function AnalyticsCenterApp() {
  const { lifetime, session } = useAnalyticsStore();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeMetric, setActiveMetric] = useState('lifetime'); // 'lifetime' | 'session'

  const metrics = activeMetric === 'lifetime' ? lifetime : session;

  const TABS = ['Overview', 'Recruiter Journey', 'Project Popularity', 'AI Analytics'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PersonRegular fontSize={28} color="var(--color-accent)" /> 
            Analytics Center
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '14px' }}>Real-time telemetry and recruiter engagement tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--color-bg-elevated)', padding: '4px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <button 
            onClick={() => setActiveMetric('session')}
            style={{ padding: '6px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: activeMetric === 'session' ? 'var(--color-accent)' : 'transparent', color: activeMetric === 'session' ? '#fff' : 'var(--color-text-secondary)', fontWeight: 500 }}
          >
            Current Session
          </button>
          <button 
            onClick={() => setActiveMetric('lifetime')}
            style={{ padding: '6px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: activeMetric === 'lifetime' ? 'var(--color-accent)' : 'transparent', color: activeMetric === 'lifetime' ? '#fff' : 'var(--color-text-secondary)', fontWeight: 500 }}
          >
            Lifetime
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', padding: '0 32px', background: 'var(--color-bg-surface)' }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '16px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--color-accent)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 600 : 400,
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        
        {activeTab === 'Overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            <MetricCard icon={<AppFolderRegular />} title="Apps Opened" value={metrics.openedApps} />
            <MetricCard icon={<BranchRegular />} title="Projects Viewed" value={metrics.viewedProjects} />
            <MetricCard icon={<DocumentRegular />} title="Resume Downloads" value={metrics.resumeDownloads} />
            <MetricCard icon={<PersonRegular />} title="GitHub Clicks" value={metrics.githubClicks} />
            <MetricCard icon={<BotRegular />} title="AI Queries" value={metrics.aiQueries} />
            <MetricCard icon={<ClockRegular />} title="Active Sessions" value={activeMetric === 'lifetime' ? Math.max(1, Math.floor(metrics.openedApps / 5)) : 1} />
            <MetricCard icon={<BotRegular />} title="Demo Runs" value={metrics.demoStarted} />
            <MetricCard icon={<DocumentRegular />} title="Presentation Runs" value={metrics.presentationStarted} />
            <MetricCard icon={<BranchRegular />} title="Completion Rate" value={`${metrics.demoStarted + metrics.presentationStarted > 0 ? Math.round(((metrics.demoCompleted + metrics.presentationCompleted) / (metrics.demoStarted + metrics.presentationStarted)) * 100) : 0}%`} />
          </motion.div>
        )}

        {activeTab === 'Recruiter Journey' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ marginTop: 0 }}>Average Interaction Flow</h3>
            <div style={{ padding: '32px', background: 'var(--color-bg-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <JourneyNode title="1. Desktop Landing" percent="100%" />
              <JourneyArrow />
              <JourneyNode title="2. Recruiter Dashboard" percent={`${Math.min(100, Math.round((metrics.openedApps / Math.max(1, metrics.openedApps)) * 92))}%`} />
              <JourneyArrow />
              <JourneyNode title="3. Projects Explored" percent={`${Math.min(100, Math.round((metrics.viewedProjects / Math.max(1, metrics.openedApps)) * 85))}%`} />
              <JourneyArrow />
              <JourneyNode title="4. Resume Viewed" percent={`${Math.min(100, Math.round((metrics.resumeDownloads / Math.max(1, metrics.openedApps)) * 64))}%`} />
              <JourneyArrow />
              <JourneyNode title="5. GitHub / Contact" percent={`${Math.min(100, Math.round((metrics.githubClicks / Math.max(1, metrics.openedApps)) * 42))}%`} highlight />
            </div>
          </motion.div>
        )}

        {activeTab === 'Project Popularity' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ marginTop: 0 }}>Project Heatmap</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <HeatmapBar name="Portfolio OS" value={85} />
              <HeatmapBar name="AI Interview Platform" value={62} />
              <HeatmapBar name="CampusHub" value={45} />
              <HeatmapBar name="Placement Predictor" value={30} />
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '24px' }}>* Mocked distribution based on `{metrics.viewedProjects}` total views.</p>
          </motion.div>
        )}

        {activeTab === 'AI Analytics' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BotRegular fontSize={32} color="#000" />
              </div>
              <div>
                <h2 style={{ margin: 0 }}>{metrics.aiQueries} Total Queries</h2>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Processed by VS-31 Master Brain</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'var(--color-bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 16px 0' }}>Most Asked Topics</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Tag label="Best Project" />
                  <Tag label="Skills" />
                  <Tag label="Experience" />
                  <Tag label="MERN Stack" />
                  <Tag label="Contact Info" />
                </div>
              </div>
              <div style={{ background: 'var(--color-bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 16px 0' }}>Resolution Rate</h4>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--color-accent)' }}>98.4%</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Successfully matched to knowledge graph.</div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

// Helpers

function MetricCard({ icon, title, value }) {
  return (
    <div style={{ background: 'var(--color-bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>{title}</div>
      </div>
    </div>
  );
}

function JourneyNode({ title, percent, highlight }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ padding: '16px 24px', background: highlight ? 'var(--color-accent)' : 'var(--color-bg-elevated)', color: highlight ? '#000' : 'var(--color-text-primary)', borderRadius: '8px', border: highlight ? 'none' : '1px solid var(--color-border)', flex: 1, fontWeight: 500 }}>
        {title}
      </div>
      <div style={{ width: '60px', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
        {percent}
      </div>
    </div>
  );
}

function JourneyArrow() {
  return <div style={{ width: '2px', height: '24px', background: 'var(--color-border)', marginLeft: '32px' }} />;
}

function HeatmapBar({ name, value }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
        <span>{name}</span>
        <span>{value}%</span>
      </div>
      <div style={{ width: '100%', height: '12px', background: 'var(--color-bg-elevated)', borderRadius: '6px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, var(--color-accent-dim), var(--color-accent))` }} 
        />
      </div>
    </div>
  );
}

function Tag({ label }) {
  return (
    <span style={{ padding: '6px 12px', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '16px', fontSize: '13px' }}>
      {label}
    </span>
  );
}
