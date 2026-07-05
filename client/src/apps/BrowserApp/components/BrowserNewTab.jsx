import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBrowserStore } from '../../../store/useBrowserStore';
import { useGitHubStore } from '../../../store/useGitHubStore';
import { 
  SearchRegular, 
  SparkleRegular, 
  HistoryRegular, 
  WeatherSunnyRegular,
  CodeRegular,
  FolderRegular,
  BriefcaseRegular,
  ArrowRightRegular,
  ClockRegular
} from '@fluentui/react-icons';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { BentoGrid, BentoCard, BentoHero, BentoWidget } from '../../../components/ui/BentoGrid';
import { Avatar } from '../../../components/ui/Avatar';

export default function BrowserNewTab() {
  const { navigateTo } = useBrowserStore();
  const { data: githubProfile } = useGitHubStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigateTo(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAISearch = () => {
    if (searchQuery) {
      navigateTo(`ai://${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleShortcut = (url, isInternal = false) => {
    if (isInternal) {
      navigateTo(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--ds-bg-primary)', height: '100%', overflowY: 'auto', padding: '64px 24px' }}>
      
      {/* Portfolio OS Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ fontSize: '48px', fontWeight: '500', marginBottom: '40px', fontFamily: '"Product Sans", sans-serif', letterSpacing: '-2px' }}
      >
        <span style={{ color: '#4285F4' }}>P</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#FBBC05' }}>r</span>
        <span style={{ color: '#4285F4' }}>t</span>
        <span style={{ color: '#34A853' }}>f</span>
        <span style={{ color: '#EA4335' }}>o</span>
        <span style={{ color: '#4285F4' }}>l</span>
        <span style={{ color: '#FBBC05' }}>i</span>
        <span style={{ color: '#34A853' }}>o</span>
      </motion.div>

      {/* Main Search Area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ width: '100%', maxWidth: '720px', marginBottom: '48px' }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <Input 
            name="q" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the web or ask AI..." 
            autoComplete="off" 
            iconLeft={<SearchRegular />}
            iconRight={<div style={{ cursor: 'pointer', color: 'var(--ds-accent)' }} title="AI Search" onClick={handleAISearch}><SparkleRegular /></div>}
            style={{ flex: 1, borderRadius: '24px', padding: '16px 20px', backgroundColor: 'var(--ds-surface)', boxShadow: 'var(--ds-shadow-lg)', fontSize: '16px', border: '1px solid var(--ds-border)' }}
          />
        </form>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={handleSearch}>Google Search</Button>
          <Button variant="primary" onClick={handleAISearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SparkleRegular fontSize={16} /> AI Search
          </Button>
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div style={{ width: '100%', maxWidth: '960px' }}>
        <BentoGrid columns="repeat(4, 1fr)">
          
          {/* Continue Working - Large Hero Card */}
          <BentoHero 
            title="Continue Working"
            subtitle="Resume your last session in Deployment Dashboard"
            icon={<BriefcaseRegular fontSize={24} color="var(--ds-accent)" />}
            action={<Button variant="primary" onClick={() => handleShortcut('portfolio://deployment', true)}>Resume <ArrowRightRegular /></Button>}
            style={{ gridColumn: 'span 4' }}
          />

          {/* Apps / Widgets Row */}
          <BentoCard span={1} onClick={() => handleShortcut('portfolio://projects', true)} delay={0.1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'auto' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(66, 133, 244, 0.1)', color: '#4285F4' }}>
                <FolderRegular fontSize={24} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ds-text-primary)' }}>Projects</h3>
              <p style={{ fontSize: '12px', color: 'var(--ds-text-secondary)' }}>View portfolio</p>
            </div>
          </BentoCard>

          <BentoCard span={1} onClick={() => handleShortcut('https://smart-mock-interview-prep.vercel.app/')} delay={0.15}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'auto' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(234, 67, 53, 0.1)', color: '#EA4335' }}>
                <SparkleRegular fontSize={24} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ds-text-primary)' }}>Interview Prep</h3>
              <p style={{ fontSize: '12px', color: 'var(--ds-text-secondary)' }}>AI Platform</p>
            </div>
          </BentoCard>

          <BentoWidget 
            title="GitHub" 
            value={githubProfile ? githubProfile.publicRepos : '...'} 
            icon={<CodeRegular />} 
            trend="Active" 
            trendUp={true} 
            style={{ gridColumn: 'span 1' }} 
          />

          <BentoWidget 
            title="Weather" 
            value="24°" 
            icon={<WeatherSunnyRegular />} 
            trend="Sunny" 
            trendUp={true} 
            style={{ gridColumn: 'span 1' }} 
          />

          {/* Latest Activity */}
          <BentoCard span={2} delay={0.2}>
            <h3 style={{ fontSize: '14px', color: 'var(--ds-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HistoryRegular /> Latest Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => handleShortcut('chrome://settings', true)}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--ds-surface)', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                  <ClockRegular style={{ margin: 'auto' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--ds-text-primary)' }}>System Settings</div>
                  <div style={{ fontSize: '12px', color: 'var(--ds-text-secondary)' }}>chrome://settings</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => handleShortcut('portfolio://about', true)}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--ds-surface)', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                  <BriefcaseRegular style={{ margin: 'auto' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--ds-text-primary)' }}>About Me</div>
                  <div style={{ fontSize: '12px', color: 'var(--ds-text-secondary)' }}>portfolio://about</div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Suggested Actions */}
          <BentoCard span={2} delay={0.25} style={{ background: 'linear-gradient(135deg, rgba(66,133,244,0.1) 0%, rgba(52,168,83,0.1) 100%)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--ds-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SparkleRegular /> Suggested
            </h3>
            <div style={{ marginTop: 'auto' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--ds-text-primary)', marginBottom: '8px' }}>
                Review Analytics Dashboard
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--ds-text-secondary)', marginBottom: '16px' }}>
                Your portfolio views are up by 24% this week.
              </p>
              <Button variant="primary">View Insights</Button>
            </div>
          </BentoCard>

        </BentoGrid>
      </div>
    </div>
  );
}
