// ============================================
// Portfolio OS 2026 — Contact App
// ============================================

import { useState } from 'react';
import AppShell from '../../components/app/AppShell';
import { profile, availability } from '../../data/profile';
import { 
  CallRegular, 
  MailRegular, 
  LocationRegular, 
  WindowDevToolsRegular,
  CodeRegular,
  ShareRegular,
  ClockRegular
} from '@fluentui/react-icons';
import './ContactApp.css';

export default function ContactApp() {
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    // Future: Add toast notification integration here
  };

  return (
    <AppShell>
      <div className="contact-app-container">
        
        {/* Left Column: Availability & Status */}
        <div className="contact-availability-section">
          <div className="availability-card glass-panel">
            <h2 className="section-title">Current Status</h2>
            <div className="status-badge">
              <span className="status-dot pulse"></span>
              {availability.status}
            </div>
            
            <h3 className="subsection-title">Looking For</h3>
            <ul className="roles-list">
              {availability.lookingFor.map((role, i) => (
                <li key={i}><span className="bullet">■</span> {role}</li>
              ))}
            </ul>

            <h3 className="subsection-title">Work Type</h3>
            <div className="work-types">
              {availability.workType.map((type, i) => (
                <span key={i} className="work-type-tag">{type}</span>
              ))}
            </div>

            <div className="response-time">
              <ClockRegular /> {availability.responseTime}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Cards */}
        <div className="contact-cards-section">
          <h2 className="section-title">Get In Touch</h2>
          
          <div className="contact-cards-grid">
            <a href={`tel:${profile.contact.phone.replace(/\\s/g, '')}`} className="contact-card interactive-card">
              <div className="contact-card-icon"><CallRegular /></div>
              <div className="contact-card-info">
                <h4>Phone</h4>
                <p>{profile.contact.phone}</p>
              </div>
            </a>
            
            <a href={`mailto:${profile.contact.email}`} className="contact-card interactive-card">
              <div className="contact-card-icon"><MailRegular /></div>
              <div className="contact-card-info">
                <h4>Email</h4>
                <p>{profile.contact.email}</p>
              </div>
            </a>
            
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="contact-card interactive-card">
              <div className="contact-card-icon"><CodeRegular /></div>
              <div className="contact-card-info">
                <h4>GitHub</h4>
                <p>github.com/code-with-soham</p>
              </div>
            </a>
            
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card interactive-card">
              <div className="contact-card-icon"><ShareRegular /></div>
              <div className="contact-card-info">
                <h4>LinkedIn</h4>
                <p>linkedin.com/in/code-with-soham</p>
              </div>
            </a>
            
            <a href={profile.social.portfolio} target="_blank" rel="noopener noreferrer" className="contact-card interactive-card">
              <div className="contact-card-icon"><WindowDevToolsRegular /></div>
              <div className="contact-card-info">
                <h4>Portfolio</h4>
                <p>portfolio-os-2026.vercel.app</p>
              </div>
            </a>

            <div className="contact-card static-card">
              <div className="contact-card-icon"><LocationRegular /></div>
              <div className="contact-card-info">
                <h4>Location</h4>
                <p>{profile.contact.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
