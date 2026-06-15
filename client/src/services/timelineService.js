import api from './api';

export const timelineService = {
  getTimeline: async (params = {}) => {
    const { data } = await api.get('/timeline', { params });
    return data.data;
  },
};
