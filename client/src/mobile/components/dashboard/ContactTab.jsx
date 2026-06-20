import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MailRegular, 
  LinkRegular, 
  CallRegular, 
  GlobeRegular, 
  PersonRegular,
  BookRegular
} from '@fluentui/react-icons';
import { useGitHubStore } from '../../../store/useGitHubStore';
import { useAnalyticsStore } from '../../../store/useAnalyticsStore';

export default function ContactTab() {
  const { data: githubData, isLoading, fetchData } = useGitHubStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Contact Quick Actions */}
      <section>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Connect With Me</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          
          <a href="mailto:sohamkundu@example.com" style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div whileTap={{ scale: 0.95 }} style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <MailRegular fontSize={28} color="var(--color-accent)" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Email</span>
            </motion.div>
          </a>

          <a href="https://linkedin.com/in/sohamkundu" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div whileTap={{ scale: 0.95 }} style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <LinkRegular fontSize={28} color="#0077b5" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>LinkedIn</span>
            </motion.div>
          </a>

          <a href="tel:+910000000000" style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div whileTap={{ scale: 0.95 }} style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <CallRegular fontSize={28} color="var(--color-accent)" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Call</span>
            </motion.div>
          </a>

          <a href="https://portfolio-os.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div whileTap={{ scale: 0.95 }} style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <GlobeRegular fontSize={28} color="var(--color-accent)" />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Portfolio</span>
            </motion.div>
          </a>

        </div>
      </section>

      {/* GitHub Analytics Engine */}
      <section>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>GitHub Live Stats</h3>
        
        {isLoading ? (
          <div style={{ background: 'var(--color-bg-surface)', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
            <div className="loading-spinner" style={{ margin: '0 auto', width: '24px', height: '24px', border: '3px solid var(--color-border)', borderTop: '3px solid var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>Fetching live data...</p>
          </div>
        ) : githubData ? (
          <div style={{ background: 'var(--color-bg-surface)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-bg-elevated)', borderBottom: '1px solid var(--color-border)' }}>
              <img src={githubData.avatar} alt="GitHub Avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid var(--color-accent)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '16px' }}>code-with-soham</h4>
                <a 
                  href={githubData.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: 'var(--color-accent)', fontSize: '12px', textDecoration: 'none' }}
                  onClick={() => { try { useAnalyticsStore.getState().trackGithubClick(); } catch(e){} }}
                >
                  View Profile →
                </a>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-bg-base)', padding: '12px', borderRadius: '8px' }}>
                <BookRegular fontSize={24} color="var(--color-accent)" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{githubData.publicRepos}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Repositories</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-bg-base)', padding: '12px', borderRadius: '8px' }}>
                <PersonRegular fontSize={24} color="var(--color-accent)" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{githubData.followers}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Followers</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-bg-base)', padding: '12px', borderRadius: '8px' }}>
                <PersonRegular fontSize={24} color="var(--color-text-secondary)" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{githubData.following}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Following</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--color-bg-surface)', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
            Unable to load GitHub stats.
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
