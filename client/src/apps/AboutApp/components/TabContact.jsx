import { motion } from 'framer-motion';
import { CodeRegular, ShareRegular, MailRegular, CallRegular, DocumentPdfRegular } from '@fluentui/react-icons';

export default function TabContact({ profile }) {
  if (!profile) return null;

  return (
    <motion.div 
      className="about-tab-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="contact-grid">
        <a href={profile.social?.github} target="_blank" rel="noreferrer" className="contact-card">
          <CodeRegular fontSize={32} color="var(--color-text-primary)" />
          <div className="contact-info">
            <h3>GitHub</h3>
            <span className="contact-status connected">Connected</span>
          </div>
        </a>
        
        <a href={profile.social?.linkedin} target="_blank" rel="noreferrer" className="contact-card">
          <ShareRegular fontSize={32} color="#0078d4" />
          <div className="contact-info">
            <h3>LinkedIn</h3>
            <span className="contact-status available">Available</span>
          </div>
        </a>
        
        <a href={`mailto:${profile.email}`} className="contact-card">
          <MailRegular fontSize={32} color="#E74C3C" />
          <div className="contact-info">
            <h3>Email</h3>
            <span className="contact-status available">{profile.email}</span>
          </div>
        </a>

        <div className="contact-card">
          <CallRegular fontSize={32} color="#2ECC71" />
          <div className="contact-info">
            <h3>Phone</h3>
            <span className="contact-status available">{profile.phone}</span>
          </div>
        </div>
      </div>

      <div className="resume-preview-section mt-8">
        <h3 className="section-title">Resume Preview</h3>
        <div className="resume-preview-card">
          <DocumentPdfRegular fontSize={48} color="#E74C3C" />
          <div className="resume-info">
            <h4>Soham_Resume_2026.pdf</h4>
            <p>Last Updated: June 2026</p>
            <span className="ats-score">ATS Score: 96%</span>
          </div>
          <button 
            className="preview-action-btn"
            onClick={() => window.open(profile.resumeUrl, '_blank')}
          >
            Download
          </button>
        </div>
      </div>
    </motion.div>
  );
}
