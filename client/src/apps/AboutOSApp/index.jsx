// ============================================
// Portfolio OS 2026 — About OS App v3.0 (System Properties)
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DesktopRegular, 
  AppsListRegular, 
  PuzzlePieceRegular, 
  DatabaseRegular, 
  BotRegular, 
  PersonRegular,
  FlashRegular,
  BoxRegular,
  CloudRegular,
  ShieldCheckmarkRegular
} from '@fluentui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../services/profileService';
import { SYSTEM_INFO } from '../../config/systemInfo';
import metricsData from '../../data/metrics.json';
import { useDesktopStore } from '../../store/useDesktopStore';
import './AboutOSApp.css';

// Custom Hook for Uptime
function useUptime() {
  const bootTime = useDesktopStore((s) => s.bootTime);
  const [uptime, setUptime] = useState('00h 00m 00s');

  useEffect(() => {
    const updateUptime = () => {
      const diff = Math.floor((Date.now() - bootTime) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setUptime(`${h}h ${m}m ${s}s`);
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, [bootTime]);

  return uptime;
}

// Animated Counter Component
function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);
    
    const animate = () => {
      start += increment;
      if (start < value) {
        setDisplayValue(Math.ceil(start));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function AboutOSApp() {
  const uptime = useUptime();
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: profileService.getProfile });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="about-os-app"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Hero Banner */}
      <motion.div className="about-os-hero" variants={itemVariants}>
        <div className="about-os-logo-container">
          <DesktopRegular fontSize={40} color="white" />
        </div>
        <div className="about-os-title">
          <h1>{SYSTEM_INFO.name}</h1>
          <p>Version {SYSTEM_INFO.version} • Build {SYSTEM_INFO.build}</p>
          <span className="release-channel">Stable Release</span>
        </div>
      </motion.div>

      <div className="about-os-content">
        
        {/* System Health & AI */}
        <motion.div variants={itemVariants}>
          <h2 className="os-section-title">System Status</h2>
          <div className="os-card-grid">
            <div className="os-card">
              <div className="os-card-header">
                <ShieldCheckmarkRegular fontSize={20} color="#2ECC71" />
                <span>System Health</span>
              </div>
              <div className="os-card-value">
                <span className="status-dot online"></span> Optimal
              </div>
              <div className="os-card-subtext">All Services Running</div>
            </div>
            
            <div className="os-card">
              <div className="os-card-header">
                <BotRegular fontSize={20} color="#9B59B6" />
                <span>AI Engine</span>
              </div>
              <div className="os-card-value">
                <span className="status-dot online"></span> Online
              </div>
              <div className="os-card-subtext">Gemini 2.5 Flash</div>
            </div>

            <div className="os-card">
              <div className="os-card-header">
                <FlashRegular fontSize={20} color="#F1C40F" />
                <span>Current Uptime</span>
              </div>
              <div className="os-card-value">{uptime}</div>
              <div className="os-card-subtext">Since Last Boot</div>
            </div>
          </div>
        </motion.div>

        {/* System Metrics */}
        <motion.div variants={itemVariants}>
          <h2 className="os-section-title">Ecosystem Metrics</h2>
          <div className="os-card-grid">
            <div className="os-card">
              <div className="os-card-header">
                <AppsListRegular fontSize={20} />
                <span>Apps Installed</span>
              </div>
              <div className="os-card-value"><AnimatedNumber value={metricsData.apps || 0} /></div>
            </div>
            
            <div className="os-card">
              <div className="os-card-header">
                <PuzzlePieceRegular fontSize={20} />
                <span>Components</span>
              </div>
              <div className="os-card-value"><AnimatedNumber value={metricsData.components || 0} /></div>
            </div>
            
            <div className="os-card">
              <div className="os-card-header">
                <DatabaseRegular fontSize={20} />
                <span>State Stores</span>
              </div>
              <div className="os-card-value"><AnimatedNumber value={metricsData.stores || 0} /></div>
            </div>

            <div className="os-card">
              <div className="os-card-header">
                <BoxRegular fontSize={20} />
                <span>Widgets</span>
              </div>
              <div className="os-card-value"><AnimatedNumber value={metricsData.widgets || 0} /></div>
            </div>
          </div>
        </motion.div>

        {/* System Architecture */}
        <motion.div variants={itemVariants}>
          <h2 className="os-section-title">System Architecture</h2>
          <div className="os-badge-grid">
            <div className="os-tech-badge">React 18.2</div>
            <div className="os-tech-badge">Node.js Runtime</div>
            <div className="os-tech-badge">Express 5.x</div>
            <div className="os-tech-badge">MongoDB Atlas</div>
            <div className="os-tech-badge">Vite Bundler</div>
            <div className="os-tech-badge">Framer Motion</div>
            <div className="os-tech-badge">Fluent UI Icons</div>
          </div>
        </motion.div>

        {/* Developer Profile */}
        <motion.div variants={itemVariants}>
          <h2 className="os-section-title">Portfolio Creator</h2>
          <div className="os-profile-card">
            <img 
              src={profile?.avatar || "/src/assets/images/profile 2.jpeg"} 
              alt={profile?.name || "Developer"} 
              className="os-profile-avatar"
            />
            <div className="os-profile-info">
              <h3><span className="status-dot online"></span> {profile?.name || SYSTEM_INFO.author}</h3>
              <p>Portfolio OS Creator • Full Stack Developer</p>
              <div className="os-profile-links">
                {profile?.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="os-profile-link">
                    View Resume
                  </a>
                )}
                {profile?.social?.github && (
                  <a href={profile.social.github} target="_blank" rel="noreferrer" className="os-profile-link">
                    View GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <motion.div className="about-os-footer" variants={itemVariants}>
        Portfolio OS © {new Date().getFullYear()} {SYSTEM_INFO.author}. All rights reserved.
      </motion.div>
    </motion.div>
  );
}
