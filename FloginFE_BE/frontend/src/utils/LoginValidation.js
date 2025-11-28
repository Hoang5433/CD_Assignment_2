export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Ten dang nhap khong duoc de trong';
  }
  if (username.length < 3 || username.length > 50) {
    return 'Ten dang nhap phai co tu 3-50 ky tu';
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
  if (password.length < 6 || password.length > 100) {
    return 'Mat khau phai co tu 6-100 ky tu';
  }
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    return 'Mat khau phai chua ca chu va so';
  }
  return '';
};
