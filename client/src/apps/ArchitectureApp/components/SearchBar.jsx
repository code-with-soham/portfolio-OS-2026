import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchRegular } from '@fluentui/react-icons';

export default function SearchBar({ onClose, onSelectTab }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = [
    { id: 'overview', title: 'Overview', description: 'Landing page and metrics' },
    { id: 'architecture', title: 'System Architecture', description: 'The 7 layer stack' },
    { id: 'runtime', title: 'Runtime Engine', description: 'Execution flows' },
    { id: 'ai', title: 'AI Brain', description: 'NLP pipeline and intents' },
    { id: 'project_tree', title: 'Project Structure', description: 'Folder tree explorer' }
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 500, display: 'flex', justifyContent: 'center', paddingTop: '100px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.15 }}
        style={{ width: '600px', background: '#111', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #222' }}>
          <SearchRegular fontSize={24} style={{ color: '#888', marginRight: '16px' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search architecture... (e.g. 'AI' or 'Runtime')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '18px', outline: 'none' }}
          />
        </div>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {results.length > 0 ? results.map((res, i) => (
            <div 
              key={res.id}
              onClick={() => {
                onSelectTab(res.id);
                onClose();
              }}
              style={{ padding: '16px 24px', borderBottom: '1px solid #222', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '16px', color: '#fff', fontWeight: 500 }}>{res.title}</span>
              <span style={{ fontSize: '13px', color: '#888' }}>{res.description}</span>
            </div>
          )) : (
            <div style={{ padding: '32px', textAlign: 'center', color: '#666' }}>No results found for "{query}"</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
