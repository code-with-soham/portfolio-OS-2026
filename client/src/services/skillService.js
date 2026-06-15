import api from './api';

export const skillService = {
  getSkills: async (params = {}) => {
    const { data } = await api.get('/skills', { params });
    return data.data;
  },
};
