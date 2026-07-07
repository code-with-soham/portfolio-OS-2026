import { AnimatePresence } from 'framer-motion';
import HeroCard from './HeroCard';
import TabOverview from './TabOverview';
import TabSkills from './TabSkills';
import TabExperience from './TabExperience';
import TabContact from './TabContact';

export default function AboutContent({ activeTab, profile, timeline, skills }) {
  
  const renderTab = () => {
    switch(activeTab) {
      case 'overview': return <TabOverview key="overview" profile={profile} />;
      case 'skills': return <TabSkills key="skills" skills={skills} />;
      case 'experience': 
      case 'education': return <TabExperience key="experience" timeline={timeline} />;
      case 'contact': 
      case 'resume': return <TabContact key="contact" profile={profile} />;
      default: return (
        <div key="wip" className="about-tab-container empty-tab">
          <p>Work in Progress: {activeTab}</p>
        </div>
      );
    }
  };

  return (
    <div className="about-content-pane">
      <HeroCard profile={profile} />
      <div className="about-tab-content-wrapper">
        <AnimatePresence mode="wait">
          {renderTab()}
        </AnimatePresence>
      </div>
    </div>
  );
}
