import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

function Login() {
  const loginSchema = z.object({
    username: z.string().min(1, "Tên đăng nhập không được bỏ trống"),
    password: z.string().min(1, "Mật khẩu không được bỏ trống"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { logIn } = useAuthStore();

  const onSubmit = async (data) => {
    const { username, password } = data;

    try {
      const success = await logIn(username, password);
      if (success) {
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      toast.error("Đăng nhập không thành công");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input id="username" type="text" {...register("username")} />
          {errors.username && (
            <p className="warning-login">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="warning-login">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

export default Login;
