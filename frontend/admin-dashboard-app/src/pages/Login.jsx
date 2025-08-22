import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff, FiPlay } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import './Login.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, user } = useAuth();
  const { theme } = useTheme();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@chooflex.com',
      password: 'admin123'
    });
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <FiPlay className="logo-icon" />
            <span className="logo-text">ChooFlex Admin</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Sign In'}
          </Button>
        </form>

        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <button
            type="button"
            className="demo-button"
            onClick={fillDemoCredentials}
            disabled={isLoading}
          >
            Use Demo Account
          </button>
          <div className="credentials-display">
            <span>Email: admin@chooflex.com</span>
            <span>Password: admin123</span>
          </div>
        </div>

        <div className="login-footer">
          <p>&copy; 2024 ChooFlex. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
