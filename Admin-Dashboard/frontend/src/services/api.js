import axios from 'axios';
import { toast } from 'react-toastify';

// Base API URL - connect to the main backend where movies are stored
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function for admin login
const adminLogin = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@chooflex.com',
      password: 'admin123'
    });
    
    if (response.data && response.data.token_access) {
      const token = response.data.token_access;
      localStorage.setItem('adminToken', token);
      
      // Also store as user for consistency
      localStorage.setItem('user', JSON.stringify({
        ...response.data,
        isAdmin: true
      }));
      
      return token;
    }
  } catch (error) {
    console.warn('Admin auto-login failed:', error.message);
    return null;
  }
};

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
    // Don't add token to login requests
    if (config.url?.includes('/auth/login')) {
      return config;
    }
    
    // Get the main app's user token for authentication
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const adminToken = localStorage.getItem('adminToken');
    
    // Use main app token if available, otherwise use admin token
    const token = user?.token_access || adminToken;
    
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
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // For demo purposes, don't show error toasts for failed API calls
    // In production, you'd want to handle these properly
    console.log('API Error (handled silently for demo):', error.message);
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/session'),
  logout: () => api.post('/auth/logout'),
};

export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  ban: (id) => api.put(`/users/${id}/ban`),
  unban: (id) => api.put(`/users/${id}/unban`),
};

export const contentAPI = {
  getAll: (params = {}) => api.get('/movies/all', { params }),
  getById: (id) => api.get(`/movies/find/${id}`),
  create: (contentData) => api.post('/movies', contentData),
  update: (id, contentData) => api.put(`/movies/${id}`, contentData),
  delete: (id) => api.delete(`/movies/${id}`),
  setFeatured: (id, featured) => api.put(`/movies/${id}`, { featured }),
  search: (params = {}) => api.get('/search', { params }),
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const analyticsAPI = {
  getStats: () => api.get('/analytics/stats'),
  getTopContent: (params = {}) => api.get('/analytics/top-content', { params }),
  getActiveUsers: (params = {}) => api.get('/analytics/active-users', { params }),
  getUserStats: (params = {}) => api.get('/analytics/user-stats', { params }),
  getViewStats: (params = {}) => api.get('/analytics/view-stats', { params }),
};

export const settingsAPI = {
  getProfile: () => api.get('/settings/profile'),
  updateProfile: (profileData) => api.put('/settings/profile', profileData),
  changePassword: (passwordData) => api.put('/settings/password', passwordData),
  getNotifications: (params = {}) => api.get('/settings/notifications', { params }),
  markNotificationRead: (id) => api.put(`/settings/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/settings/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/settings/notifications/${id}`),
};

export default api;
