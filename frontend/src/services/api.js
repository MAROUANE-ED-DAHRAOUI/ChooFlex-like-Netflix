import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  getAll: async (type = null, genre = null) => {
    // Use real endpoint
    const params = {};
    if (type) params.type = type;
    if (genre) params.genre = genre;
    const response = await api.get('/lists', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/lists/${id}`);
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
