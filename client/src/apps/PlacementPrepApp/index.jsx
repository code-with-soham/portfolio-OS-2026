// client/src/apps/PlacementPrepApp/index.jsx
import React, { useState } from 'react';
import { 
  BoardRegular, 
  MapRegular, 
  BotRegular, 
  PersonFeedbackRegular, 
  BookOpenRegular, 
  SettingsRegular,
  ArrowRepeatAllRegular,
  TrophyRegular,
  DocumentRegular,
  ShieldRegular,
  BuildingRegular,
  DocumentSearchRegular,
  CalendarMonthRegular
} from '@fluentui/react-icons';
import './PlacementPrepApp.css';

import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import StudyCoach from './components/StudyCoach';
import InterviewSimulator from './components/InterviewSimulator';
import KnowledgeVault from './components/KnowledgeVault';
import RevisionCenter from './components/RevisionCenter';
import ContestTracker from './components/ContestTracker';
import InterviewJournal from './components/InterviewJournal';
import ProjectDefense from './components/ProjectDefense';
import DreamCompany from './components/DreamCompany';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import PlacementCalendar from './components/PlacementCalendar';
import Settings from './components/Settings';

export default function PlacementPrepApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BoardRegular /> },
    { id: 'roadmap', label: 'Roadmap', icon: <MapRegular /> },
    { id: 'revision', label: 'Revision Center', icon: <ArrowRepeatAllRegular /> },
    { id: 'contests', label: 'Contest Tracker', icon: <TrophyRegular /> },
    { id: 'journal', label: 'Interview Journal', icon: <DocumentRegular /> },
    { id: 'defense', label: 'Project Defense', icon: <ShieldRegular /> },
    { id: 'dreamcompany', label: 'Dream Company', icon: <BuildingRegular /> },
    { id: 'resume', label: 'Resume Analyzer', icon: <DocumentSearchRegular /> },
    { id: 'calendar', label: 'Placement Calendar', icon: <CalendarMonthRegular /> },
    { id: 'studycoach', label: 'Study Coach', icon: <BotRegular /> },
    { id: 'interview', label: 'Interview Simulator', icon: <PersonFeedbackRegular /> },
    { id: 'knowledge', label: 'Knowledge Vault', icon: <BookOpenRegular /> },
    { id: 'settings', label: 'Settings', icon: <SettingsRegular /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'roadmap': return <Roadmap />;
      case 'revision': return <RevisionCenter />;
      case 'contests': return <ContestTracker />;
      case 'journal': return <InterviewJournal />;
      case 'defense': return <ProjectDefense />;
      case 'dreamcompany': return <DreamCompany />;
      case 'resume': return <ResumeAnalyzer />;
      case 'calendar': return <PlacementCalendar />;
      case 'studycoach': return <StudyCoach />;
      case 'interview': return <InterviewSimulator />;
      case 'knowledge': return <KnowledgeVault />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="placement-app">
      <div className="placement-sidebar">
        <div className="placement-sidebar-header">
          <h2>Placement Prep</h2>
        </div>
        <div className="placement-nav">
          {navItems.map(item => (
            <div 
              key={item.id}
              className={`placement-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="placement-main">
        <div className="placement-topbar">
          <div className="topbar-title">
            <h3 style={{ margin: 0, fontWeight: 600 }}>{navItems.find(i => i.id === activeTab)?.label}</h3>
          </div>
          <div className="topbar-actions">
            {/* Quick stats or notifications could go here */}
          </div>
        </div>

        <div className="placement-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
