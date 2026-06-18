import { motion, AnimatePresence } from 'framer-motion';

export default function SnapLayoutsPopup({ onSnap, onMouseLeave }) {
  // Simple CSS representations of layouts
  const layouts = [
    {
      id: 'split-half',
      render: () => (
        <>
          <div className="snap-sector left" onClick={() => onSnap('left')} />
          <div className="snap-sector right" onClick={() => onSnap('right')} />
        </>
      )
    },
    {
      id: 'split-third',
      render: () => (
        <>
          <div className="snap-sector left-two-thirds" onClick={() => onSnap('left-two-thirds')} />
          <div className="snap-sector right-third" onClick={() => onSnap('right-third')} />
        </>
      )
    },
    {
      id: 'grid-4',
      render: () => (
        <>
          <div className="snap-sector top-left" onClick={() => onSnap('top-left')} />
          <div className="snap-sector top-right" onClick={() => onSnap('top-right')} />
          <div className="snap-sector bottom-left" onClick={() => onSnap('bottom-left')} />
          <div className="snap-sector bottom-right" onClick={() => onSnap('bottom-right')} />
        </>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.15 }}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        top: '32px', // just below the titlebar
        right: '46px', // aligned near the close button
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-panel)',
        padding: '12px',
        display: 'flex',
        gap: '12px',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
    >
      <style>{`
        .snap-preview-box {
          width: 56px;
          height: 38px;
          border: 2px solid var(--color-border);
          border-radius: 4px;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          padding: 2px;
          background: transparent;
        }
        .snap-sector {
          background: var(--color-bg-surface-hover);
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.1s;
        }
        .snap-sector:hover {
          background: var(--color-accent);
        }
        /* split half */
        .snap-preview-box .left { flex: 1; height: 100%; }
        .snap-preview-box .right { flex: 1; height: 100%; }
        
        /* split third */
        .snap-preview-box .left-two-thirds { flex: 2; height: 100%; }
        .snap-preview-box .right-third { flex: 1; height: 100%; }

        /* grid 4 */
        .snap-preview-box .top-left { width: calc(50% - 1px); height: calc(50% - 1px); }
        .snap-preview-box .top-right { width: calc(50% - 1px); height: calc(50% - 1px); }
        .snap-preview-box .bottom-left { width: calc(50% - 1px); height: calc(50% - 1px); }
        .snap-preview-box .bottom-right { width: calc(50% - 1px); height: calc(50% - 1px); }
      `}</style>

      {layouts.map(layout => (
        <div key={layout.id} className="snap-preview-box">
          {layout.render()}
        </div>
      ))}
    </motion.div>
  );
}
