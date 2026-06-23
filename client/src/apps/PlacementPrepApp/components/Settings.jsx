import React from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

export default function Settings() {
  const store = usePlacementStore();

  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
        const { generateBaseRoadmap } = await import('../engines/RuleEngine');
        const { enhanceRoadmapWithAI } = await import('../../../services/geminiPlacementService');
        
        const base = generateBaseRoadmap(store);
        store.setRoadmaps(base, []); // set base immediately for fast feedback
        
        // Asynchronously enhance with AI
        const enhanced = await enhanceRoadmapWithAI(base);
        store.setRoadmaps(base, enhanced);
        alert('Roadmap generated successfully!');
    } catch (e) {
        console.error(e);
        alert('Error generating roadmap. Using offline mode.');
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="placement-card">
      <h2 style={{marginTop: 0}}>Journey Configuration</h2>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
        <div>
          <label style={{display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)'}}>Plan Duration</label>
          <select 
            value={store.duration} 
            onChange={e => store.setSetting('duration', e.target.value)}
            style={{width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white'}}
          >
            <option>15 Days</option>
            <option>30 Days</option>
            <option>1 Month</option>
            <option>2 Months</option>
            <option>6 Months</option>
          </select>
        </div>

        <div>
          <label style={{display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)'}}>Placement Season</label>
          <select 
            value={store.placementSeason || '2027 On-Campus'} 
            onChange={e => store.setSetting('placementSeason', e.target.value)}
            style={{width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white'}}
          >
            <option>2027 On-Campus</option>
            <option>2027 Off-Campus</option>
            <option>Internship Preparation</option>
            <option>Hackathon Preparation</option>
          </select>
        </div>

        <div>
          <label style={{display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)'}}>Dream Company</label>
          <select 
            value={store.dreamCompany || 'Google'} 
            onChange={e => store.setSetting('dreamCompany', e.target.value)}
            style={{width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white'}}
          >
            <option>TCS</option>
            <option>Infosys</option>
            <option>Wipro</option>
            <option>Accenture</option>
            <option>Capgemini</option>
            <option>Amazon</option>
            <option>Microsoft</option>
            <option>Google</option>
            <option>Adobe</option>
            <option>Custom Startup</option>
          </select>
        </div>

        <div>
          <label style={{display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)'}}>Skill Level</label>
          <select 
            value={store.skillLevel} 
            onChange={e => store.setSetting('skillLevel', e.target.value)}
            style={{width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white'}}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Interview Ready</option>
          </select>
        </div>

        <div>
          <label style={{display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)'}}>Focus Mode</label>
          <select 
            value={store.focusMode} 
            onChange={e => store.setSetting('focusMode', e.target.value)}
            style={{width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', color: 'white'}}
          >
            <option>Balanced</option>
            <option>DSA Heavy</option>
            <option>Aptitude Heavy</option>
            <option>Core CS Heavy</option>
            <option>Project Heavy</option>
          </select>
        </div>
      </div>

      <div style={{marginTop: '30px'}}>
        <button className="placement-btn-primary" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate New Roadmap'}
        </button>
      </div>
      
      <div style={{marginTop: '30px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
        <h4 style={{marginTop: 0, color: 'var(--color-accent)'}}>AI Backend Connected</h4>
        <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)'}}>
          The application is securely configured to proxy AI requests through the local Node.js backend using the server's environment variables.
        </p>
      </div>
    </div>
  );
}
