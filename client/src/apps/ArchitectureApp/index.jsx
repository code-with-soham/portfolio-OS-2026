import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BuildingRegular, 
  AppsListRegular, 
  PlayCircleRegular, 
  BrainCircuitRegular, 
  FolderRegular, 
  ArrowFlowUpRightRegular, 
  DataPieRegular, 
  SearchRegular 
} from '@fluentui/react-icons';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';

// Lazy load heavy components for performance
const Hero = lazy(() => import('./components/Hero'));
const LayerExplorer = lazy(() => import('./components/LayerExplorer'));
const RuntimeEngine = lazy(() => import('./components/RuntimeEngine'));
const AIBrain = lazy(() => import('./components/AIBrain'));
const ProjectTree = lazy(() => import('./components/ProjectTree'));
const DataFlow = lazy(() => import('./components/DataFlow'));
const MetricsDashboard = lazy(() => import('./components/MetricsDashboard'));
const JourneyMode = lazy(() => import('./components/JourneyMode'));
const SearchBar = lazy(() => import('./components/SearchBar'));

export default function ArchitectureApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isJourneyActive, setIsJourneyActive] = useState(false);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <BuildingRegular /> },
    { id: 'architecture', label: 'Architecture', icon: <AppsListRegular /> },
    { id: 'runtime', label: 'Runtime Engine', icon: <PlayCircleRegular /> },
    { id: 'ai', label: 'AI Brain', icon: <BrainCircuitRegular /> },
    { id: 'project_tree', label: 'Project Tree', icon: <FolderRegular /> },
    { id: 'data_flow', label: 'Data Flow', icon: <ArrowFlowUpRightRegular /> },
    { id: 'metrics', label: 'Metrics', icon: <DataPieRegular /> },
    { id: 'journey', label: 'Journey Mode', icon: <PlayCircleRegular /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Hero onNavigate={setActiveTab} />;
      case 'architecture': return <LayerExplorer />;
      case 'runtime': return <RuntimeEngine />;
      case 'ai': return <AIBrain />;
      case 'project_tree': return <ProjectTree />;
      case 'data_flow': return <DataFlow />;
      case 'metrics': return <MetricsDashboard />;
      case 'journey': return <JourneyMode onClose={() => setActiveTab('overview')} />;
      default: return <Hero onNavigate={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0a', color: '#ededed', overflow: 'hidden' }}>
      
      {/* Top Bar with Quick Search */}
      <div style={{ height: '48px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', padding: '0 16px', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888' }}>
          <BuildingRegular fontSize={20} />
          <span style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>Architecture Explorer</span>
        </div>
        <div style={{ flex: 1 }} />
        <button 
          onClick={() => setIsSearchOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', padding: '4px 12px', color: '#888', cursor: 'pointer', fontSize: '12px' }}>
          <SearchRegular /> Search Architecture... 
          <span style={{ background: '#333', padding: '2px 4px', borderRadius: '4px', fontSize: '10px' }}>Ctrl K</span>
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar Navigation */}
        <Sidebar tabs={TABS} activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Content Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%', overflowY: 'auto' }}
              className="custom-scrollbar"
            >
              <Suspense fallback={<div style={{ padding: '32px', color: '#888' }}>Loading...</div>}>
                {renderContent()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Architecture Health Status Bar */}
      <StatusBar />

      {/* Search Overlay */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchBar onClose={() => setIsSearchOpen(false)} onSelectTab={setActiveTab} />
        </Suspense>
      )}
    </div>
  );
}
