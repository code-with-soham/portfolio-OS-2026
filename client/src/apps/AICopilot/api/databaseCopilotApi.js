import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:5000/api/db-ai';

/**
 * Sends a natural language prompt to Gemini and gets a structured Execution Plan
 */
export const generateExecutionPlan = async ({ prompt, schemaContext }) => {
  const response = await axios.post(`${API_BASE_URL}/generate`, { prompt, schemaContext });
  return response.data;
};

/**
 * Sends an approved Execution Plan to the backend for execution
 */
export const executeAiPlan = async (executionPlan) => {
  const response = await axios.post(`${API_BASE_URL}/execute`, executionPlan);
  return response.data;
};

export const useGeneratePlan = () => {
  return useMutation({
    mutationFn: generateExecutionPlan,
  });
};

export const useExecutePlan = () => {
  return useMutation({
    mutationFn: executeAiPlan,
  });
};
