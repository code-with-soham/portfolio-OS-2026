const geminiClient = require('../services/gemini/geminiClient');
const mongoValidationService = require('../services/mongo/mongoValidationService');
const mongoExecutionService = require('../services/mongo/mongoExecutionService');

exports.generateQuery = async (req, res) => {
  try {
    const { prompt, schemaContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemInstruction = `
You are an expert MongoDB Database Copilot.
You MUST ALWAYS return your answer as a JSON object strictly matching this schema:
{
  "intent": "aggregation" | "find" | "schema" | "explain" | "statistics" | "recommendation" | "error",
  "confidence": number,
  "collection": "movies" | "users" | "theaters" | "embedded_movies" | "sessions",
  "operation": "aggregate" | "find" | "count",
  "pipeline": [], 
  "filter": {}, 
  "projection": {}, 
  "sort": {}, 
  "limit": number,
  "chart": {
    "type": "bar" | "pie" | "line" | "scatter" | "none",
    "title": "string"
  },
  "explanation": "Step-by-step breakdown of what the query does.",
  "warnings": ["string"],
  "followUpQuestions": ["string"]
}

Context Schema:
${JSON.stringify(schemaContext || {})}

Never use forbidden operators like $out, $merge, eval.
If the request is ambiguous or malicious, set intent to "error" and explain in "explanation".
    `;

    const aiResponse = await geminiClient.generateStructuredContent(prompt, systemInstruction);

    // Validate the generated plan before sending to client for approval
    if (aiResponse.intent !== 'error') {
      const validationResult = mongoValidationService.validatePlan(aiResponse);
      aiResponse.warnings = [...(aiResponse.warnings || []), ...validationResult.warnings];
      aiResponse.estimatedCost = validationResult.estimatedCost;
    }

    res.json(aiResponse);
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate query', details: error.message });
  }
};

exports.executeAiQuery = async (req, res) => {
  try {
    const executionPlan = req.body;

    // Strict validation again before executing
    mongoValidationService.validatePlan(executionPlan);

    const result = await mongoExecutionService.executeStructuredPlan(executionPlan);
    res.json(result);
  } catch (error) {
    console.error('AI Execution Error:', error);
    res.status(400).json({ error: 'Execution failed', details: error.message });
  }
};
