import React, { useState } from 'react';

const PROJECTS = [
  {
    id: 'portfolio-os',
    name: 'Portfolio OS',
    description: 'A web-based desktop operating system mimicking Windows 11 aesthetics.',
    questions: [
      'Explain the Architecture of the Window Manager. How do you handle z-indexing and focus?',
      'Why did you choose Zustand over Redux or Context API for state management?',
      'How is the state persisted across reloads without a backend?',
      'How do the desktop applications communicate with each other?',
      'What were the biggest performance bottlenecks, and how did you resolve them?'
    ]
  },
  {
    id: 'campushub',
    name: 'CampusHub',
    description: 'A comprehensive campus management and booking platform.',
    questions: [
      'Walk me through the Database Schema. Why MongoDB?',
      'Explain the Authentication Flow. Are you using JWTs? How do you handle refresh tokens?',
      'How is the Booking Flow implemented to prevent double bookings?',
      'What was the most challenging bug you faced during development?',
      'How would you scale this application for 100,000 concurrent users?'
    ]
  },
  {
    id: 'ai-mock',
    name: 'AI Mock Interview',
    description: 'An AI-powered technical interview simulator.',
    questions: [
      'Explain your Prompt Engineering strategy. How do you ensure the AI does not hallucinate?',
      'How did you integrate the Gemini API? Explain the flow from client to AI and back.',
      'What is your Fallback Strategy if the AI API rate limits or goes down?',
      'How are you handling Rate Limiting to prevent abuse?',
      'How do you evaluate the accuracy of the AI\'s technical feedback?'
    ]
  }
];

export default function ProjectDefense() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0].id);

  return (
    <div className="placement-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ marginTop: 0 }}>Project Defense Mode</h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>Practice articulating the architectural decisions and challenges of your key projects.</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        {PROJECTS.map(p => (
          <button 
            key={p.id}
            onClick={() => setActiveProject(p.id)}
            style={{ 
              padding: '10px 20px', 
              background: activeProject === p.id ? 'var(--color-accent)' : 'rgba(0,0,0,0.3)',
              color: 'white',
              border: activeProject === p.id ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, marginTop: '20px', overflowY: 'auto' }}>
        {PROJECTS.map(p => {
          if (p.id !== activeProject) return null;
          return (
            <div key={p.id} style={{ animation: 'fadeIn 0.3s' }}>
              <div style={{ marginBottom: '20px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>{p.description}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {p.questions.map((q, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '15px' }}>Q: {q}</div>
                    <textarea 
                      placeholder="Type your defense/explanation here to practice..."
                      style={{ 
                        width: '100%', 
                        minHeight: '80px', 
                        padding: '12px', 
                        background: 'rgba(0,0,0,0.4)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '4px', 
                        color: 'white', 
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
