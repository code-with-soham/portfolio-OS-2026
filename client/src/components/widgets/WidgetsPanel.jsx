import { motion, AnimatePresence } from 'framer-motion';
import { useWidgetStore } from '../../store/useWidgetStore';
import { useThemeStore } from '../../store/useThemeStore';
import GitHubProWidget from '../../widgets/GitHubProWidget';
import MusicWidget from '../../widgets/MusicWidget';
import AIWidget from '../../widgets/AIWidget';
import PlacementTrackerWidget from '../../widgets/PlacementTrackerWidget';
import RecruiterWidget from '../../widgets/RecruiterWidget';
import WeatherProWidget from '../../widgets/WeatherProWidget';
import SystemMonitorWidget from '../../widgets/SystemMonitorWidget';
import AchievementProWidget from '../../widgets/AchievementProWidget';
import SmartClockWidget from '../../widgets/SmartClockWidget';
import AISuggestionsWidget from '../../widgets/AISuggestionsWidget';
import LearningProgressWidget from '../../widgets/LearningProgressWidget';
import DailyFocusWidget from '../../widgets/DailyFocusWidget';
import QuickActionsWidget from '../../widgets/QuickActionsWidget';
import RecruiterReadyWidget from '../../widgets/RecruiterReadyWidget';
import { BoardRegular } from '@fluentui/react-icons';
import { useEffect, useRef, useState } from 'react';

const WIDGETS_REGISTRY = {
  ai_suggestions: { id: 'ai_suggestions', component: AISuggestionsWidget },
  learning_progress: { id: 'learning_progress', component: LearningProgressWidget },
  daily_focus: { id: 'daily_focus', component: DailyFocusWidget },
  quick_actions: { id: 'quick_actions', component: QuickActionsWidget },
  recruiter_ready: { id: 'recruiter_ready', component: RecruiterReadyWidget },
  smart_clock: { id: 'smart_clock', component: SmartClockWidget },
  weather_pro: { id: 'weather_pro', component: WeatherProWidget },
  system_monitor: { id: 'system_monitor', component: SystemMonitorWidget },
  achievement_pro: { id: 'achievement_pro', component: AchievementProWidget },
  github_pro: { id: 'github_pro', component: GitHubProWidget },
  music: { id: 'music', component: MusicWidget },
  ai_assistant: { id: 'ai_assistant', component: AIWidget },
  placement_tracker: { id: 'placement_tracker', component: PlacementTrackerWidget },
  recruiter: { id: 'recruiter', component: RecruiterWidget },
};

export default function WidgetsPanel() {
  const { isWidgetPanelOpen, activeWidgets, closeWidgetPanel } = useWidgetStore();
  const { theme, accentColor } = useThemeStore();
  const panelRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0, widgetId: null });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenu.isOpen) {
        setContextMenu({ ...contextMenu, isOpen: false });
      } else if (isWidgetPanelOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        // Handled by desktop shortcuts/Desktop.jsx
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isWidgetPanelOpen, contextMenu.isOpen]);

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      widgetId: id
    });
  };

  return (
    <AnimatePresence>
      {isWidgetPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 90,
              pointerEvents: 'none',
              background: 'rgba(0, 0, 0, 0.1)',
            }}
          />
          <motion.div
            ref={panelRef}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              bottom: 'calc(var(--taskbar-height) + 16px)',
              width: '380px',
              background: 'rgba(20, 20, 20, 0.4)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              zIndex: 95,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
              overflowY: 'auto',
              pointerEvents: 'auto'
            }}
            className="no-select custom-scrollbar"
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#fff', paddingLeft: '8px' }}>
              <div style={{ background: accentColor, padding: '8px', borderRadius: '12px', display: 'flex' }}>
                <BoardRegular fontSize="24px" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Widgets</h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Your personalized dashboard</p>
              </div>
            </div>

            {/* Widget List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
              {activeWidgets.map(id => {
                const WidgetData = WIDGETS_REGISTRY[id];
                if (!WidgetData) return null;
                const WidgetComponent = WidgetData.component;
                return (
                  <div 
                    key={id} 
                    onContextMenu={(e) => handleContextMenu(e, id)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    <WidgetComponent />
                  </div>
                );
              })}
              {activeWidgets.length === 0 && (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '40px', fontSize: '14px' }}>
                  No active widgets. Enable them in Settings.
                </div>
              )}
            </div>
          </motion.div>

          {/* Context Menu */}
          <AnimatePresence>
            {contextMenu.isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                style={{
                  position: 'fixed',
                  top: contextMenu.y,
                  left: contextMenu.x,
                  zIndex: 9999,
                  background: 'rgba(30, 30, 30, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '150px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  fontSize: '13px'
                }}
              >
                {['Refresh', 'Pin', 'Resize', 'Remove', 'Settings'].map((action) => (
                  <div
                    key={action}
                    onClick={() => setContextMenu({ ...contextMenu, isOpen: false })}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    {action}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
