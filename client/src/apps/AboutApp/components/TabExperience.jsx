import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronRightRegular, ChevronDownRegular, BuildingRegular, HatGraduationRegular } from '@fluentui/react-icons';

export default function TabExperience({ timeline }) {
  const data = timeline || [];
  const [expandedId, setExpandedId] = useState(data.length > 0 ? data[0].id : null);

  return (
    <motion.div 
      className="about-tab-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="experience-list">
        {data.map(item => (
          <div 
            key={item.id} 
            className={`experience-card ${expandedId === item.id ? 'expanded' : ''}`}
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
          >
            <div className="exp-card-header">
              <div className="exp-icon">
                {item.type === 'education' ? <HatGraduationRegular fontSize={24} /> : <BuildingRegular fontSize={24} />}
              </div>
              <div className="exp-summary">
                <h3 className="exp-title">{item.title}</h3>
                <p className="exp-org">{item.organization} • {new Date(item.startDate).getFullYear()} - {item.current ? 'Present' : new Date(item.endDate).getFullYear()}</p>
              </div>
              <div className="exp-chevron">
                {expandedId === item.id ? <ChevronDownRegular /> : <ChevronRightRegular />}
              </div>
            </div>
            
            {expandedId === item.id && (
              <motion.div 
                className="exp-card-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
              >
                <p style={{marginBottom: '12px'}}>{item.description}</p>
                {item.highlights && item.highlights.length > 0 && (
                  <ul>
                    {item.highlights.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
