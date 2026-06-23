// ============================================
// Portfolio OS 2026 — AI Controller
// ============================================
// Proxies requests to the Google Gemini API securely.

async function handleGeminiRequest(req, res) {
  try {
    const { prompt, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY in server environment.');
      return res.status(500).json({ error: 'AI configuration error on server.' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        role: "system",
        parts: [{ text: systemInstruction }]
      };
    }

    requestBody.generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Failed to communicate with Gemini API' });
    }

    const data = await response.json();

    let generatedText = '';
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
      generatedText = data.candidates[0].content.parts[0].text;
    } else {
      console.warn('Unexpected Gemini API response structure:', JSON.stringify(data));
      return res.status(500).json({ error: 'Unexpected response from AI service.' });
    }

    res.json({ text: generatedText });

  } catch (error) {
    console.error('Error in handleGeminiRequest:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  handleGeminiRequest
};
