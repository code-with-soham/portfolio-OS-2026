const { GoogleGenerativeAI, SchemaType } = require("@google/genai");

/**
 * Reusable generic Gemini client enforcing application/json output.
 */
class GeminiClient {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing. AI features will fail.');
    }
    // Using native fetch implementation similar to original controller, but abstracting it 
    // into a service. We use the REST API to guarantee responseMimeType works reliably.
    this.apiKey = apiKey;
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
  }

  async generateStructuredContent(prompt, systemInstruction) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY not configured on server.');
    }

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1, // Low temperature for deterministic query generation
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        responseMimeType: "application/json" // CRITICAL: Enforce structured JSON
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        role: "system",
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', response.status, errorText);
        throw new Error(`AI API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Ensure it's valid JSON
        try {
          return JSON.parse(generatedText);
        } catch (parseError) {
          console.error("Gemini returned invalid JSON despite mime type:", generatedText);
          throw new Error("AI returned malformed JSON");
        }
      } else {
        throw new Error('Unexpected response structure from AI service.');
      }
    } catch (error) {
      console.error('GeminiClient error:', error.message);
      throw error;
    }
  }
}

module.exports = new GeminiClient();
