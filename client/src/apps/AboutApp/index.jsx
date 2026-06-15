// ============================================
// Portfolio OS 2026 — About App
// ============================================
// Displays user profile, bio, social links, and timeline.
// Fetches from /api/profile and /api/timeline.

import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../services/profileService';
import { timelineService } from '../../services/timelineService';
import AppShell from '../../components/app/AppShell';
import './AboutApp.css';

export default function AboutApp() {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const {
    data: timeline,
    isLoading: timelineLoading,
  } = useQuery({
    queryKey: ['timeline'],
    queryFn: timelineService.getTimeline,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = profileLoading || timelineLoading;

  return (
    <AppShell isLoading={isLoading} error={profileError} onRetry={refetchProfile}>
      <div className="about-app">
        {/* Hero Section */}
        {profile && (
          <div className="about-hero">
            <div className="about-avatar">
              {profile.name?.split(' ').map((n) => n[0]).join('')}
            </div>
            <h1 className="about-name">{profile.name}</h1>
            <p className="about-title">{profile.title}</p>
            <p className="about-tagline">"{profile.tagline}"</p>
            {profile.availableForHire && (
              <div className="about-hire-badge">
                <span className="about-hire-dot" />
                Available for hire
              </div>
            )}
          </div>
        )}

        {/* Bio */}
        {profile?.bio && (
          <div className="about-bio">
            <p>{profile.bio}</p>
          </div>
        )}

        {/* Info Grid */}
        {profile && (
          <div className="about-info-grid">
            <div className="about-info-card">
              <span className="about-info-icon">📍</span>
              <div className="about-info-content">
                <span className="about-info-label">Location</span>
                <span className="about-info-value">
                  {profile.location?.city}, {profile.location?.country}
                </span>
              </div>
            </div>
            <div className="about-info-card">
              <span className="about-info-icon">💼</span>
              <div className="about-info-content">
                <span className="about-info-label">Experience</span>
                <span className="about-info-value">{profile.yearsOfExperience}+ years</span>
              </div>
            </div>
            <div className="about-info-card">
              <span className="about-info-icon">📧</span>
              <div className="about-info-content">
                <span className="about-info-label">Email</span>
                <span className="about-info-value">{profile.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        {profile?.social && (
          <div className="about-social-row">
            <a
              className="about-social-btn"
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              🐙 GitHub
            </a>
            <a
              className="about-social-btn"
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 LinkedIn
            </a>
            <a
              className="about-social-btn"
              href={profile.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              🐦 Twitter
            </a>
            <a
              className="about-social-btn"
              href={profile.social.portfolio}
              target="_blank"
              rel="noopener noreferrer"
            >
              🌐 Portfolio
            </a>
          </div>
        )}

        {/* Timeline */}
        {timeline && timeline.length > 0 && (
          <div>
            <h2 className="about-section-title">📅 Timeline</h2>
            <div className="about-timeline">
              {timeline
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .map((item) => (
                  <div
                    key={item.id}
                    className={`about-timeline-item ${item.current ? 'current' : ''}`}
                  >
                    <div className="about-timeline-dot" />
                    <h3 className="about-timeline-title">
                      {item.icon} {item.title}
                    </h3>
                    <p className="about-timeline-org">{item.organization}</p>
                    <p className="about-timeline-date">
                      {new Date(item.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      —{' '}
                      {item.current
                        ? 'Present'
                        : new Date(item.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                    </p>
                    <p className="about-timeline-desc">{item.description}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
