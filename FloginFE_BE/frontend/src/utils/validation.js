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

export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Ten dang nhap khong duoc de trong';
  }
  if (username.length < 3) {
    return 'Ten dang nhap phai co it nhat 3 ky tu';
  }
  if (username.length > 50) {
    return 'Ten dang nhap khong duoc qua 50 ky tu';
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return 'Ten dang nhap chi duoc chua chu, so va cac ky tu -, ., _';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Mat khau khong duoc de trong';
  }
  if (password.length < 6) {
    return 'Mat khau phai co it nhat 6 ky tu';
  }
  if (password.length > 100) {
    return 'Mat khau khong duoc qua 100 ky tu';
  }
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    return 'Mat khau phai chua ca chu va so';
  }
  return '';
};
