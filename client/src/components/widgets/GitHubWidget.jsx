import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GitHubWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/code-with-soham')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={data?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
          alt="GitHub Avatar"
          style={{ width: '48px', height: '48px', borderRadius: '50%' }}
        />
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>GitHub</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>@code-with-soham</span>
        </div>
      </div>

      {!loading && data && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
          <div style={{ background: 'var(--color-bg-surface-hover)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{data.followers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Followers</div>
          </div>
          <div style={{ background: 'var(--color-bg-surface-hover)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{data.public_repos || 0}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Repositories</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
