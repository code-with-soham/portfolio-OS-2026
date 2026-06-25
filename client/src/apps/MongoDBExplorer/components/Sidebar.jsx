import React from 'react';
import { Database, Folder, ChevronRight, ChevronDown, Film, Package, Building2, Users, Key } from 'lucide-react';
import { useMongoStore } from '../hooks/useMongoStore';
import { motion } from 'framer-motion';

const getCollectionIcon = (colName) => {
  switch (colName) {
    case 'movies': return <Film size={14} className="mr-2 text-blue-400" />;
    case 'embedded_movies': return <Package size={14} className="mr-2 text-orange-400" />;
    case 'theaters': return <Building2 size={14} className="mr-2 text-purple-400" />;
    case 'users': return <Users size={14} className="mr-2 text-green-400" />;
    case 'sessions': return <Key size={14} className="mr-2 text-red-400" />;
    default: return <Film size={14} className="mr-2" />;
  }
};

const getCollectionCount = (colName) => {
  switch (colName) {
    case 'movies': return '21K';
    case 'embedded_movies': return '3.5K';
    case 'theaters': return '1.6K';
    case 'users': return '185';
    case 'sessions': return '1';
    default: return '0';
  }
};

const Sidebar = () => {
  const { databases, currentDatabase, collections, currentCollection, setCurrentCollection } = useMongoStore();
  const [isDbExpanded, setIsDbExpanded] = React.useState(true);

  return (
    <div className="w-64 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] h-full flex flex-col font-sans text-sm text-[var(--color-text-primary)]">
      <div className="p-3 border-b border-[var(--color-border)] flex items-center space-x-2 font-semibold bg-[#212121]">
        <Database size={16} className="text-[#00ED64]" />
        <span>Cluster0</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {/* Database Node */}
        <div>
          <div 
            className="flex items-center px-3 py-1.5 cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors"
            onClick={() => setIsDbExpanded(!isDbExpanded)}
          >
            {isDbExpanded ? <ChevronDown size={14} className="mr-1 opacity-70" /> : <ChevronRight size={14} className="mr-1 opacity-70" />}
            <Folder size={14} className="mr-2 text-yellow-500" />
            <span className="truncate">{currentDatabase}</span>
          </div>

          {/* Collections List */}
          {isDbExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="ml-6 flex flex-col"
            >
              {collections.map(col => (
                <div 
                  key={col}
                  onClick={() => setCurrentCollection(col)}
                  className={`flex items-center justify-between px-3 py-1.5 w-full cursor-pointer rounded-r-md transition-colors ${
                    currentCollection === col 
                      ? 'bg-[var(--color-accent)] text-white' 
                      : 'hover:bg-[var(--color-bg-hover)] opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: currentCollection === col ? 'rgba(19, 170, 82, 0.15)' : 'transparent',
                    borderLeft: currentCollection === col ? '3px solid var(--color-accent)' : '3px solid transparent'
                  }}
                >
                  <div className="flex items-center truncate">
                    {getCollectionIcon(col)}
                    <span className="truncate font-medium">{col.replace('_', ' ')}</span>
                  </div>
                  <span className={`text-xs ${currentCollection === col ? 'text-[var(--color-accent)] font-semibold' : 'text-gray-500'}`}>
                    {getCollectionCount(col)}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
