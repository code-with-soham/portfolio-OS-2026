import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:5000/api/db'; // Consistent with MongoDB Explorer

export const executePlaygroundQuery = async (queryString) => {
  const response = await axios.post(`${API_BASE_URL}/query`, { query: queryString });
  return response.data;
};

export const useExecuteQuery = () => {
  return useMutation({
    mutationFn: executePlaygroundQuery,
  });
};
