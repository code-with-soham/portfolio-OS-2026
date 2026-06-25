import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const databaseApi = axios.create({
  baseURL: `${BASE_URL}/db`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s timeout for DB requests
});

export const getDatabaseStatus = async () => {
  const { data } = await databaseApi.get('/status');
  return data;
};

export const getCollections = async () => {
  const { data } = await databaseApi.get('/collections');
  return data;
};

export const getDatabaseStats = async () => {
  const { data } = await databaseApi.get('/stats');
  return data;
};

export const getDatabaseHealth = async () => {
  const { data } = await databaseApi.get('/health');
  return data;
};
