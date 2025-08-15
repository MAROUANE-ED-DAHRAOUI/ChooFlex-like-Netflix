import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import "./register.scss";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Full form
  
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (step === 2) {
      if (!formData.username) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        [name]: ""
      }));
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      
      // Success - redirect to login
      navigate("/login", { 
        state: { 
          message: "Registration successful! Please log in with your new account." 
        }
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ 
        submit: error.response?.data?.message || "Registration failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setErrors({});
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="register">
      {/* Header */}
      <div className="register__header">
        <div className="register__header-content">
          <img
            className="register__logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt="ChooFlex"
          />
          <button 
            className="register__signin-btn" 
            onClick={handleLoginClick}
            type="button"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="register__content">
        <div className="register__hero">
          <h1 className="register__title">
            Unlimited movies, TV shows, and more
          </h1>
          <h2 className="register__subtitle">
            Watch anywhere. Cancel anytime.
          </h2>
          <p className="register__description">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form className="register__email-form" onSubmit={handleEmailSubmit}>
              <div className="register__input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className={`register__input ${errors.email ? 'register__input--error' : ''}`}
                  autoComplete="email"
                />
                <button 
                  type="submit" 
                  className="register__get-started-btn"
                  disabled={loading}
                >
                  Get Started
                </button>
              </div>
              {errors.email && (
                <div className="register__error">{errors.email}</div>
              )}
            </form>
          )}

          {/* Step 2: Full Registration Form */}
          {step === 2 && (
            <div className="register__form-container">
              <div className="register__form-card">
                <button 
                  type="button"
                  className="register__back-btn"
                  onClick={handleBackToEmail}
                >
                  ← Back
                </button>
                
                <h3 className="register__form-title">Create your account</h3>
                <p className="register__form-subtitle">
                  Just a few more details to finish setting up your account.
                </p>

                <form className="register__form" onSubmit={handleRegister}>
                  {/* Email (readonly) */}
                  <div className="register__field">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="register__input register__input--readonly"
                      autoComplete="email"
                    />
                  </div>

                  {/* Username */}
                  <div className="register__field">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className={`register__input ${errors.username ? 'register__input--error' : ''}`}
                      autoComplete="username"
                    />
                    {errors.username && (
                      <div className="register__field-error">{errors.username}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="register__field">
                    <div className="register__password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className={`register__input ${errors.password ? 'register__input--error' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="register__password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="register__field-error">{errors.password}</div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="register__field">
                    <div className="register__password-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        className={`register__input ${errors.confirmPassword ? 'register__input--error' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="register__password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="register__field-error">{errors.confirmPassword}</div>
                    )}
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="register__submit-error">{errors.submit}</div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="register__submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Start Membership"}
                  </button>
                </form>

                <div className="register__login-link">
                  Already have an account?{" "}
                  <button 
                    type="button"
                    className="register__login-btn"
                    onClick={handleLoginClick}
                  >
                    Sign in now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}