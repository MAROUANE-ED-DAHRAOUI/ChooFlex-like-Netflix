import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../authContext/AuthContext';
import { login } from '../../authContext/apiCalls';
import './login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { isFetching, error, dispatch } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({ email, password }, dispatch);
      if (result && result.user && result.token_access) {
        localStorage.setItem("token_access", result.token_access);
        setLoginError("");
        navigate('/');
      }
    } catch (err) {
      // Show backend error message if available
      setLoginError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="logo">
            <img src="/choowflix-logo.svg" alt="ChoowFlix" style={{ height: '40px' }} />
          </Link>
        </div>
        
        <div className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h1>Sign In</h1>
            
            {(error || loginError) && (
              <div className="error-message">
                {loginError || error}
              </div>
            )}
            
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={validationErrors.email ? 'error' : ''}
                disabled={isFetching}
              />
              {validationErrors.email && (
                <span className="validation-error">{validationErrors.email}</span>
              )}
            </div>
            
            <div className="form-group">
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={validationErrors.password ? 'error' : ''}
                  disabled={isFetching}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isFetching}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {validationErrors.password && (
                <span className="validation-error">{validationErrors.password}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isFetching}
            >
              {isFetching ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className="login-help">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="help-link">Need help?</a>
            </div>
            
            <div className="signup-link">
              <span>New to ChooFlex? </span>
              <Link to="/register">Sign up now</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;