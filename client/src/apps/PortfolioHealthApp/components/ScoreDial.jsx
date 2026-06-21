import { motion } from 'framer-motion';

export default function ScoreDial({ score }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color = score >= 90 ? '#4CAF50' : score >= 75 ? '#FFC107' : '#FF4B4B';

  return (
    <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="240" height="240" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="120" cy="120" r={radius}
          fill="transparent"
          stroke="var(--color-bg-elevated)"
          strokeWidth="16"
        />
        <motion.circle
          cx="120" cy="120" r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="16"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: '48px', fontWeight: 700, color: 'var(--color-text-primary)' }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Health Score</span>
      </div>
    </div>
  );
}
