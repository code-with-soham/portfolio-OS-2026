import { motion } from 'framer-motion';
import { StarRegular, StarFilled } from '@fluentui/react-icons';

export default function GameCard({ game, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(game);
    }
  };

  return (
    <motion.div 
      className="gc-card"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div 
        className="gc-card-thumb" 
        style={game.thumbnail ? { backgroundImage: `url(${game.thumbnail})` } : {}}
      >
        {!game.thumbnail && game.icon}
      </div>
      <div className="gc-card-info">
        <div className="gc-card-title">{game.title}</div>
        <div className="gc-card-genre">{game.category}</div>
        <div className="gc-card-rating">
          <StarFilled fontSize={14} /> {game.rating}
          {game.difficulty && <span style={{ marginLeft: 8, opacity: 0.6, fontSize: '0.75rem' }}>{game.difficulty}</span>}
        </div>
      </div>
    </motion.div>
  );
}
