import { motion } from 'framer-motion';
import { ChevronRightRegular, HomeRegular } from '@fluentui/react-icons';

export default function ExplorerBreadcrumb({ currentPath, navigateTo }) {
  return (
    <motion.div 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="explorer-breadcrumbs"
    >
      <button className="explorer-breadcrumb-home" onClick={() => navigateTo(['Portfolio'])}>
        <HomeRegular fontSize={16} />
      </button>
      
      {currentPath.map((part, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="explorer-breadcrumb-sep">
            <ChevronRightRegular fontSize={12} />
          </span>
          <button
            className={`explorer-breadcrumb ${i === currentPath.length - 1 ? 'active' : ''}`}
            onClick={() => navigateTo(currentPath.slice(0, i + 1))}
          >
            {part}
          </button>
        </span>
      ))}
    </motion.div>
  );
}
