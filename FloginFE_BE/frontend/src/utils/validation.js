// Validation utilities

export const validateRequired = (value) => {
  if (!value || value.trim() === '') {
    return 'This field is required';
  }
  return null;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

export const validateMinLength = (value, minLength) => {
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters`;
  }
  return null;
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};
