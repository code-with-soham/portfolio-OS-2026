import { motion } from 'framer-motion';
import overviewData from '../../../ai/knowledge/architecture/overview.json';

export default function Hero({ onNavigate }) {
  return (
    <div style={{ padding: '64px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px 0', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {overviewData.title}
        </h1>
        <p style={{ fontSize: '20px', color: '#888', margin: 0 }}>
          {overviewData.subtitle}
        </p>
      </motion.div>

      {/* Description */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', fontSize: '16px', color: '#aaa', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}
      >
        {overviewData.description}
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}
      >
        {overviewData.features.map((feature, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid #222', borderRadius: '12px',
            padding: '24px', textAlign: 'center', fontSize: '16px', fontWeight: 600, color: '#ddd',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
          }}>
            {feature}
          </div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}
      >
        <button 
          onClick={() => onNavigate('journey')}
          style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Start Journey
        </button>
        <button 
          onClick={() => onNavigate('architecture')}
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid #333', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Explore Layers
        </button>
      </motion.div>
    </div>
  );
}
