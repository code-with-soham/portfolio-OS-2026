import { motion } from 'framer-motion';
import { 
  ArrowDownloadRegular, 
  CodeRegular, 
  ShareRegular, 
  WindowDevToolsRegular,
  LocationRegular
} from '@fluentui/react-icons';

export default function HeroCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="about-hero-card">
      <div className="hero-card-content">
        <div className="hero-info">
          <h1 className="hero-name">{profile.name}</h1>
          <h2 className="hero-title">{profile.title}</h2>
          <p className="hero-tags">AI • MERN • React • Node</p>
          <p className="hero-location"><LocationRegular fontSize={14} /> West Bengal, India</p>
          
          <div className="hero-availability">
            <span className="hero-status-dot pulse"></span>
            Available for Opportunities
          </div>
        </div>

        <div className="hero-actions">
          <button 
            className="hero-action-btn primary"
            onClick={() => window.open(profile.resumeUrl, '_blank')}
          >
            <ArrowDownloadRegular /> Download Resume
          </button>
          <button 
            className="hero-action-btn"
            onClick={() => window.open(profile.social?.github, '_blank')}
          >
            <CodeRegular /> GitHub
          </button>
          <button 
            className="hero-action-btn"
            onClick={() => window.open(profile.social?.linkedin, '_blank')}
          >
            <ShareRegular /> LinkedIn
          </button>
          <button 
            className="hero-action-btn"
            onClick={() => window.open(profile.social?.portfolio, '_blank')}
          >
            <WindowDevToolsRegular /> Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
