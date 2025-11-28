import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import Login from "../../components/Login";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "sonner";
import { removeJWTfromCookie, setJWTtoCookie } from "../../utils/cookie";

jest.mock("../../services/authService");
jest.mock("sonner");
jest.mock("../../utils/cookie");

describe("Login Mock Tests", () => {
  beforeEach(() => {
    useAuthStore.getState().clearState();
    removeJWTfromCookie();
    jest.clearAllMocks();
  });

  test("Successful response", async () => {
    authService.logIn.mockResolvedValue({
      status: 200,
      accessToken: "mockAccessToken",
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    fireEvent.change(usernameInput, { target: { value: "correctUser" } });
    fireEvent.change(passwordInput, {
      target: { value: "correctPassword1" },
    });

    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      //Verify mock calls
      expect(authService.logIn).toHaveBeenCalledTimes(1);
      expect(authService.logIn).toHaveBeenCalledWith(
        "correctUser",
        "correctPassword1"
      );

      expect(setJWTtoCookie).toHaveBeenCalledWith("mockAccessToken");
      expect(useAuthStore.getState().accessToken).toBe("mockAccessToken");
      expect(useAuthStore.getState().loading).toBe(false);
      expect(toast.success).toHaveBeenCalledWith(
        "Đăng nhập thành công",
        expect.objectContaining({
          description: expect.any(Object),
        })
      );
    });
  });

  test.each([
    {
      username: "wrongUsername",
      password: "correctPassword1",
    },
    {
      username: "correctUsername",
      password: "wrongPassword1",
    },
  ])("Failed response - 401 (%o)", async ({ username, password }) => {
    authService.logIn.mockRejectedValue({
      response: { status: 401 },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      //Verify mock calls
      expect(authService.logIn).toHaveBeenCalledTimes(1);
      expect(authService.logIn).toHaveBeenCalledWith(username, password);
      
      expect(setJWTtoCookie).not.toHaveBeenCalled();
      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(useAuthStore.getState().loading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        "Tên đăng nhập hoặc mật khẩu không chính xác!"
      );
    });

  });

  test("Login failed - Server error(500)", async () => {
    authService.logIn.mockRejectedValue({
      response: { status: 500 },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    fireEvent.change(usernameInput, { target: { value: "validUser" } });
    fireEvent.change(passwordInput, {
      target: { value: "validPassword1" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      //Verify mock calls
      expect(authService.logIn).toHaveBeenCalledTimes(1);
      expect(authService.logIn).toHaveBeenCalledWith(
        "validUser",
        "validPassword1"
      );

      expect(setJWTtoCookie).not.toHaveBeenCalled();
      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(useAuthStore.getState().loading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        "Máy chủ đang gặp sự cố, vui lòng thử lại sau!"
      );
    });
  });

  test("Login failed - Network/Connection Error ", async () => {
    authService.logIn.mockRejectedValue({
      request: {},
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    fireEvent.change(usernameInput, { target: { value: "validUser" } });
    fireEvent.change(passwordInput, {
      target: { value: "validPassword1" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      //Verify mock calls
      expect(authService.logIn).toHaveBeenCalledTimes(1);
      expect(authService.logIn).toHaveBeenCalledWith(
        "validUser",
        "validPassword1"
      );
      expect(setJWTtoCookie).not.toHaveBeenCalled();
      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(toast.error).toHaveBeenCalledWith(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền!"
      );
    });
  });

  test("Login failed - 4xx without message", async () => {
    authService.logIn.mockRejectedValue({
      response: {
        status: 400,
        data: {},
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    fireEvent.change(usernameInput, { target: { value: "anyUser" } });
    fireEvent.change(passwordInput, { target: { value: "validPassword1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {

      //Verify mock calls
      expect(authService.logIn).toHaveBeenCalledTimes(1);
      expect(authService.logIn).toHaveBeenCalledWith(
        "anyUser",
        "validPassword1"
      );

      expect(setJWTtoCookie).not.toHaveBeenCalled();
      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(toast.error).toHaveBeenCalledWith("Đã có lỗi xảy ra");
    });
  });

  test("Login failed - unknown error", async () => {
    authService.logIn.mockRejectedValue(
      new Error("Something went wrong internally")
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    fireEvent.change(usernameInput, { target: { value: "validUser" } });
    fireEvent.change(passwordInput, {
      target: { value: "validPassword1" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      
      //Verify mock calls
      expect(authService.logIn).toHaveBeenCalledTimes(1);
      expect(authService.logIn).toHaveBeenCalledWith(
        "validUser",
        "validPassword1"
      );
      
      expect(setJWTtoCookie).not.toHaveBeenCalled();
      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(toast.error).toHaveBeenCalledWith(
        "Lỗi không xác định: Something went wrong internally"
      );
    });
  });
});
