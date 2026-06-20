import { motion } from 'framer-motion';
import { HatGraduationRegular, ToolboxRegular, TrophyRegular, TimelineRegular } from '@fluentui/react-icons';

export default function ResumeTab() {
  const journey = [
    { year: '2024', event: 'Started MERN Stack Journey', detail: 'Built fundamental web apps' },
    { year: '2025', event: 'Hackathon Finalist', detail: 'Developed AI integration tools' },
    { year: '2026', event: 'Built Portfolio OS', detail: 'Created web-based desktop environment' },
    { year: '2027', event: 'Placement Ready', detail: 'Graduating from Brainware University' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Education */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 12px 0' }}>
          <HatGraduationRegular color="var(--color-accent)" /> Education
        </h3>
        <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>B.Tech in Computer Science</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--color-accent)' }}>Brainware University (2023 - 2027)</p>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>Specialization in AI & Machine Learning. CGPA: 8.5/10 (Expected)</p>
        </div>
      </section>

      {/* Skills */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 12px 0' }}>
          <ToolboxRegular color="var(--color-accent)" /> Core Skills
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['React', 'Node.js', 'MongoDB', 'Python', 'C++', 'Zustand', 'Framer Motion', 'Docker', 'AWS'].map(skill => (
            <span key={skill} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 12px 0' }}>
          <TrophyRegular color="var(--color-accent)" /> Achievements
        </h3>
        <div style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Top 10 in National Level Hackathon (2025)</li>
            <li>500+ Contributions on GitHub</li>
            <li>Solved 300+ DSA problems on LeetCode</li>
            <li>Published article on "AI Agents in Web Apps"</li>
          </ul>
        </div>
      </section>

      {/* Placement Journey */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 16px 0' }}>
          <TimelineRegular color="var(--color-accent)" /> Placement Journey
        </h3>
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: '6px', top: '10px', bottom: '10px', width: '2px', background: 'var(--color-border)' }} />
          
          {journey.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              style={{ position: 'relative', marginBottom: idx === journey.length - 1 ? 0 : '24px' }}
            >
              {/* Dot */}
              <div style={{ position: 'absolute', left: '-20px', top: '6px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 0 4px var(--color-bg-base)' }} />
              
              <div style={{ background: 'var(--color-bg-surface)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '4px' }}>{item.year}</span>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{item.event}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
