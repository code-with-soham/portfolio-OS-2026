import { motion, AnimatePresence } from 'framer-motion';
import { useWidgetStore } from '../../store/useWidgetStore';
import WeatherWidget from './WeatherWidget';
import SystemInfoWidget from './SystemInfoWidget';
import ActivityWidget from './ActivityWidget';

export default function WidgetsPanel() {
  const { isWidgetPanelOpen, activeWidgets } = useWidgetStore();

  return (
    <AnimatePresence>
      {isWidgetPanelOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute',
            top: '48px',
            right: '24px',
            width: '320px',
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 9000,
            pointerEvents: 'auto',
          }}
          className="no-select"
        >
          {activeWidgets.includes('weather') && <WeatherWidget />}
          {activeWidgets.includes('system-info') && <SystemInfoWidget />}
          {activeWidgets.includes('activity') && <ActivityWidget />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
