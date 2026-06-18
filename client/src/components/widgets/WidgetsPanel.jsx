import { motion, AnimatePresence } from 'framer-motion';
import { useWidgetStore } from '../../store/useWidgetStore';
import GitHubWidget from './GitHubWidget';
import PlacementWidget from './PlacementWidget';
import QuoteWidget from './QuoteWidget';

const WIDGETS_CONFIG = {
  github: { component: GitHubWidget, defaultX: -24, defaultY: 48 },
  placement: { component: PlacementWidget, defaultX: -24, defaultY: 280 },
  quote: { component: QuoteWidget, defaultX: -24, defaultY: 480 },
};

function DraggableWidget({ id, children }) {
  const { widgetPositions, updateWidgetPosition } = useWidgetStore();
  const pos = widgetPositions[id] || { x: WIDGETS_CONFIG[id]?.defaultX || 0, y: WIDGETS_CONFIG[id]?.defaultY || 0 };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(event, info) => {
        updateWidgetPosition(id, pos.x + info.offset.x, pos.y + info.offset.y);
      }}
      initial={{ x: pos.x + 50, y: pos.y, opacity: 0 }}
      animate={{ x: pos.x, y: pos.y, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '340px',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
      className="no-select"
    >
      {children}
    </motion.div>
  );
}

export default function WidgetsPanel() {
  const { isWidgetPanelOpen, activeWidgets } = useWidgetStore();

  return (
    <AnimatePresence>
      {isWidgetPanelOpen && activeWidgets.map(id => {
        const WidgetComponent = WIDGETS_CONFIG[id]?.component;
        if (!WidgetComponent) return null;
        return (
          <DraggableWidget key={id} id={id}>
            <WidgetComponent />
          </DraggableWidget>
        );
      })}
    </AnimatePresence>
  );
}
