import "@testing-library/jest-dom";

// Khai báo mock functions
export const mockToastSuccess = jest.fn();
export const mockToastError = jest.fn();

// THỰC HIỆN MOCKING MODULE SONNER
jest.mock("sonner", () => ({
  toast: {
    error: mockToastError,
    success: mockToastSuccess,
  },
}));
