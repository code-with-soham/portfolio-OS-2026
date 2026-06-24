// ============================================
// Placement Prep - AI Service Client
// ============================================

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (!baseUrl.endsWith('/api')) {
  baseUrl = `${baseUrl}/api`;
}
const API_URL = `${baseUrl}/ai/generate`;

async function fetchWithRetry(url, options) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return await response.json();
      }

      if (response.status !== 503) {
        throw new Error('AI request failed');
      }

      await new Promise(resolve =>
        setTimeout(resolve, attempt * 2000)
      );
    } catch (err) {
      if (attempt === 3) throw err;
    }
  }
}

export async function enhanceRoadmapWithAI(baseRoadmap) {
  try {
    const prompt = `
      Enhance this base placement preparation roadmap:
      ${JSON.stringify(baseRoadmap, null, 2)}
      
      For each day, expand the tasks with specific sub-concepts to learn and names of 3-5 typical interview questions to solve.
      Return the enhanced roadmap strictly as a JSON array matching the original structure but with enriched "tasks". Do not use markdown backticks in the response.
    `;

    const data = await fetchWithRetry(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        systemInstruction: 'Generate day-wise roadmap. Focus on consistency. Include revision days. Mention coding questions count. Return strictly as a JSON array without markdown backticks.' 
      })
    });
    try {
        const jsonMatch = data.text.match(/\[.*\]/s) || [data.text];
        return JSON.parse(jsonMatch[0]);
    } catch (e) {
        console.warn('Failed to parse AI roadmap, using base roadmap fallback');
        return baseRoadmap;
    }

  } catch (error) {
    console.error('Error enhancing roadmap:', error);
    return baseRoadmap; // Graceful fallback to deterministic engine
  }
}

export async function askStudyCoach(question, context = {}) {
  try {
    const prompt = `
      User Question: ${question}
      
      Context (Weak Topics): ${context.weakTopics?.join(', ') || 'None'}
      Context (Current Phase): ${context.currentPhase || 'Unknown'}
      
      Provide a helpful, encouraging, and highly technical explanation suitable for a CS student preparing for placements.
      Use markdown formatting. Keep the explanation concise and actionable.
    `;

    const data = await fetchWithRetry(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        systemInstruction: 'You are an expert DSA and Placement Mentor. Explain concepts simply. Provide examples. Give coding interview insights. Focus on TCS, Infosys, Wipro, Accenture and product companies.' 
      })
    });
    return data.text;

  } catch (error) {
    console.error('Study coach error:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please check if the backend server is running.";
  }
}
