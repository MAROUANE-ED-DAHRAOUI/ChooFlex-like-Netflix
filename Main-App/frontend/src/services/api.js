import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // 8 second default timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.token_access) {
      config.headers.authorization = `Bearer ${user.token_access}`;
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
    console.log('API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
};

// Movies API calls
export const moviesAPI = {
  getRandom: async (type = null) => {
    // Use real random endpoint
    const params = type ? { type } : {};
    const response = await api.get('/movies/random', { params });
    return response.data[0]; // random returns array
  },

  getById: async (id) => {
    // Use real find endpoint
    const response = await api.get(`/movies/find/${id}`);
    return response.data;
  },

  getAll: async (type = null) => {
    // Use real endpoint for all movies (admin only)
    const params = type ? { type } : {};
    const response = await api.get('/movies', { params });
    return response.data;
  },
  
  create: async (movieData) => {
    const response = await api.post('/movies', movieData);
    return response.data;
  },
  
  update: async (id, movieData) => {
    const response = await api.put(`/movies/${id}`, movieData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  },
};

// Lists API calls
export const listsAPI = {
  getAll: async (type = null, genre = null, populate = false) => {
    // Optimized for speed - don't populate by default
    const params = {};
    if (type) params.type = type;
    if (genre) params.genre = genre;
    if (populate) params.populate = 'true';
    
    // Add timeout for faster failure detection
    const response = await api.get('/lists', { 
      params,
      timeout: 5000 // 5 second timeout
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/lists/${id}`, {
      timeout: 3000 // 3 second timeout for single items
    });
    return response.data;
  },
  
  create: async (listData) => {
    const response = await api.post('/lists', listData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/lists/${id}`);
    return response.data;
  },
};

// Users API calls
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/users/find/${id}`);
    return response.data;
  },
  
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

// Settings API
export const settingsAPI = {
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },
  
  updatePreferences: async (preferences) => {
    const response = await api.put('/users/preferences', preferences);
    return response.data;
  },
  
  getPreferences: async () => {
    const response = await api.get('/users/preferences');
    return response.data;
  },
  
  exportData: async () => {
    const response = await api.get('/users/export', {
      responseType: 'blob'
    });
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },
  
  getSessions: async () => {
    const response = await api.get('/users/sessions');
    return response.data;
  },
  
  logoutOtherSessions: async () => {
    const response = await api.post('/users/logout-others');
    return response.data;
  }
};

// Search movies and TV shows
export const searchContent = async (query) => {
  try {
    const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
};

export default api;

// Individual function exports for convenience
export const login = authAPI.login;
export const register = authAPI.register;
export const logout = authAPI.logout;


export const getMovies = moviesAPI.getAll;
export const getMovieById = moviesAPI.getById;
export const getRandomMovie = moviesAPI.getRandom;

export const getLists = listsAPI.getAll;
export const getListById = listsAPI.getById;

export const getUsers = usersAPI.getAll;
export const getUserById = usersAPI.getById;
export const updateUser = usersAPI.update;
export const deleteUser = usersAPI.delete;
