import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownRegular, ChevronUpRegular, CodeRegular, AppFolderRegular } from '@fluentui/react-icons';

const PROJECTS = [
  {
    id: 'portfolio-os',
    title: 'Portfolio OS',
    description: 'A complete web-based operating system built with React and Zustand. Includes a window manager, file system, AI Brain, and this Recruiter Dashboard.',
    stack: ['React', 'Zustand', 'Framer Motion', 'Node.js'],
    demoLink: '#',
    githubLink: '#',
    architecture: [
      { step: 'React UI Shell', detail: 'Framer Motion & Components' },
      { step: 'Zustand State', detail: 'Window Management' },
      { step: 'VS-31 Brain', detail: 'AI Assistant via LangChain' }
    ]
  },
  {
    id: 'campushub',
    title: 'CampusHub',
    description: 'A comprehensive campus management system integrating student portals, faculty dashboards, and real-time notifications.',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    demoLink: '#',
    githubLink: '#',
    architecture: [
      { step: 'Frontend Portal', detail: 'React SPA' },
      { step: 'API Gateway', detail: 'Express & Node' },
      { step: 'Database', detail: 'MongoDB & Redis Cache' }
    ]
  },
  {
    id: 'placement-predictor',
    title: 'Placement Predictor',
    description: 'Machine learning model that predicts placement probabilities based on academic scores, skills, and past trends.',
    stack: ['Python', 'Flask', 'Scikit-Learn', 'React'],
    demoLink: '#',
    githubLink: '#',
    architecture: [
      { step: 'User Input', detail: 'React Form' },
      { step: 'Flask API', detail: 'Feature Extraction' },
      { step: 'ML Model', detail: 'Random Forest Inference' }
    ]
  }
];

export default function ProjectsTab() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div style={{ padding: '8px 4px', marginBottom: '8px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Best Projects</h2>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>Tap to explore architecture & details.</p>
      </div>

      {PROJECTS.map((proj) => (
        <motion.div 
          key={proj.id}
          layout
          style={{ 
            background: 'var(--color-bg-surface)', 
            border: expandedId === proj.id ? '1px solid var(--color-accent)' : '1px solid var(--color-border)', 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: expandedId === proj.id ? '0 4px 16px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          {/* Card Header */}
          <div 
            onClick={() => toggleExpand(proj.id)}
            style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--color-bg-elevated)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AppFolderRegular fontSize={24} color={expandedId === proj.id ? 'var(--color-accent)' : 'var(--color-text-primary)'} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{proj.title}</h3>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {proj.stack.slice(0, 2).map(tech => (
                    <span key={tech} style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--color-bg-elevated)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>{tech}</span>
                  ))}
                  {proj.stack.length > 2 && <span style={{ fontSize: '10px', padding: '2px 6px', color: 'var(--color-text-secondary)' }}>+{proj.stack.length - 2}</span>}
                </div>
              </div>
            </div>
            <div>
              {expandedId === proj.id ? <ChevronUpRegular /> : <ChevronDownRegular />}
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {expandedId === proj.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--color-border)', marginTop: '8px', paddingTop: '16px' }}>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: 1.5, color: 'var(--color-text-primary)' }}>
                    {proj.description}
                  </p>

                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CodeRegular /> Architecture Flow
                  </h4>
                  
                  {/* Architecture Viewer */}
                  <div style={{ background: 'var(--color-bg-elevated)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {proj.architecture.map((arch, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          style={{ width: '100%', padding: '10px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', textAlign: 'center' }}
                        >
                          <span style={{ display: 'block', fontSize: '13px', fontWeight: 600 }}>{arch.step}</span>
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-secondary)' }}>{arch.detail}</span>
                        </motion.div>
                        {idx < proj.architecture.length - 1 && (
                          <div style={{ height: '20px', width: '2px', background: 'var(--color-accent)', margin: '4px 0' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button style={{ flex: 1, padding: '10px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff' }}>GitHub</button>
                    <button style={{ flex: 1, padding: '10px', background: 'var(--color-accent)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600 }}>Live Demo</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
