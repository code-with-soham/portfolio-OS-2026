import { motion } from 'framer-motion';

export default function TabSkills({ skills }) {
  if (!skills) return null;

  return (
    <motion.div 
      className="about-tab-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="skills-grid">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="skill-category-card">
            <h3 className="skill-category-title">{category}</h3>
            <div className="skill-items">
              {items.map(skill => (
                <span key={skill.name || skill} className="skill-badge">{skill.name || skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
