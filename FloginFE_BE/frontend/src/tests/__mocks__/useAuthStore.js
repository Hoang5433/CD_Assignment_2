// 📁 src/tests/__mocks__/useAuthStore.js

import { jest } from "@jest/globals";

export const mockStoreLogIn = jest.fn();
export const mockStoreLogOut = jest.fn();

export const useAuthStore = jest.fn(() => ({
  // Thuộc tính Trạng thái tĩnh
  user: null,
  accessToken: null,
  loading: false,
  initialized: false,
  isAuthenticated: false,

  logIn: mockStoreLogIn,
  logOut: mockStoreLogOut,

  // Các hàm khác
  init: jest.fn(),
  clearState: jest.fn(),
}));
