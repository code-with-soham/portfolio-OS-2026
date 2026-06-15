import api from './api';

export const projectService = {
  getProjects: async (params = {}) => {
    const { data } = await api.get('/projects', { params });
    return data.data; 
  },
  getProjectById: async (id) => {
    const { data } = await api.get(`/projects/${id}`);
    return data.data;
  }
};
