/**
 * Validation utility functions
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateForm = (fields, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = fields[field];
    const rule = rules[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }
    
    if (value && rule.validator && !rule.validator(value)) {
      errors[field] = rule.message || `Invalid ${rule.label || field}`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
