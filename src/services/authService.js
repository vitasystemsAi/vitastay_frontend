import api, { extractData } from './api';
import { STORAGE_KEYS } from '../utils/constants';

const authService = {
  login: async ({ email, password, rememberMe }) => {
    const { data } = await api.post('/auth/login', { email, password, rememberMe });
    const result = extractData(data);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, result.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe ? 'true' : 'false');
    return result;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return extractData(data);
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return extractData(data);
  },

  resetPassword: async (payload) => {
    const { data } = await api.post('/auth/reset-password', payload);
    return extractData(data);
  },

  changePassword: async (payload) => {
    const { data } = await api.post('/auth/change-password', payload);
    return extractData(data);
  },

  getLoginHistory: async (params) => {
    const { data } = await api.get('/auth/login-history', { params });
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    return extractData(data);
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/auth/avatar', formData);
    return extractData(data);
  },
};

export default authService;
