import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:5000/api/vector-search';

export const queryVectorSearch = async ({ prompt, mode }) => {
  const response = await axios.post(`${API_BASE_URL}/query`, { prompt, mode });
  return response.data;
};

export const runEmbeddingPipeline = async (limit = 50) => {
  const response = await axios.post(`${API_BASE_URL}/embed-pipeline?limit=${limit}`);
  return response.data;
};

export const useVectorSearch = () => {
  return useMutation({
    mutationFn: queryVectorSearch
  });
};

export const useEmbeddingPipeline = () => {
  return useMutation({
    mutationFn: () => runEmbeddingPipeline()
  });
};
