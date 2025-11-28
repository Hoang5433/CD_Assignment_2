import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import Login from "../../components/Login";
import { authService } from "../../services/authService";
// import { useAuthStore } from "../../stores/useAuthStore";
// import { toast } from "sonner";
// import { removeJWTfromCookie, setJWTtoCookie } from "../../utils/cookie";

//jest.mock("module") = import module này trong code thì hãy dùng bản MOCK, không dùng bản thật.”
jest.mock("sonner");
jest.mock("../../services/authService");
jest.mock("../../utils/cookie");

describe("Login Component Integration Test", () => {
  // ==========================================================
  // a) Test rendering và user interactions (2 điểm)
  // ==========================================================
  describe("a) Test rendering và user interactions", () => {
    test("Test rendering UI ", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      //Header - <h2>
      const heading = screen.getByRole("heading", {
        name: /Đăng nhập/i,
        level: 2,
      });

      //Label
      const usernameLabel = screen.getByText(/Tên đăng nhập/i);
      const passwordLabel = screen.getByText(/Mật khẩu/i);

      //Input
      const usernameInput = screen.getByLabelText(/Tên đăng nhập/);
      const passwordInput = screen.getByLabelText(/Mật khẩu/);

      //Button
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

      // Check
      expect(heading).toBeInTheDocument();
      expect(usernameLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute("type", "text");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(usernameInput, { target: { value: "username1" } });
      expect(usernameInput.value).toBe("username1");
      //Password:
      fireEvent.change(passwordInput, { target: { value: "password1" } });
      expect(passwordInput.value).toBe("password1");
    });
  });

  // ==========================================================
  // b) Test form submission và API calls (2 điểm)
  // ==========================================================
  describe("b) Test form submission và API calls", () => {
    test("Chặn gọi API nếu submit form không hợp lệ", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
      const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "invalid@" } });
      fireEvent.change(passwordInput, { target: { value: "invalid" } });
      fireEvent.click(submitButton);
      expect(submitButton).toBeDisabled();
      await waitFor(() => {
        expect(authService.logIn).not.toHaveBeenCalled();
      });
    });

    test("Gọi API khi submit form hợp lệ ", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
      const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "validuser" } });
      fireEvent.change(passwordInput, { target: { value: "valid123" } });
      fireEvent.click(submitButton);
      expect(submitButton).toBeDisabled();
      await waitFor(() => {
        expect(authService.logIn).toHaveBeenCalledTimes(1);
        expect(authService.logIn).toHaveBeenCalledWith("validuser", "valid123");
      });
    });
  });

  // ==========================================================
  // c) Test error handling và success messages (1 điểm)
  // ==========================================================
  describe("c) Test error handling và success messages", () => {
    test("Hiển thị lỗi khi submit : username trống", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const usernameInput = screen.getByLabelText(/Tên đăng nhập/);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

      expect(usernameInput.value).toBe("");

      fireEvent.click(submitButton);

      const usernameError = await screen.findByText(
        /Tên đăng nhập chứa ít nhất 3 ký tự/
      );

      expect(usernameError).toBeInTheDocument();
    });

    test("Hiển thị lỗi khi submit : password trống", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const passwordInput = screen.getByLabelText(/Mật khẩu/);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

      expect(passwordInput.value).toBe("");

      fireEvent.click(submitButton);

      const passwordError = await screen.findByText(
        /Mật khẩu chứa ít nhất 6 ký tự/
      );

      expect(passwordError).toBeInTheDocument();
    });

    test("Hiển thị lỗi khi submit : username chứa ký tự không hợp lệ", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      //Input
      const usernameInput = screen.getByLabelText(/Tên đăng nhập/);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

      fireEvent.change(usernameInput, { target: { value: "userÂ@" } }); //Incorrect: Â, @

      // Check  :
      fireEvent.click(submitButton);
      const usernameError = await screen.findByText(
        /Tên đăng nhập chỉ được chứa chữ, số và các ký tự -, ., _/
      );

      expect(usernameError).toBeInTheDocument();
    });

    test("Hiển thị lỗi khi submit : password chưa đúng định dạng - chỉ có chữ", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      //Input
      const passwordInput = screen.getByLabelText(/Mật khẩu/);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

      fireEvent.change(passwordInput, { target: { value: "password" } }); // Missing number

      // Check  :
      fireEvent.click(submitButton);
      const passwordError = await screen.findByText(
        /Mật khẩu phải chứa cả chữ và số/
      );

      expect(passwordError).toBeInTheDocument();
    });

    test("Hiển thị lỗi khi submit : password chưa đúng định dạng - chỉ có số", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      //Input
      const passwordInput = screen.getByLabelText(/Mật khẩu/);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

      fireEvent.change(passwordInput, { target: { value: "123456" } }); // Missing word

      // Check  :
      fireEvent.click(submitButton);
      const passwordError = await screen.findByText(
        /Mật khẩu phải chứa cả chữ và số/
      );

      expect(passwordError).toBeInTheDocument();
    });

    test("Hiển thị lỗi khi submit : username quá dài", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const usernameInput = screen.getByLabelText(/Tên đăng nhập/);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

      fireEvent.change(usernameInput, { target: { value: "a".repeat(51) } });

      fireEvent.click(submitButton);

      const usernameError = await screen.findByText(
        /Tên đăng nhập chứa tối đa 50 ký tự/
      );

      expect(usernameError).toBeInTheDocument();
    });

    test("Hiển thị lỗi khi submit : password quá dài", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const passwordInput = screen.getByLabelText(/Mật khẩu/);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

      fireEvent.change(passwordInput, { target: { value: "b".repeat(101) } });

      fireEvent.click(submitButton);

      const passwordError = await screen.findByText(
        /Mật khẩu chứa tối đa 100 ký tự/
      );

      expect(passwordError).toBeInTheDocument();
    });

    test("Xóa các lỗi hiển thị khi đã nhập form đúng định dạng", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "ab" } });
      fireEvent.change(passwordInput, { target: { value: "abc" } });
      fireEvent.click(submitButton);

      await screen.findByText(/Tên đăng nhập chứa ít nhất 3 ký tự/i);
      await screen.findByText(/Mật khẩu chứa ít nhất 6 ký tự/i);

      fireEvent.change(usernameInput, { target: { value: "validuser" } });
      fireEvent.change(passwordInput, { target: { value: "valid123" } });

      await waitFor(() => {
        expect(
          screen.queryByText(/Tên đăng nhập chứa ít nhất 3 ký tự/i)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Mật khẩu chứa ít nhất 6 ký tự/i)
        ).not.toBeInTheDocument();
      });
    });

    test("Không hiển thị lỗi khi tất cả inputs hợp lệ", async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

      fireEvent.change(usernameInput, { target: { value: "validuser" } });
      fireEvent.change(passwordInput, { target: { value: "valid123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/Tên đăng nhập chứa ít nhất 3 ký tự/i)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Mật khẩu chứa ít nhất 6 ký tự/i)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Tên đăng nhập chỉ được chứa/i)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Mật khẩu phải chứa cả chữ và số/i)
        ).not.toBeInTheDocument();
        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/Đang đăng nhập/i)).toBeInTheDocument();
      });
    });
  });
});


