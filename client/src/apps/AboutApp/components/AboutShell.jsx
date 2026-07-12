import { useState } from 'react';
import { profile, experience, education, skills, achievements } from '../../../data/profile';
import AboutSidebar from './AboutSidebar';
import AboutContent from './AboutContent';
import AboutStatusBar from './AboutStatusBar';
import '../AboutApp.css'; // Global css for the app

export default function AboutShell() {
  const [activeTab, setActiveTab] = useState('overview');
  console.log('AboutShell mounted');

  // Combine experience and education for the timeline
  const timeline = { experience, education, achievements };

  return (
    <div className="about-shell">
      <div className="about-shell-body">
        <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} />
        <AboutContent activeTab={activeTab} profile={profile} timeline={timeline} skills={skills} achievements={achievements} />
      </div>
      <AboutStatusBar />
    </div>
  );
}
