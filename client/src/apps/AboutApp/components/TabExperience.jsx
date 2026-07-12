import { motion } from 'framer-motion';
import { BuildingRegular, HatGraduationRegular } from '@fluentui/react-icons';

export default function TabExperience({ timeline }) {
  if (!timeline) return null;
  const { experience = [], education = [] } = timeline;

  return (
    <motion.div 
      className="about-tab-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="experience-list" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Experience Section */}
        {experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BuildingRegular /> Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {experience.map(item => (
                <div key={item.id} className="experience-card expanded" style={{ padding: '20px' }}>
                  <div className="exp-card-header" style={{ alignItems: 'flex-start' }}>
                    <div className="exp-summary">
                      <h3 className="exp-title" style={{ fontSize: '1.1rem', margin: '0 0 4px 0' }}>{item.role}</h3>
                      <p className="exp-org" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>
                        {item.company} • {item.startDate} - {item.endDate}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', margin: '0 0 12px 0' }}>
                        {item.type} • {item.location} • {item.workModel}
                      </p>
                    </div>
                  </div>
                  <div className="exp-card-details" style={{ height: 'auto', opacity: 1 }}>
                    {item.responsibilities && (
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {item.responsibilities.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    )}
                    {item.technologies && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                        {item.technologies.map((tech, i) => (
                          <span key={i} className="badge" style={{ background: 'var(--color-bg-surface-hover)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HatGraduationRegular /> Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {education.map(item => (
                <div key={item.id} className="experience-card expanded" style={{ padding: '20px' }}>
                  <div className="exp-card-header" style={{ alignItems: 'flex-start' }}>
                    <div className="exp-summary">
                      <h3 className="exp-title" style={{ fontSize: '1.1rem', margin: '0 0 4px 0' }}>{item.degree} in {item.field}</h3>
                      <p className="exp-org" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>
                        {item.institution} • {item.startDate} - {item.endDate}
                      </p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-accent)', margin: 0 }}>
                        {item.grade}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