//MOCK SERVICE TEST :
// beforeEach(() => {
//   useAuthStore.getState().clearState();
//   removeJWTfromCookie();
//   jest.clearAllMocks();
// });
// test("Login successful - correct username & password", async () => {
//   authService.logIn.mockResolvedValue({
//     accessToken: "mockAccessToken",
//     message: "Login successful",
//   });

//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );

//   const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
//   const passwordInput = screen.getByLabelText(/Mật khẩu/i);
//   const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

//   fireEvent.change(usernameInput, { target: { value: "correctUser" } });
//   fireEvent.change(passwordInput, {
//     target: { value: "correctPassword1" },
//   });

//   fireEvent.click(submitButton);
//   expect(submitButton).toBeDisabled();

//   await waitFor(() => {
//     expect(toast.success).toHaveBeenCalledWith(
//       "Đăng nhập thành công",
//       expect.objectContaining({
//         description: expect.any(Object),
//       })
//     );
//     expect(authService.logIn).toHaveBeenCalledTimes(1);
//     expect(authService.logIn).toHaveBeenCalledWith(
//       "correctUser",
//       "correctPassword1"
//     );

//     expect(setJWTtoCookie).toHaveBeenCalledWith("mockAccessToken");
//     expect(useAuthStore.getState().accessToken).toBe("mockAccessToken");
//     expect(useAuthStore.getState().loading).toBe(false);
//   });
// });

// test("Login failed by incorrect username ", async () => {
//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );
//   authService.logIn.mockRejectedValue({
//     response: { status: 401 },
//   });

//   const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
//   const passwordInput = screen.getByLabelText(/Mật khẩu/i);
//   const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

//   fireEvent.change(usernameInput, { target: { value: "wrongUsername" } });
//   fireEvent.change(passwordInput, {
//     target: { value: "correctPassword1" },
//   });
//   fireEvent.click(submitButton);

//   await waitFor(() => {
//     expect(toast.error).toHaveBeenCalledWith(
//       "Tên đăng nhập hoặc mật khẩu không chính xác!"
//     );
//     expect(authService.logIn).toHaveBeenCalledTimes(1);
//     expect(authService.logIn).toHaveBeenCalledWith(
//       "wrongUsername",
//       "correctPassword1"
//     );

//     expect(setJWTtoCookie).not.toHaveBeenCalled();
//     expect(useAuthStore.getState().accessToken).toBeNull();
//     expect(useAuthStore.getState().loading).toBe(false);
//   });
// });

