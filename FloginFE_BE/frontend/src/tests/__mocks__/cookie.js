// src/tests/__mocks__/cookie.js

export const mockGetJWT = jest.fn();
export const mockSetJWT = jest.fn();
export const mockRemoveJWT = jest.fn();

// Trả về các hàm mock
export const getJWTfromCookie = mockGetJWT;
export const setJWTtoCookie = mockSetJWT;
export const removeJWTfromCookie = mockRemoveJWT;