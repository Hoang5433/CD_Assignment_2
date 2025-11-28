export const mockToastSuccess = jest.fn();
export const mockToastError = jest.fn();
export const mockToastWarning = jest.fn();
export const mockToastInfo = jest.fn();

export const toast = {
  success: mockToastSuccess,
  error: mockToastError,
  warning: mockToastWarning,
  info: mockToastInfo,
};

export default toast;