// test("Login failed by incorrect password ", async () => {
//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );

//   authService.logIn.mockRejectedValue({
//     response: { status: 401 },
//   });
//   const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
//   const passwordInput = screen.getByLabelText(/Mật khẩu/i);
//   const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

//   fireEvent.change(usernameInput, { target: { value: "correctUsername" } });
//   fireEvent.change(passwordInput, {
//     target: { value: "wrongPassword1" },
//   });
//   fireEvent.click(submitButton);

//   await waitFor(() => {
//     expect(toast.error).toHaveBeenCalledWith(
//       "Tên đăng nhập hoặc mật khẩu không chính xác!"
//     );
//     expect(authService.logIn).toHaveBeenCalledTimes(1);
//     expect(authService.logIn).toHaveBeenCalledWith(
//       "correctUsername",
//       "wrongPassword1"
//     );

//     expect(setJWTtoCookie).not.toHaveBeenCalled();
//     expect(useAuthStore.getState().accessToken).toBeNull();
//     expect(useAuthStore.getState().loading).toBe(false);
//   });
// });

// test("Login failed by server error(500)", async () => {
//   authService.logIn.mockRejectedValue({
//     response: { status: 500 },
//   });

//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );

//   const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
//   const passwordInput = screen.getByLabelText(/Mật khẩu/i);
//   const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

//   fireEvent.change(usernameInput, { target: { value: "validUser" } });
//   fireEvent.change(passwordInput, {
//     target: { value: "validPassword1" },
//   });
//   fireEvent.click(submitButton);

//   await waitFor(() => {
//     expect(toast.error).toHaveBeenCalledWith(
//       "Máy chủ đang gặp sự cố, vui lòng thử lại sau!"
//     );
//     expect(authService.logIn).toHaveBeenCalledTimes(1);
//     expect(authService.logIn).toHaveBeenCalledWith(
//       "validUser",
//       "validPassword1"
//     );

//     expect(setJWTtoCookie).not.toHaveBeenCalled();
//     expect(useAuthStore.getState().accessToken).toBeNull();
//     expect(useAuthStore.getState().loading).toBe(false);
//   });
// });

// test("Login failed by Network/Connection Error ", async () => {
//   authService.logIn.mockRejectedValue({
//     request: {},
//   });

//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );
//   const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
//   const passwordInput = screen.getByLabelText(/Mật khẩu/i);
//   const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

//   fireEvent.change(usernameInput, { target: { value: "validUser" } });
//   fireEvent.change(passwordInput, {
//     target: { value: "validPassword1" },
//   });
//   fireEvent.click(submitButton);

//   await waitFor(() => {
//     expect(toast.error).toHaveBeenCalledWith(
//       "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền!"
//     );
//     expect(authService.logIn).toHaveBeenCalledTimes(1);
//     expect(authService.logIn).toHaveBeenCalledWith(
//       "validUser",
//       "validPassword1"
//     );
//     expect(setJWTtoCookie).not.toHaveBeenCalled();
//     expect(useAuthStore.getState().accessToken).toBeNull();
//   });
// });

// test("Login failed - 4xx without message (fallback)", async () => {
//   authService.logIn.mockRejectedValue({
//     response: {
//       status: 400,
//       data: {},
//     },
//   });

//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );

//   const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
//   const passwordInput = screen.getByLabelText(/Mật khẩu/i);
//   const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

//   fireEvent.change(usernameInput, { target: { value: "anyUser" } });
//   fireEvent.change(passwordInput, { target: { value: "validPassword1" } });
//   fireEvent.click(submitButton);

//   await waitFor(() => {
//     expect(toast.error).toHaveBeenCalledWith("Đã có lỗi xảy ra");
//     expect(setJWTtoCookie).not.toHaveBeenCalled();
//     expect(useAuthStore.getState().accessToken).toBeNull();
//   });
// });

// test("Login failed - unknown error", async () => {
//   authService.logIn.mockRejectedValue(
//     new Error("Something went wrong internally")
//   );

//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );

//   const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
//   const passwordInput = screen.getByLabelText(/Mật khẩu/i);
//   const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

//   fireEvent.change(usernameInput, { target: { value: "validUser" } });
//   fireEvent.change(passwordInput, {
//     target: { value: "validPassword1" },
//   });
//   fireEvent.click(submitButton);

//   await waitFor(() => {
//     expect(toast.error).toHaveBeenCalledWith(
//       "Lỗi không xác định: Something went wrong internally"
//     );

//     expect(authService.logIn).toHaveBeenCalledTimes(1);
//     expect(authService.logIn).toHaveBeenCalledWith(
//       "validUser",
//       "validPassword1"
//     );

//     expect(setJWTtoCookie).not.toHaveBeenCalled();

//     expect(useAuthStore.getState().accessToken).toBeNull();
//   });
// });
