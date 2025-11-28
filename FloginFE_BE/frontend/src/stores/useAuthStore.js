import { authService } from "../services/authService";
import { toast } from "sonner";
import { create } from "zustand";
import {
  getJWTfromCookie,
  removeJWTfromCookie,
  setJWTtoCookie,
} from "../utils/cookie";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  initialized: false,

  init: async () => {
    const token = getJWTfromCookie();
    if (token) {
      set({ accessToken: token, initialized: true });
      try {
        const user = await authService.fetchUser();
        console.log(user);
        set({ user, initialized: true });
      } catch (error) {
        console.error(error);
        set({ initialized: true });
      }
    } else {
      set({ initialized: true });
    }
  },

  clearState: () => {
    set({
      accessToken: null,
      user: null,
      loading: false,
      initialized: true,
    });
  },

  logIn: async (username, password) => {
    try {
      set({ loading: true });
      const { accessToken } = await authService.logIn(username, password);
      if (!accessToken) throw new Error("No token received");

      setJWTtoCookie(accessToken);
      set({ accessToken });

      toast.success("Đăng nhập thành công", {
        description: <span data-testid="login-success">Success</span>,
      });
      return true;
    } catch (error) {
      console.error(error);
      // TRƯỜNG HỢP 1: Server có trả về phản hồi (nhưng là lỗi 4xx, 5xx)
      if (error.response) {
        const status = error.response.status;

        // 401: Unauthorized (Sai user/pass)
        if (status === 401 || status === 403) {
          toast.error("Tên đăng nhập hoặc mật khẩu không chính xác!");
        }
        // 500+: Lỗi Server
        else if (status >= 500) {
          toast.error("Máy chủ đang gặp sự cố, vui lòng thử lại sau!");
        }
        // Các lỗi 4xx khác (400 Bad Request, 404 Not Found...)
        else {
          console.error(error);
          toast.error(error.response.data?.message || "Đã có lỗi xảy ra");
        }
      } else if (error.request) {
        toast.error(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền!"
        );
      } else {
        toast.error("Lỗi không xác định: " + error.message);
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logOut: async () => {
    try {
      get().clearState();
      removeJWTfromCookie();
      toast.success("Đăng xuất!");
    } catch (error) {
      console.error(error);
      toast.error("Đăng xuất thất bại");
    } finally {
      set({ loading: false });
    }
  },
}));