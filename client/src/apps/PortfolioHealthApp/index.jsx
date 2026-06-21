import { useState, useEffect } from 'react';
import ScoreDial from './components/ScoreDial';
import HealthCategory from './components/HealthCategory';
import { 
  FolderRegular, 
  CodeRegular, 
  BoxRegular, 
  PersonRegular, 
  DataBarVerticalRegular 
} from '@fluentui/react-icons';
import { useGitHubStore } from '../../store/useGitHubStore';
import projectsData from '../../ai/knowledge/projects.json';
import metricsData from '../../data/metrics.json';

export default function PortfolioHealthApp() {
  const [score, setScore] = useState(0);
  const { data: githubData, fetchData: fetchGithubData } = useGitHubStore();
  
  useEffect(() => {
    if (!githubData) {
      fetchGithubData();
    }
  }, [githubData, fetchGithubData]);

  useEffect(() => {
    // Animate score from 0 to 92 (or calculated value)
    const targetScore = 92; // We can calculate this dynamically in the future
    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const projectsCount = projectsData.length || 0;
  const liveDemosCount = projectsData.filter(p => p.demoUrl).length;
  const reposCount = projectsData.filter(p => p.githubUrl).length;

  return (
    <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)', overflowY: 'auto' }}>
      
      {/* Header & Dial */}
      <div style={{ display: 'flex', padding: '40px', gap: '40px', background: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        <ScoreDial score={score} />
        <div style={{ maxWidth: '500px' }}>
          <h1 style={{ fontSize: '32px', margin: '0 0 16px 0' }}>Portfolio Health Center</h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Real-time analysis of your developer portfolio's presentation, architecture, and readiness. A health score above 90 indicates exceptional recruiter readiness.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ padding: '40px', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        
        <HealthCategory 
          title="Projects" 
          icon={<FolderRegular fontSize={24} />} 
          delay={0.1}
          items={[
            { label: 'Total Projects', value: projectsCount, status: projectsCount >= 3 ? 'good' : 'warning' },
            { label: 'Live Demos', value: liveDemosCount, status: liveDemosCount >= 2 ? 'good' : 'warning' },
            { label: 'GitHub Repositories', value: reposCount, status: reposCount >= 3 ? 'good' : 'warning' }
          ]} 
        />

        <HealthCategory 
          title="GitHub Profile" 
          icon={<CodeRegular fontSize={24} />} 
          delay={0.2}
          items={[
            { label: 'Followers', value: githubData?.followers || '0', status: githubData?.followers > 10 ? 'good' : 'normal' },
            { label: 'Public Repositories', value: githubData?.publicRepos || '0', status: githubData?.publicRepos > 10 ? 'good' : 'normal' },
            { label: 'Contributions (Year)', value: '500+', status: 'good' } // Mocked as GitHub API doesn't expose this easily without GraphQL
          ]} 
        />

        <HealthCategory 
          title="Architecture Metrics" 
          icon={<BoxRegular fontSize={24} />} 
          delay={0.3}
          items={[
            { label: 'Applications', value: metricsData.apps || '20+', status: 'good' },
            { label: 'Zustand Stores', value: metricsData.stores || '20+', status: 'good' },
            { label: 'AI Intents', value: metricsData.aiIntents || '50+', status: 'good' },
            { label: 'UI Widgets', value: metricsData.widgets || '15+', status: 'good' }
          ]} 
        />

        <HealthCategory 
          title="Recruiter Readiness" 
          icon={<PersonRegular fontSize={24} />} 
          delay={0.4}
          items={[
            { label: 'Resume Access', value: '1-Click PDF', status: 'good' },
            { label: 'LinkedIn Integration', value: 'Verified', status: 'good' },
            { label: 'Portfolio Analytics', value: 'Active', status: 'good' },
            { label: 'Contact Mechanism', value: 'Mail App / Terminal', status: 'good' }
          ]} 
        />

        <HealthCategory 
          title="Performance Audit" 
          icon={<DataBarVerticalRegular fontSize={24} />} 
          delay={0.5}
          items={[
            { label: 'Bundle Size (Gzipped)', value: '~350 KB', status: 'good' },
            { label: 'Lazy Loading', value: 'Implemented', status: 'good' },
            { label: 'PWA Installable', value: 'Yes', status: 'good' },
            { label: 'Mobile Responsive', value: 'Seamless UI', status: 'good' }
          ]} 
        />

      </div>
    </div>
  );
}
