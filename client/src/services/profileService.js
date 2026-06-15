import api from './api';

export const profileService = {
  getProfile: async () => {
    const { data } = await api.get('/profile');
    return data.data; // Assuming backend wraps response in { success, data }
  }
};
