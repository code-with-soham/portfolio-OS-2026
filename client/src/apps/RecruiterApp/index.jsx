import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PersonRegular, 
  CodeRegular, 
  DataPieRegular, 
  BotRegular, 
  DocumentRegular,
  PlayRegular,
  TrophyRegular,
  CheckmarkCircleRegular,
  OpenRegular
} from '@fluentui/react-icons';
import './RecruiterApp.css';
import { useThemeStore } from '../../store/useThemeStore';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <PersonRegular /> },
  { id: 'projects', label: 'Best Projects', icon: <CodeRegular /> },
  { id: 'github', label: 'GitHub Analytics', icon: <DataPieRegular /> },
  { id: 'resume', label: 'Interactive Resume', icon: <DocumentRegular /> },
  { id: 'ai', label: 'Recruiter AI', icon: <BotRegular /> },
  { id: 'interview', label: 'Interview Mode', icon: <PlayRegular /> },
];

const SKILLS = ['Frontend', 'Backend', 'AI/ML', 'Database', 'DevOps', 'DSA'];

const TOP_PROJECTS = [
  {
    name: 'Portfolio OS 2026',
    desc: 'A full Web OS built with React, Vite, and Zustand. Features a functional window manager, real terminal, and AI integration.',
    tech: ['React 19', 'Zustand', 'Framer Motion', 'Express'],
    arch: ['Client (React)', 'API Proxy (Express)', 'AI Brain (Local)']
  },
  {
    name: 'CampusHub',
    desc: 'University management platform with real-time chat, notice boards, and role-based access.',
    tech: ['MERN Stack', 'Socket.io', 'Tailwind'],
    arch: ['Frontend (React)', 'WebSockets', 'REST API (Node)', 'MongoDB']
  },
  {
    name: 'Placement Predictor',
    desc: 'Machine learning model predicting placement probability based on academic metrics and skills.',
    tech: ['Python', 'Scikit-Learn', 'Flask', 'React'],
    arch: ['React UI', 'Flask API', 'ML Model (Pickle)', 'Dataset']
  }
];

