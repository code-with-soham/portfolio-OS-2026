import { motion } from 'framer-motion';

export default function TabSkills({ skills }) {
  const data = skills || [];

  return (
    <motion.div 
      className="about-tab-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="skills-grid">
        {data.map(group => (
          <div key={group.category} className="skill-category-card">
            <h3 className="skill-category-title">{group.category}</h3>
            <div className="skill-items">
              {group.items.map(skill => (
                <span key={skill.name || skill} className="skill-badge">{skill.name || skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
