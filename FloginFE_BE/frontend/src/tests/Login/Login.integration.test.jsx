import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import Login from "../../components/Login";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "sonner";
import { removeJWTfromCookie, setJWTtoCookie } from "../../utils/cookie";
import { mockNavigate } from "../__mocks__/react-router-dom";

jest.mock("sonner");
jest.mock("../../services/authService");
jest.mock("../../utils/cookie");
jest.mock("react-router-dom");

describe("Login Component Integration Test", () => {

  
  //===============================================
  // a) Test rendering và user interactions (2 điểm)
  //===============================================
  describe("a) Test rendering và user interactions", () => {
    test("Hiển thị đúng giao diện và nhập liệu", async () => {
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

    // describe("Hiển thị lỗi khi input không hợp lệ", () => {
    //   const renderLogin = () =>
    //     render(
    //       <MemoryRouter>
    //         <Login />
    //       </MemoryRouter>
    //     );

    //   const fillAndSubmit = (username = "", password = "") => {
    //     const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    //     const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    //     const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    //     if (username) {
    //       fireEvent.change(usernameInput, { target: { value: username } });
    //     }
    //     if (password) {
    //       fireEvent.change(passwordInput, { target: { value: password } });
    //     }

    //     fireEvent.click(submitButton);
    //     return { usernameInput, passwordInput, submitButton };
    //   };

    //   const validationTestCases = [
    //     [
    //       "username trống",
    //       "",
    //       "valid123",
    //       /Tên đăng nhập chứa ít nhất 3 ký tự/,
    //     ],
    //     ["password trống", "validuser", "", /Mật khẩu chứa ít nhất 6 ký tự/],
    //     [
    //       "username invalid chars",
    //       "userÂ@",
    //       "valid123",
    //       /Tên đăng nhập chỉ được chứa/,
    //     ],
    //     [
    //       "password chỉ chữ",
    //       "validuser",
    //       "password",
    //       /Mật khẩu phải chứa cả chữ và số/,
    //     ],
    //     [
    //       "password chỉ số",
    //       "validuser",
    //       "123456",
    //       /Mật khẩu phải chứa cả chữ và số/,
    //     ],
    //     [
    //       "username quá dài",
    //       "a".repeat(51),
    //       "valid123",
    //       /Tên đăng nhập chứa tối đa 50 ký tự/,
    //     ],
    //     [
    //       "password quá dài",
    //       "validuser",
    //       "b".repeat(101),
    //       /Mật khẩu chứa tối đa 100 ký tự/,
    //     ],
    //   ];

    //   test.each(validationTestCases)(
    //     "Hiển thị lỗi khi: %s",
    //     async (_, username, password, expectedError) => {
    //       renderLogin();
    //       fillAndSubmit(username, password);

    //       const error = await screen.findByText(expectedError);
    //       expect(error).toBeInTheDocument();
    //     }
    //   );

    //   // Test positive cases
    //   test("Xóa lỗi khi nhập giá trị hợp lệ", async () => {
    //     renderLogin();

    //     fillAndSubmit("ab", "abc");
    //     await screen.findByText(/Tên đăng nhập chứa ít nhất 3 ký tự/i);
    //     await screen.findByText(/Mật khẩu chứa ít nhất 6 ký tự/i);

    //     fireEvent.change(screen.getByLabelText(/Tên đăng nhập/i), {
    //       target: { value: "validuser" },
    //     });
    //     fireEvent.change(screen.getByLabelText(/Mật khẩu/i), {
    //       target: { value: "valid123" },
    //     });

    //     await waitFor(() => {
    //       expect(
    //         screen.queryByText(/Tên đăng nhập chứa ít nhất 3 ký tự/i)
    //       ).not.toBeInTheDocument();
    //       expect(
    //         screen.queryByText(/Mật khẩu chứa ít nhất 6 ký tự/i)
    //       ).not.toBeInTheDocument();
    //     });
    //   });

    //   test("Không hiển thị lỗi và hiển thị loading khi inputs hợp lệ", async () => {
    //     renderLogin();
    //     fillAndSubmit("validuser", "valid123");

    //     await waitFor(() => {
    //       const validationErrors = [
    //         /Tên đăng nhập chứa ít nhất 3 ký tự/i,
    //         /Mật khẩu chứa ít nhất 6 ký tự/i,
    //         /Tên đăng nhập chỉ được chứa/i,
    //         /Mật khẩu phải chứa cả chữ và số/i,
    //       ];

    //       validationErrors.forEach((errorPattern) => {
    //         expect(screen.queryByText(errorPattern)).not.toBeInTheDocument();
    //       });

    //       expect(
    //         screen.getByRole("button", { name: /Đăng nhập/i })
    //       ).toBeDisabled();
    //       expect(screen.getByText(/Đang đăng nhập/i)).toBeInTheDocument();
    //     });
    //   });
    // });
  });


  //===============================================
  // b) Test form submission và API calls (2 điểm)
  //===============================================
  describe("b) Test form submission và API calls", () => {
    test("Không gọi API nếu submit form không hợp lệ", async () => {
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


  //===============================================
  // c) Test error handling và success messages (1 điểm)
  //===============================================
  describe("c) Test error handling và success messages", () => {
    beforeEach(() => {
      useAuthStore.getState().clearState();
      removeJWTfromCookie();
      jest.clearAllMocks();
    });
    test("Submit form hợp lệ -> gọi API thành công -> set Token vào state -> Chuyển trang", async () => {
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
        expect(authService.logIn).toHaveBeenCalledTimes(1);
        expect(authService.logIn).toHaveBeenCalledWith(
          "correctUser",
          "correctPassword1"
        );

        expect(setJWTtoCookie).toHaveBeenCalledWith("mockAccessToken");
        expect(useAuthStore.getState().accessToken).toBe("mockAccessToken");
        expect(useAuthStore.getState().loading).toBe(false);
        expect(mockNavigate).toHaveBeenCalledWith("/admin/products");
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Đăng nhập thành công",
          expect.objectContaining({
            description: expect.any(Object),
          })
        );
      });
    });

    test("API báo lỗi -> Hiển thị thông báo lỗi -> Không chuyển trang", async () => {
      authService.logIn.mockRejectedValue(new Error("API Login Error"));

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });
      fireEvent.change(usernameInput, { target: { value: "username" } });
      fireEvent.change(passwordInput, {
        target: { value: "password123" },
      });

      fireEvent.click(submitButton);
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(authService.logIn).toHaveBeenCalledTimes(1);
        expect(authService.logIn).toHaveBeenCalledWith(
          "username",
          "password123"
        );
        expect(toast.error).toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });
});