function AnimatedCounter({ value, duration = 2 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(value * progress));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function RecruiterApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [report, setReport] = useState(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const { accentColor } = useThemeStore();

  const handleGenerateReport = () => {
    setReport(null);
    setTimeout(() => {
      setReport(`Candidate: Soham Kundu
YOP: 2027 | Brainware University

Strong Areas:
✓ MERN Stack Development
✓ Frontend Engineering (React, Zustand)
✓ AI Integrations

Notable Project:
Portfolio OS 2026 - Demonstrates advanced state management, component architecture, and modern UI/UX design patterns.

Recommendation:
Strong candidate for Full Stack / Frontend roles. Proceed to Technical Interview Round.`);
    }, 800);
  };

  const askRecruiterAI = (query) => {
    setAiQuery(query);
    setAiResponse('Thinking...');
    setTimeout(() => {
      if (query.includes('best project')) {
        setAiResponse('Soham\'s best project is definitely "Portfolio OS 2026". It is a complete Web OS showcasing complex state management, custom windowing system, and deep AI integrations. It proves he can build large-scale React applications from scratch.');
      } else if (query.includes('technologies')) {
        setAiResponse('Soham is highly proficient in the MERN stack (MongoDB, Express, React, Node.js). He also has experience with Python, Machine Learning (Scikit-Learn), and modern frontend tools like Vite, Zustand, and TailwindCSS.');
      } else if (query.includes('strongest skill')) {
        setAiResponse('His strongest skill is Frontend Engineering, specifically building highly interactive, performant, and visually stunning user interfaces using React and Framer Motion.');
      }
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="recruiter-card">
            <h2 className="recruiter-section-title"><DataPieRegular /> Skills Radar</h2>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
              <div className="radar-container">
                <div className="radar-bg"></div>
                {/* Simulated Radar Shape using SVG */}
                <svg width="250" height="250" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <polygon points="125,30 200,80 210,170 125,220 50,160 60,70" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="2" />
                </svg>
                {SKILLS.map((skill, i) => {
                  const angle = (i * 60 - 90) * (Math.PI / 180);
                  const x = 125 + Math.cos(angle) * 140;
                  const y = 125 + Math.sin(angle) * 140;
                  return (
                    <div key={skill} style={{ position: 'absolute', top: y, left: x, transform: 'translate(-50%, -50%)', fontSize: '12px', fontWeight: 600 }}>
                      {skill}
                    </div>
                  );
                })}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                  Soham is a Full Stack Developer with a strong bias towards modern Frontend Engineering. The radar chart indicates high proficiency in <strong>Frontend</strong> and <strong>Backend</strong> (MERN stack), with solid foundational knowledge in <strong>DSA</strong> and <strong>AI/ML</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'projects':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="recruiter-section-title"><CodeRegular /> Best Projects & Architecture</h2>
            <div className="project-grid">
              {TOP_PROJECTS.map((proj) => (
                <div key={proj.name} className="project-card">
                  <h3 style={{ margin: '0 0 12px 0' }}>{proj.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>{proj.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {proj.tech.map(t => (
                      <span key={t} style={{ fontSize: '11px', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{t}</span>
                    ))}
                  </div>
                  
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', color: accentColor }}>Architecture Flow:</div>
                    <div className="architecture-flow" style={{ padding: 0, gap: '8px', background: 'transparent' }}>
                      {proj.arch.map((node, i) => (
                        <div key={node} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div className="arch-node" style={{ padding: '6px 12px', fontSize: '12px' }}>{node}</div>
                          {i < proj.arch.length - 1 && <div className="arch-arrow" style={{ height: '16px' }}></div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, padding: '8px', background: accentColor, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><OpenRegular /> Demo</button>
                    <button style={{ flex: 1, padding: '8px', background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><CodeRegular /> Source</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'github':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="recruiter-card">
            <h2 className="recruiter-section-title"><DataPieRegular /> GitHub Analytics</h2>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
              <div className="pie-chart-container">
                <div className="pie-chart-hole">
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>12+</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Repos</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', background: '#f0db4f', borderRadius: '4px' }}></div>
                  <span style={{ flex: 1 }}>JavaScript (40%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', background: '#61dafb', borderRadius: '4px' }}></div>
                  <span style={{ flex: 1 }}>React (30%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', background: '#3178c6', borderRadius: '4px' }}></div>
                  <span style={{ flex: 1 }}>TypeScript (15%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '16px', height: '16px', background: '#41b883', borderRadius: '4px' }}></div>
                  <span style={{ flex: 1 }}>Vue/HTML (10%)</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'ai':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="recruiter-card" style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
            <h2 className="recruiter-section-title"><BotRegular /> Recruiter AI (Powered by VS-31 Brain)</h2>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => askRecruiterAI('What is his best project?')} style={{ padding: '8px 16px', background: 'var(--color-bg-elevated)', border: `1px solid ${accentColor}`, color: 'var(--color-text-primary)', borderRadius: '20px', cursor: 'pointer' }}>What is his best project?</button>
              <button onClick={() => askRecruiterAI('What technologies does he know?')} style={{ padding: '8px 16px', background: 'var(--color-bg-elevated)', border: `1px solid ${accentColor}`, color: 'var(--color-text-primary)', borderRadius: '20px', cursor: 'pointer' }}>Tech Stack?</button>
              <button onClick={() => askRecruiterAI('What is his strongest skill?')} style={{ padding: '8px 16px', background: 'var(--color-bg-elevated)', border: `1px solid ${accentColor}`, color: 'var(--color-text-primary)', borderRadius: '20px', cursor: 'pointer' }}>Strongest skill?</button>
            </div>

            <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {aiQuery && (
                <div style={{ alignSelf: 'flex-end', background: accentColor, color: '#fff', padding: '12px 16px', borderRadius: '16px 16px 0 16px', maxWidth: '70%' }}>
                  {aiQuery}
                </div>
              )}
              {aiResponse && (
                <div style={{ alignSelf: 'flex-start', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', padding: '12px 16px', borderRadius: '16px 16px 16px 0', maxWidth: '70%', lineHeight: 1.5 }}>
                  <BotRegular style={{ marginRight: '8px', color: accentColor }} />
                  {aiResponse}
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'interview':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="recruiter-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 className="recruiter-section-title" style={{ justifyContent: 'center' }}><TrophyRegular /> Candidate Report Generator</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
              Generate an instant, comprehensive summary of the candidate's profile, strong areas, and recommendations based on real-time analysis.
            </p>
            <button 
              onClick={handleGenerateReport}
              style={{ padding: '16px 32px', fontSize: '18px', fontWeight: 600, background: accentColor, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
            >
              Generate Candidate Summary
            </button>

            {report && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: '40px', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', borderLeft: `4px solid ${accentColor}` }}>
                {report}
              </motion.div>
            )}
          </motion.div>
        );
      
      case 'resume':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="recruiter-card">
            <h2 className="recruiter-section-title"><DocumentRegular /> Interactive Resume</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid var(--color-border)', paddingRight: '20px' }}>
                <div style={{ padding: '8px', background: 'var(--color-bg-elevated)', borderRadius: '4px', fontWeight: 600, color: accentColor }}>Education</div>
                <div style={{ padding: '8px', opacity: 0.6 }}>Experience</div>
                <div style={{ padding: '8px', opacity: 0.6 }}>Achievements</div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginTop: 0 }}>Brainware University</h3>
                <p style={{ color: accentColor, fontWeight: 600 }}>B.Tech Computer Science (2023 - 2027)</p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Currently pursuing Bachelor of Technology in Computer Science. Maintaining a strong academic record while actively participating in hackathons (Nexathon Finalist) and building full-stack projects.
                </p>
                <ul style={{ color: 'var(--color-text-secondary)', marginTop: '16px', paddingLeft: '20px' }}>
                  <li>Smart India Hackathon Participant</li>
                  <li>Technical Lead at Campus Coding Club</li>
                  <li>Specialization in Web Technologies and AI</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="recruiter-dashboard">
      <div className="recruiter-sidebar">
        <div className="recruiter-hero">
          <div className="recruiter-avatar">
            SK
          </div>
          <h1 style={{ fontSize: '24px', margin: '4px 0' }}>Soham Kundu</h1>
          <div style={{ fontSize: '14px', color: accentColor, fontWeight: 600 }}>Full Stack / AI Developer</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Brainware University (YOP 2027)</div>
        </div>

        <div className="recruiter-stats-grid">
          <div className="recruiter-stat-card">
            <div className="recruiter-stat-value"><AnimatedCounter value={12} />+</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Projects</div>
          </div>
          <div className="recruiter-stat-card">
            <div className="recruiter-stat-value"><AnimatedCounter value={35} />+</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Skills</div>
          </div>
          <div className="recruiter-stat-card">
            <div className="recruiter-stat-value"><AnimatedCounter value={15} />+</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Achievements</div>
          </div>
          <div className="recruiter-stat-card">
            <div className="recruiter-stat-value"><AnimatedCounter value={500} />+</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>GitHub</div>
          </div>
        </div>

        <div className="recruiter-nav">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              className={`recruiter-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="recruiter-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
