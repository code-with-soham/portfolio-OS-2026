import axios from 'axios';

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is not configured');
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      'API Error:',
      error?.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;