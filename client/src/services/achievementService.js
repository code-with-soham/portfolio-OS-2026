import api from './api';

export const achievementService = {
  getAchievements: async (params = {}) => {
    const { data } = await api.get('/achievements', { params });
    return data.data;
  },
};
