import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Login from '../../components/Login';
import { authService } from '../../services/authService';

jest.mock('../../services/authService');
jest.mock('sonner');
jest.mock('../../utils/cookie');

describe('Login Mock Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Mock: Login thành công', async () => {
    authService.logIn.mockResolvedValue({
      success: true,
      token: 'mock-token-123',
      user: { username: 'testuser' }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test123' }
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(authService.logIn).toHaveBeenCalledWith('testuser', 'Test123');
      expect(screen.getByText(/thành công/i)).toBeInTheDocument();
    });
  });

  test('Mock: Login thất bại', async () => {
    authService.logIn.mockRejectedValue({
      message: 'Invalid credentials'
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test123' }
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(authService.logIn).toHaveBeenCalledWith('testuser', 'Test123');
      expect(screen.getByText(/thất bại/i)).toBeInTheDocument();
    });
  });
});