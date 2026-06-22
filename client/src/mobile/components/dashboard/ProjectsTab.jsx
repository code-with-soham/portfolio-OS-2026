import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownRegular, ChevronUpRegular, CodeRegular, AppFolderRegular, OpenRegular } from '@fluentui/react-icons';

const PROJECTS = [
  {
    id: 'portfolio-os',
    title: 'Portfolio OS',
    description: 'A Windows 11-inspired interactive developer portfolio that provides a complete desktop-like experience inside the browser. Features draggable windows, taskbar, start menu, and a custom AI Brain.',
    stack: ['React', 'Zustand', 'Framer Motion', 'Node.js', 'Vite'],
    demoLink: 'https://portfolio-os-2026.vercel.app/',
    githubLink: 'https://github.com/code-with-soham/portfolio-OS-2026',
    architecture: [
      { step: 'React UI Shell', detail: 'Framer Motion & Window Manager' },
      { step: 'Zustand State', detail: 'Window, App & Desktop State' },
      { step: 'VS-31 AI Brain', detail: 'NLP Intent Engine + Knowledge Graph' },
      { step: 'Node.js Backend', detail: 'API & Data Services' }
    ]
  },
  {
    id: 'campushub',
    title: 'CampusHub',
    description: 'A full-stack event booking and management platform with authentication, event registration, organizer dashboard, and payment integration.',
    stack: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS'],
    demoLink: 'https://campus-hub-mocha.vercel.app/',
    githubLink: 'https://github.com/code-with-soham/campusHub',
    architecture: [
      { step: 'React Frontend', detail: 'Event Browsing & Registration' },
      { step: 'Express API', detail: 'Auth, Booking & Payment Routes' },
      { step: 'MongoDB Database', detail: 'Users, Events & Bookings' }
    ]
  },
  {
    id: 'placement-predictor',
    title: 'Placement Predictor',
    description: 'Machine learning model that predicts student placement outcomes using academic scores, skills, and past trends with 92% accuracy.',
    stack: ['Python', 'Scikit-Learn', 'Pandas', 'Flask', 'HTML/CSS'],
    demoLink: 'https://code-with-soham.github.io/Student-Placement-Predictor/',
    githubLink: 'https://github.com/code-with-soham/Student-Placement-Predictor',
    architecture: [
      { step: 'User Input Form', detail: 'Academic & Skill Data' },
      { step: 'Flask API', detail: 'Feature Extraction & Preprocessing' },
      { step: 'Random Forest Model', detail: '92% Prediction Accuracy' }
    ]
  },
  {
    id: 'supportgpt',
    title: 'SUPPORTGPT',
    description: 'An intelligent website support assistant powered by AI that provides instant, context-aware responses to user queries on any website.',
    stack: ['Python', 'LangChain', 'OpenAI', 'Flask', 'JavaScript'],
    demoLink: '#',
    githubLink: 'https://github.com/code-with-soham/SUPPORTGPT--Intelligent-Website-Support-Assistant-',
    architecture: [
      { step: 'Website Integration', detail: 'Embeddable Chat Widget' },
      { step: 'LangChain Pipeline', detail: 'Context Retrieval & Processing' },
      { step: 'AI Response Engine', detail: 'OpenAI GPT Generation' }
    ]
  },
  {
    id: 'soham-portfolio',
    title: 'soham-portfolio-2026',
    description: 'A modern personal portfolio website showcasing projects, skills, and experience with 3D animations and interactive UI elements.',
    stack: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind CSS'],
    demoLink: 'https://soham-kundu-portfolio.vercel.app/',
    githubLink: 'https://github.com/code-with-soham/soham-portfolio-2026',
    architecture: [
      { step: 'React + TypeScript', detail: 'Type-safe Component Architecture' },
      { step: 'Three.js Canvas', detail: '3D Scene Rendering' },
      { step: 'GSAP Animations', detail: 'Scroll-triggered Transitions' }
    ]
  },
  {
    id: 'mock-interview',
    title: 'Smart Mock Interview',
    description: 'An AI-powered mock interview platform with role-based interview generation, real-time video communication, and AI-assisted feedback analysis.',
    stack: ['React', 'Node.js', 'WebRTC', 'Socket.io', 'AI/ML'],
    demoLink: 'https://smart-mock-interview-prep.vercel.app/',
    githubLink: 'https://github.com/code-with-soham/smart-mock-interview-prep',
    architecture: [
      { step: 'React Interview UI', detail: 'Role-based Question Generation' },
      { step: 'WebRTC + Socket.io', detail: 'Real-time Video Communication' },
      { step: 'AI Feedback Engine', detail: 'Performance Analysis & Scoring' }
    ]
  },
  {
    id: 'sliding-puzzle',
    title: 'Sliding Puzzle',
    description: 'A browser-based sliding puzzle game with smooth animations, responsive design, and engaging puzzle-solving mechanics.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    demoLink: 'https://code-with-soham.github.io/sliding-puzzle/',
    githubLink: 'https://github.com/code-with-soham/sliding-puzzle',
    architecture: [
      { step: 'HTML Structure', detail: 'Grid-based Puzzle Layout' },
      { step: 'JavaScript Logic', detail: 'Tile Movement & Win Detection' },
      { step: 'CSS Animations', detail: 'Smooth Tile Transitions' }
    ]
  },
  {
    id: '3d-web',
    title: '3D Web',
    description: 'An immersive 3D web experience showcasing advanced WebGL rendering, interactive 3D scenes, and modern browser-based graphics.',
    stack: ['Three.js', 'WebGL', 'JavaScript', 'HTML/CSS'],
    demoLink: 'https://code-with-soham.github.io/3D-WEB/',
    githubLink: 'https://github.com/code-with-soham/3D-WEB',
    architecture: [
      { step: 'Three.js Scene', detail: '3D Object Creation & Lighting' },
      { step: 'WebGL Renderer', detail: 'GPU-accelerated Rendering' },
      { step: 'User Interaction', detail: 'Camera Controls & Raycasting' }
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
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>Tap to explore architecture & details. {PROJECTS.length} projects showcased.</p>
      </div>

      {PROJECTS.map((proj, index) => (
        <motion.div 
          key={proj.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--color-bg-elevated)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AppFolderRegular fontSize={24} color={expandedId === proj.id ? 'var(--color-accent)' : 'var(--color-text-primary)'} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{proj.title}</h3>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {proj.stack.slice(0, 3).map(tech => (
                    <span key={tech} style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--color-bg-elevated)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>{tech}</span>
                  ))}
                  {proj.stack.length > 3 && <span style={{ fontSize: '10px', padding: '2px 6px', color: 'var(--color-text-secondary)' }}>+{proj.stack.length - 3}</span>}
                </div>
              </div>
            </div>
            <div style={{ flexShrink: 0, marginLeft: '8px' }}>
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

                  {/* Full Tech Stack */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {proj.stack.map(tech => (
                      <span key={tech} style={{ fontSize: '11px', padding: '4px 10px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '12px', color: 'var(--color-accent)', fontWeight: 500 }}>{tech}</span>
                    ))}
                  </div>

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
                    <button
                      onClick={() => window.open(proj.githubLink, '_blank')}
                      style={{ flex: 1, padding: '10px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
                    >
                      GitHub
                    </button>
                    <button
                      onClick={() => {
                        if (proj.demoLink && proj.demoLink !== '#') {
                          window.open(proj.demoLink, '_blank');
                        }
                      }}
                      style={{
                        flex: 1, padding: '10px',
                        background: proj.demoLink && proj.demoLink !== '#' ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
                        border: 'none', borderRadius: '8px',
                        color: proj.demoLink && proj.demoLink !== '#' ? '#fff' : 'var(--color-text-secondary)',
                        fontWeight: 600, cursor: proj.demoLink && proj.demoLink !== '#' ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px'
                      }}
                    >
                      <OpenRegular fontSize={16} />
                      {proj.demoLink && proj.demoLink !== '#' ? 'Live Demo' : 'Coming Soon'}
                    </button>
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
