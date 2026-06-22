import { motion } from 'framer-motion';
import { 
  HatGraduationRegular, 
  ToolboxRegular, 
  TrophyRegular, 
  TimelineRegular, 
  BriefcaseRegular, 
  ArrowDownloadRegular, 
  AppFolderRegular,
  CertificateRegular,
  OpenRegular
} from '@fluentui/react-icons';

const EDUCATION = [
  {
    degree: 'B.Tech in Computer Science & Engineering',
    school: 'Brainware University, Barasat',
    period: '2024 – Present',
    cgpa: '8.79',
    current: true
  },
  {
    degree: 'Diploma in Computer Science & Technology',
    school: 'Bishnupur Public Institute of Engineering',
    period: '2021 – 2024',
    cgpa: '8.4',
    current: false
  }
];

const EXPERIENCE = [
  {
    role: 'Frontend Developer Intern',
    company: 'Expantra Tech Pvt Ltd',
    period: 'Aug 2025 – Dec 2025',
    highlights: ['React Development', 'Tailwind CSS', 'Git & GitHub', 'Industry Project Experience']
  }
];

const SKILL_GROUPS = [
  { label: 'Frontend', skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS'] },
  { label: 'Backend', skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'MySQL'] },
  { label: 'Languages', skills: ['Python', 'C', 'C++'] },
  { label: 'ML/AI', skills: ['Data Analysis', 'Machine Learning', 'Random Forest'] },
  { label: 'Tools', skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Docker', 'Vite'] }
];

const KEY_PROJECTS = [
  { name: 'Portfolio OS', tech: 'React, Zustand, Framer Motion', link: 'https://portfolio-os-2026.vercel.app/' },
  { name: 'CampusHub', tech: 'MERN Stack, Tailwind CSS', link: 'https://campus-hub-mocha.vercel.app/' },
  { name: 'Smart Mock Interview', tech: 'React, WebRTC, Socket.io', link: 'https://smart-mock-interview-prep.vercel.app/' },
  { name: 'Placement Predictor', tech: 'Python, Scikit-Learn, Flask', link: 'https://code-with-soham.github.io/Student-Placement-Predictor/' },
  { name: 'SUPPORTGPT', tech: 'Python, LangChain, OpenAI', link: '#' },
  { name: '3D Web', tech: 'Three.js, WebGL', link: 'https://code-with-soham.github.io/3D-WEB/' }
];

const CERTIFICATIONS = [
  { title: 'Samsung Innovation Campus', desc: 'Coding & Programming Training', icon: '🏅' },
  { title: 'MERN Stack + AI Integration', desc: 'TechnoExponent Certification', icon: '📜' },
  { title: 'Frontend Developer Internship', desc: 'Expantra Tech Pvt Ltd', icon: '💼' }
];

const ACHIEVEMENTS = [
  '250+ Contributions on GitHub',
  '92% ML Prediction Accuracy',
  '8+ Full-Stack Projects Built',
  'Frontend Developer Internship'
];

export default function ResumeTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Download Resume Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          const a = document.createElement('a');
          a.href = '/AI Resume.pdf';
          a.download = 'Soham_Kundu_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}
        style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, var(--color-accent), rgba(74, 222, 128, 0.7))',
          border: 'none',
          borderRadius: '14px',
          color: '#000',
          fontWeight: 700,
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(74, 222, 128, 0.3)'
        }}
      >
        <ArrowDownloadRegular fontSize={20} />
        Download Resume (PDF)
      </motion.button>

      {/* Education */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 12px 0' }}>
          <HatGraduationRegular color="var(--color-accent)" /> Education
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--color-bg-surface)',
                padding: '16px',
                borderRadius: '12px',
                border: edu.current ? '1px solid var(--color-accent)' : '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{edu.degree}</h4>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-accent)' }}>{edu.school}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>{edu.period}</p>
                </div>
                <span style={{ 
                  background: 'rgba(74, 222, 128, 0.15)', 
                  color: 'var(--color-accent)', 
                  padding: '4px 10px', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  whiteSpace: 'nowrap' 
                }}>
                  {edu.cgpa} CGPA
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 12px 0' }}>
          <BriefcaseRegular color="var(--color-accent)" /> Experience
        </h3>
        {EXPERIENCE.map((exp, i) => (
          <div key={i} style={{ background: 'var(--color-bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{exp.role}</h4>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--color-accent)' }}>{exp.company}</p>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>{exp.period}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {exp.highlights.map(h => (
                <span key={h} style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--color-bg-elevated)', borderRadius: '8px', color: 'var(--color-text-primary)' }}>{h}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 12px 0' }}>
          <ToolboxRegular color="var(--color-accent)" /> Core Skills
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.08 }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '6px', display: 'block' }}>{group.label}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {group.skills.map(skill => (
                  <span key={skill} style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', padding: '5px 12px', borderRadius: '20px', fontSize: '12px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 12px 0' }}>
          <AppFolderRegular color="var(--color-accent)" /> Key Projects
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {KEY_PROJECTS.map((proj, i) => (
            <motion.div
              key={proj.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => { if (proj.link && proj.link !== '#') window.open(proj.link, '_blank'); }}
              style={{
                background: 'var(--color-bg-surface)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: proj.link && proj.link !== '#' ? 'pointer' : 'default'
              }}
            >
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{proj.name}</span>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{proj.tech}</span>
              </div>
              {proj.link && proj.link !== '#' && (
                <OpenRegular fontSize={16} color="var(--color-accent)" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 12px 0' }}>
          <CertificateRegular color="var(--color-accent)" /> Certifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--color-bg-surface)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '24px' }}>{cert.icon}</span>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>{cert.title}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{cert.desc}</span>
              </div>
            </motion.div>
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
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {ach}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Placement Journey */}
      <section>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', margin: '0 0 16px 0' }}>
          <TimelineRegular color="var(--color-accent)" /> Placement Journey
        </h3>
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          <div style={{ position: 'absolute', left: '6px', top: '10px', bottom: '10px', width: '2px', background: 'var(--color-border)' }} />
          
          {[
            { year: '2021', event: 'Diploma in CS&T', detail: 'Bishnupur Public Institute of Engineering' },
            { year: '2024', event: 'B.Tech CSE Started', detail: 'Brainware University' },
            { year: '2025', event: 'Frontend Internship', detail: 'Expantra Tech Pvt Ltd' },
            { year: '2026', event: 'Built Portfolio OS', detail: 'Interactive desktop portfolio experience' },
            { year: '2027', event: 'Placement Ready', detail: 'Graduating from Brainware University' }
          ].map((item, idx, arr) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.12 }}
              style={{ position: 'relative', marginBottom: idx === arr.length - 1 ? 0 : '24px' }}
            >
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
