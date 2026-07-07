import { motion } from 'framer-motion';
import { SparkleRegular, DocumentRegular, AppFolderRegular, CodeRegular, AddRegular } from '@fluentui/react-icons';

export default function TabOverview({ profile }) {
  if (!profile) return null;

  return (
    <motion.div 
      className="about-tab-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="overview-grid">
        
        {/* Quick Stats */}
        <div className="overview-section stats-grid">
          <div className="stat-card">
            <span className="stat-value">12+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">35+</span>
            <span className="stat-label">Skills</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">500+</span>
            <span className="stat-label">GitHub</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">7 Layers</span>
            <span className="stat-label">Architecture</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">40+</span>
            <span className="stat-label">AI Features</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">92%</span>
            <span className="stat-label">Portfolio Health</span>
          </div>
        </div>

        <div className="overview-two-col">
          {/* Profile Completion & Health */}
          <div className="overview-section">
            <h3 className="section-title">Profile Strength</h3>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '92%' }}></div>
            </div>
            <p className="progress-text">92% Complete</p>
            
            <div className="health-metrics mt-4">
              <div className="health-row"><span>Documentation</span> <span>95%</span></div>
              <div className="health-row"><span>Projects</span> <span>100%</span></div>
              <div className="health-row"><span>GitHub</span> <span>90%</span></div>
              <div className="health-row"><span>Resume</span> <span>100%</span></div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="overview-section ai-summary-card">
            <h3 className="section-title"><SparkleRegular color="#F1C40F" /> AI Summary</h3>
            <p className="ai-summary-text">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Availability & Activity */}
        <div className="overview-two-col">
          <div className="overview-section">
            <h3 className="section-title">Availability</h3>
            <ul className="availability-list">
              <li>
                <span className="check">{profile.availableForHire ? '✔' : '❌'}</span> Available for Hire
              </li>
              <li><span className="check">✔</span> Full-time</li>
              <li><span className="check">✔</span> Remote</li>
            </ul>
          </div>
          
          <div className="overview-section">
            <h3 className="section-title">Activity Feed</h3>
            <ul className="activity-list">
              <li><AddRegular /> Added Weather Pro</li>
              <li><AddRegular /> Architecture Explorer</li>
              <li><AddRegular /> Recruiter Dashboard</li>
              <li><AddRegular /> Voice Copilot</li>
            </ul>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
