// ============================================
// Portfolio OS 2026 — Resume App
// ============================================
// Displays resume summary cards, PDF preview, and download actions.
// Uses the PDF from /Soham_June_Resume_1_Page.pdf (Vite public dir).

import { useState } from 'react';
import AppShell from '../../components/app/AppShell';
import { 
  ArrowDownloadRegular, 
  ShareRegular, 
  MailRegular 
} from '@fluentui/react-icons';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { RESUME_URL } from '../../config/constants';
import './ResumeApp.css';

export default function ResumeApp() {
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    try { useAnalyticsStore.getState().trackResumeDownload(); } catch(e){}
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}${RESUME_URL}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    });
  };

  const handleEmailResume = () => {
    const subject = encodeURIComponent('Resume - Soham Kundu');
    const body = encodeURIComponent(
      `Hi,\n\nPlease find my resume at: ${window.location.origin}${RESUME_URL}\n\nBest regards,\nSoham Kundu`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <AppShell>
      <div className="resume-app">
        {/* Summary Cards */}
        <div className="resume-summary-grid">
          <div className="resume-summary-card">
            <span className="resume-summary-icon">💼</span>
            <h3 className="resume-summary-title">Experience</h3>
            <p className="resume-summary-text">
              2+ years in full-stack development. React, Node, AI integrations.
            </p>
          </div>
          <div className="resume-summary-card">
            <span className="resume-summary-icon">⚡</span>
            <h3 className="resume-summary-title">Key Skills</h3>
            <p className="resume-summary-text">
              React, Node.js, Express, MongoDB, Prompt Engineering, Tailwind CSS
            </p>
          </div>
          <div className="resume-summary-card">
            <span className="resume-summary-icon">🎓</span>
            <h3 className="resume-summary-title">Education</h3>
            <p className="resume-summary-text">
              B.Tech CSE — Brainware University (2024–Present) SGPA: 9.14
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="resume-actions">
          <a 
            href={RESUME_URL}
            download="Soham_Kundu_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-action-btn primary" 
            onClick={handleDownload}
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowDownloadRegular /> Download PDF
          </a>
          <button className="resume-action-btn secondary" onClick={handleCopyLink}>
            📋 Copy Link
          </button>
          <button className="resume-action-btn secondary" onClick={handleEmailResume}>
            📧 Email Resume
          </button>
        </div>

        {/* PDF Preview */}
        <div className="resume-pdf-container">
          <iframe
            src={`${RESUME_URL}#toolbar=0&navpanes=0`}
            title="Resume Preview"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Copy Toast */}
        {showToast && (
          <div className="resume-copy-toast">✓ Link copied to clipboard</div>
        )}
      </div>
    </AppShell>
  );
}
