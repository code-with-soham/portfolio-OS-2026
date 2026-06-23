import axios from 'axios';

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

let API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is not configured');
}

// Automatically append /api if it's missing
if (!API_URL.endsWith('/api')) {
  API_URL = `${API_URL}/api`;
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