import { motion, AnimatePresence } from 'framer-motion';
import FileIcon from './FileIcon';

export default function PreviewPane({ item }) {
  if (!item) {
    return (
      <div className="preview-pane empty">
        <span style={{ opacity: 0.5 }}>Select a file to preview.</span>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={item.name}
        className="preview-pane active"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="preview-header">
          <FileIcon type={item.type} iconType={item.icon} size={96} />
          <h3 className="preview-title">{item.name}</h3>
          <p className="preview-type">{item.type === 'folder' ? 'File folder' : `${item.icon?.toUpperCase()} File`}</p>
        </div>

        <div className="preview-details">
          <div className="detail-row">
            <span className="detail-label">Size</span>
            <span className="detail-value">{item.size || '--'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date modified</span>
            <span className="detail-value">{item.modified || '--'}</span>
          </div>
          {item.rating && (
            <div className="detail-row">
              <span className="detail-label">Rating</span>
              <span className="detail-value" style={{ color: '#F1C40F' }}>{item.rating}</span>
            </div>
          )}
          {item.atsScore && (
            <div className="detail-row">
              <span className="detail-label">ATS Score</span>
              <span className="detail-value" style={{ color: '#2ECC71', fontWeight: 'bold' }}>{item.atsScore}</span>
            </div>
          )}
        </div>

        {item.type !== 'folder' && (
          <div className="preview-actions">
            <button className="preview-btn primary">Open File</button>
            <button className="preview-btn secondary">Download</button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
