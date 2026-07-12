import { motion } from 'framer-motion';
import { 
  ArrowDownloadRegular, 
  CodeRegular, 
  ShareRegular, 
  WindowDevToolsRegular,
  LocationRegular
} from '@fluentui/react-icons';
import avatar from '../../../../assets/images/profile.jpg';
import { RESUME_URL } from '../../../../config/constants';

export default function HeroCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="about-hero-card">
      <div className="hero-card-content" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        
        {/* Avatar Section */}
        <div className="hero-avatar-container" style={{ flexShrink: 0 }}>
          <img 
            src={avatar} 
            alt={profile.name} 
            className="hero-avatar"
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '2px solid var(--color-accent)'
            }}
          />
        </div>

        <div className="hero-info" style={{ flex: 1 }}>
          <h1 className="hero-name">{profile.name}</h1>
          <h2 className="hero-title">{profile.title}</h2>
          
          <div className="hero-tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', marginBottom: '8px' }}>
            <span className="badge" style={{ background: 'var(--color-bg-surface-hover)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>AI • MERN • React • Node</span>
            <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>SGPA: 9.14</span>
            <span className="badge" style={{ background: 'rgba(0, 120, 212, 0.1)', color: 'var(--color-accent)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>Frontend Developer Intern</span>
          </div>

          <p className="hero-location" style={{ marginTop: '8px' }}><LocationRegular fontSize={14} /> {profile.contact.location}</p>
          
          <div className="hero-availability" style={{ marginTop: '12px' }}>
            <span className="hero-status-dot pulse"></span>
            Available for Opportunities
          </div>
        </div>

      </div>

      <div className="hero-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <a 
          href={RESUME_URL} 
          download 
          target="_blank" 
          rel="noopener noreferrer"
          className="hero-action-btn primary"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowDownloadRegular /> Download Resume
        </a>
        <a 
          href={profile.social?.github}
          target="_blank" 
          rel="noopener noreferrer"
          className="hero-action-btn"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <CodeRegular /> GitHub
        </a>
        <a 
          href={profile.social?.linkedin}
          target="_blank" 
          rel="noopener noreferrer"
          className="hero-action-btn"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ShareRegular /> LinkedIn
        </a>
        <a 
          href={profile.social?.portfolio}
          target="_blank" 
          rel="noopener noreferrer"
          className="hero-action-btn"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <WindowDevToolsRegular /> Portfolio
        </a>
      </div>
    </div>
  );
}
