import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../../services/profileService';
import { timelineService } from '../../../services/timelineService';
import { skillService } from '../../../services/skillService';
import AboutSidebar from './AboutSidebar';
import AboutContent from './AboutContent';
import AboutStatusBar from './AboutStatusBar';
import '../AboutApp.css'; // Global css for the app

export default function AboutShell() {
  const [activeTab, setActiveTab] = useState('overview');
  console.log('AboutShell mounted');

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: profileService.getProfile });
  const { data: timeline } = useQuery({ queryKey: ['timeline'], queryFn: timelineService.getTimeline });
  const { data: skills } = useQuery({ queryKey: ['skills'], queryFn: skillService.getSkills });

  return (
    <div className="about-shell">
      <div className="about-shell-body">
        <AboutSidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} />
        <AboutContent activeTab={activeTab} profile={profile} timeline={timeline} skills={skills} />
      </div>
      <AboutStatusBar />
    </div>
  );
}
