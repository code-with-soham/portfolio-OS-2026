// ============================================
// Placement Prep - AI Service Client
// ============================================

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (!baseUrl.endsWith('/api')) {
  baseUrl = `${baseUrl}/api`;
}
const API_URL = `${baseUrl}/ai/generate`;

export async function enhanceRoadmapWithAI(baseRoadmap) {
  try {
    const prompt = `
      Enhance this base placement preparation roadmap:
      ${JSON.stringify(baseRoadmap, null, 2)}
      
      For each day, expand the tasks with specific sub-concepts to learn and names of 3-5 typical interview questions to solve.
      Return the enhanced roadmap strictly as a JSON array matching the original structure but with enriched "tasks". Do not use markdown backticks in the response.
    `;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction: 'You are a strict JSON formatting assistant for technical interview prep.' })
    });

    if (!response.ok) throw new Error('AI request failed');

    const data = await response.json();
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

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction: 'You are an expert AI Career Coach for software engineering placements.' })
    });

    if (!response.ok) throw new Error('AI request failed');
    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error('Study coach error:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please check if the backend server is running.";
  }
}
