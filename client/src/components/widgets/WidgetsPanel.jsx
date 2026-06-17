import { motion, AnimatePresence } from 'framer-motion';
import { useWidgetStore } from '../../store/useWidgetStore';
import GitHubWidget from './GitHubWidget';
import PlacementWidget from './PlacementWidget';
import QuoteWidget from './QuoteWidget';

export default function WidgetsPanel() {
  const { isWidgetPanelOpen, activeWidgets } = useWidgetStore();

  return (
    <AnimatePresence>
      {isWidgetPanelOpen && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'absolute',
            top: '48px',
            left: '24px',
            width: '340px',
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 9000,
            pointerEvents: 'auto',
            overflowY: 'auto',
            paddingBottom: '24px',
          }}
          className="no-select"
        >
          {activeWidgets.includes('github') && <GitHubWidget />}
          {activeWidgets.includes('placement') && <PlacementWidget />}
          {activeWidgets.includes('quote') && <QuoteWidget />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
