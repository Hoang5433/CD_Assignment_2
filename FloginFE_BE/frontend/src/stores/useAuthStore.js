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

  init: () => {
    const token = getJWTfromCookie();
    if (token) {
      set({ accessToken: token, initialized: true });
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
        description: <span data-testid="login-success">Success</span>
      });
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập không thành công", {
        description: <span data-testid="login-error">Error</span>
      });
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
