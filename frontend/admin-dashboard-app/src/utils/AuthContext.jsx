import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        // Verify token with backend
        const response = await api.get('/admin/verify');
        setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('adminToken', token);
      setUser(user);
      toast.success('Login successful!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
