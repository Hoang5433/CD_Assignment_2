import "@testing-library/jest-dom";

// Khai báo mock functions
export const mockLogIn = jest.fn();
export const mockFetchUser = jest.fn();

export const authService = {
    logIn : mockLogIn,
    fetchUser: mockFetchUser
}