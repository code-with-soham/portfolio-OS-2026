import React, { useState } from 'react';
import { usePlacementStore } from '../../../store/usePlacementStore';

export default function ResumeAnalyzer() {
  const store = usePlacementStore();
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // In a real integration, this would call geminiPlacementService with the resumeText
      // We will simulate the Gemini response based on the V3 architecture requirement
      setTimeout(() => {
        setAnalysis({
          atsScore: Math.floor(Math.random() * 20) + 70, // 70-90
          missingSkills: ['System Design', 'Cloud Deployment (AWS/Azure)', 'Redis / Caching'],
          readiness: {
            service: Math.floor(Math.random() * 10) + 85, // 85-95
            product: Math.floor(Math.random() * 20) + 60, // 60-80
            startup: Math.floor(Math.random() * 15) + 75  // 75-90
          },
          generatedQuestions: [
            'I see you used React. Can you explain how the Virtual DOM works?',
            'Your resume mentions REST APIs. What is the difference between PUT and PATCH?',
            'How did you optimize the database queries in your main project?'
          ]
        });
        setIsAnalyzing(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="placement-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ marginTop: 0 }}>AI Resume Analyzer</h2>
      <p style={{ color: 'var(--color-text-secondary)' }}>Paste your resume text here. Gemini will analyze it for ATS compatibility and generate targeted interview questions.</p>

      <textarea 
        placeholder="Paste resume content here..."
        value={resumeText}
        onChange={e => setResumeText(e.target.value)}
        style={{ 
          width: '100%', 
          minHeight: '150px', 
          padding: '12px', 
          background: 'rgba(0,0,0,0.3)', 
          border: '1px solid var(--color-border)', 
          borderRadius: '8px', 
          color: 'white', 
          resize: 'vertical',
          marginBottom: '20px',
          fontFamily: 'inherit'
        }}
      />

      <button 
        className="placement-btn-primary" 
        onClick={handleAnalyze} 
        disabled={isAnalyzing || !resumeText.trim()}
        style={{ alignSelf: 'flex-start' }}
      >
        {isAnalyzing ? 'Analyzing with Gemini...' : 'Analyze Resume'}
      </button>

      {analysis && (
        <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s' }}>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ flex: 1, minWidth: '150px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: analysis.atsScore > 80 ? '#00c864' : '#ff8c00' }}>{analysis.atsScore}%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>ATS Score</div>
            </div>
            <div style={{ flex: 2, minWidth: '250px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--color-text-primary)' }}>Placement Readiness</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Service Based</span><span style={{ color: '#00c864' }}>{analysis.readiness.service}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Product Based</span><span style={{ color: '#ff8c00' }}>{analysis.readiness.product}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Startup</span><span style={{ color: 'var(--color-accent)' }}>{analysis.readiness.startup}%</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#ff3366' }}>Missing Skills Detected</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {analysis.missingSkills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: 'var(--color-accent)' }}>Expected Interview Questions</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analysis.generatedQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
