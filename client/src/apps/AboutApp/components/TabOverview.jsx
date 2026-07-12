import { motion } from 'framer-motion';
import { SparkleRegular, DocumentRegular, AppFolderRegular, CodeRegular, AddRegular } from '@fluentui/react-icons';
import { availability } from '../../../data/profile';

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
            <span className="stat-value">3+</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">25+</span>
            <span className="stat-label">Skills</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">2+</span>
            <span className="stat-label">Years Exp</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">1</span>
            <span className="stat-label">Internship</span>
          </div>
        </div>

        <div className="overview-two-col">
          {/* Profile Completion & Health */}
          <div className="overview-section">
            <h3 className="section-title">Career Objective</h3>
            <p className="progress-text" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
              {profile.overview.careerObjective}
            </p>
          </div>

          {/* AI Summary */}
          <div className="overview-section ai-summary-card">
            <h3 className="section-title"><SparkleRegular color="#F1C40F" /> Overview</h3>
            <p className="ai-summary-text">
              {profile.overview.summary}
            </p>
          </div>
        </div>

        {/* Availability & Activity */}
        <div className="overview-two-col">
          <div className="overview-section">
            <h3 className="section-title">Availability</h3>
            <ul className="availability-list">
              <li>
                <span className="check">✔</span> Status: {availability.status}
              </li>
              {availability.workType.map((type, i) => (
                <li key={i}><span className="check">✔</span> {type}</li>
              ))}
            </ul>
          </div>
          
          <div className="overview-section">
            <h3 className="section-title">Areas of Interest</h3>
            <ul className="activity-list">
              {profile.overview.areasOfInterest.map((area, i) => (
                <li key={i}><AddRegular /> {area}</li>
              ))}
            </ul>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
