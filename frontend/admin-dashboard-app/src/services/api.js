import axios from 'axios';
import { toast } from 'react-toastify';

// Base API URL - adjust according to your backend
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'Something went wrong';
    if (!error.config?.skipErrorToast) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/session'),
  logout: () => api.post('/admin/auth/logout'),
};

export const usersAPI = {
  getAll: (params = {}) => api.get('/admin/users', { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  create: (userData) => api.post('/admin/users', userData),
  update: (id, userData) => api.put(`/admin/users/${id}`, userData),
  delete: (id) => api.delete(`/admin/users/${id}`),
  ban: (id) => api.put(`/admin/users/${id}/ban`),
  unban: (id) => api.put(`/admin/users/${id}/unban`),
};

export const contentAPI = {
  getAll: (params = {}) => api.get('/admin/content', { params }),
  getById: (id) => api.get(`/admin/content/${id}`),
  create: (contentData) => api.post('/admin/content', contentData),
  update: (id, contentData) => api.put(`/admin/content/${id}`, contentData),
  delete: (id) => api.delete(`/admin/content/${id}`),
  setFeatured: (id, featured) => api.put(`/admin/content/${id}/featured`, { featured }),
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const analyticsAPI = {
  getStats: () => api.get('/admin/analytics/stats'),
  getTopContent: (params = {}) => api.get('/admin/analytics/top-content', { params }),
  getActiveUsers: (params = {}) => api.get('/admin/analytics/active-users', { params }),
  getUserStats: (params = {}) => api.get('/admin/analytics/user-stats', { params }),
  getViewStats: (params = {}) => api.get('/admin/analytics/view-stats', { params }),
};

export const settingsAPI = {
  getProfile: () => api.get('/admin/settings/profile'),
  updateProfile: (profileData) => api.put('/admin/settings/profile', profileData),
  changePassword: (passwordData) => api.put('/admin/settings/password', passwordData),
  getNotifications: (params = {}) => api.get('/admin/settings/notifications', { params }),
  markNotificationRead: (id) => api.put(`/admin/settings/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/admin/settings/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/admin/settings/notifications/${id}`),
};

export default api;
