// src/tests/Login.test.jsx - SIÊU ĐƠN GIẢN
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import Login from "../../components/Login";

// 1. Khai báo mock cho Jest
import { mockStoreLogIn } from '../tests/__mocks__/useAuthStore';
// 2. Import hàm mock service để điều khiển
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

  test("Error messages if submit blank form", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    //Input
    const usernameInput = screen.getByLabelText(/Tên đăng nhập/);
    const passwordInput = screen.getByLabelText(/Mật khẩu/);
    expect(usernameInput.value).toBe("");
    expect(passwordInput.value).toBe("");
    //Button
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

    // Check interactions :
    fireEvent.click(submitButton);
    const usernameError = await screen.findByText(
      /Tên đăng nhập chứa ít nhất 3 ký tự/
    );
    const passwordError = await screen.findByText(
      /Mật khẩu chứa ít nhất 6 ký tự/
    );

    expect(usernameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  test("Error messages if incorrect regex ", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    //Input
    const usernameInput = screen.getByLabelText(/Tên đăng nhập/);
    const passwordInput = screen.getByLabelText(/Mật khẩu/);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

    fireEvent.change(usernameInput, { target: { value: "user@" } }); //Incorrect: @
    fireEvent.change(passwordInput, { target: { value: "password" } }); //Missing number

    // Check  :
    fireEvent.click(submitButton);
    const usernameError = await screen.findByText(
      /Tên đăng nhập chỉ được chứa chữ, số và các ký tự -, ., _/
    );
    const passwordError = await screen.findByText(
      /Mật khẩu phải chứa cả chữ và số/
    );

    expect(usernameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  test("Error messages if long username & password", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    //Input
    const usernameInput = screen.getByLabelText(/Tên đăng nhập/);
    const passwordInput = screen.getByLabelText(/Mật khẩu/);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/ });

    fireEvent.change(usernameInput, { target: { value: "a".repeat(51) } });
    fireEvent.change(passwordInput, {
      target: { value: "b".repeat(101) },
    });

    // Check  :
    fireEvent.click(submitButton);
    const usernameError = await screen.findByText(
      /Tên đăng nhập chứa tối đa 50 ký tự/
    );
    const passwordError = await screen.findByText(
      /Mật khẩu chứa tối đa 100 ký tự/
    );

    expect(usernameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  test("Clear error messages when inputs become valid", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // SỬA: Dùng regex không có dấu ":"
    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    // 1. Submit với invalid data để show errors
    fireEvent.change(usernameInput, { target: { value: "ab" } });
    fireEvent.change(passwordInput, { target: { value: "abc" } });
    fireEvent.click(submitButton);

    // 2. Verify errors hiển thị
    await screen.findByText(/Tên đăng nhập chứa ít nhất 3 ký tự/i);
    await screen.findByText(/Mật khẩu chứa ít nhất 6 ký tự/i);

    // 3. Nhập valid data
    fireEvent.change(usernameInput, { target: { value: "validuser" } });
    fireEvent.change(passwordInput, { target: { value: "valid123" } });

    // 4. SỬA: Dùng queryByText để check errors biến mất
    await waitFor(() => {
      expect(
        screen.queryByText(/Tên đăng nhập chứa ít nhất 3 ký tự/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Mật khẩu chứa ít nhất 6 ký tự/i)
      ).not.toBeInTheDocument();
    });
  });

  test("Button shows loading state during submission", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Tên đăng nhập/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole("button", { name: /Đăng nhập/i });

    // Fill valid form
    fireEvent.change(usernameInput, { target: { value: "validuser" } });
    fireEvent.change(passwordInput, { target: { value: "valid123" } });
    fireEvent.click(submitButton);

    // Check loading state
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Đang đăng nhập/i)).toBeInTheDocument();
  });
});

// ==========================================================
// b) Test form submission và API calls (2 điểm)
// ==========================================================

describe("b) Test form submission và API calls", () => {
  test("Confirm call API when submitting valid form ", () => {
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
  });
});

// ==========================================================
// c) Test error handling và success messages (1 điểm)
// ==========================================================
