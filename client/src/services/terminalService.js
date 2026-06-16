import api from './api';

export const fetchHelpCommands = async () => {
  try {
    const response = await api.get('/terminal/help');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching terminal help commands:', error);
    return null;
  }
};
