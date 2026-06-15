// ============================================
// Portfolio OS 2026 — Resume App
// ============================================
// Displays resume summary cards, PDF preview, and download actions.
// Uses the PDF from /Soham_June_Resume_1_Page.pdf (Vite public dir).

import { useState } from 'react';
import AppShell from '../../components/app/AppShell';
import './ResumeApp.css';

const RESUME_URL = '/Soham_June_Resume_1_Page.pdf';

export default function ResumeApp() {
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_URL;
    link.download = 'Soham_Kundu_Resume.pdf';
    link.click();
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
              2+ years in full-stack development. Freelance projects & personal builds.
            </p>
          </div>
          <div className="resume-summary-card">
            <span className="resume-summary-icon">⚡</span>
            <h3 className="resume-summary-title">Key Skills</h3>
            <p className="resume-summary-text">
              React, Node.js, Express, MongoDB, TypeScript, TailwindCSS
            </p>
          </div>
          <div className="resume-summary-card">
            <span className="resume-summary-icon">🎓</span>
            <h3 className="resume-summary-title">Education</h3>
            <p className="resume-summary-text">
              B.Tech CSE — UEM Kolkata (2024–Present)
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="resume-actions">
          <button className="resume-action-btn primary" onClick={handleDownload}>
            📥 Download PDF
          </button>
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
