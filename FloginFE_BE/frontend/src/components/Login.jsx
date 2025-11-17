import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

function Login() {
  const loginSchema = z.object({
    username: z
        .string()
        .min(3, "Tên đăng nhập chứa ít nhất 3 ký tự")
        .max(50, "Tên đăng nhập chứa tối đa 50 ký tự")
        .regex(
            /^[a-zA-Z0-9._-]+$/,
            "Tên đăng nhập chỉ được chứa chữ, số và các ký tự -, ., _"
        ),

    password: z
        .string()
        .min(6, "Mật khẩu chứa ít nhất 6 ký tự")
        .max(100, "Mật khẩu chứa tối đa 100 ký tự")
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
            "Mật khẩu phải chứa cả chữ và số"
        ),
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
          <input id="username" data-testid="username-input" type="text" {...register("username")} />
          {errors.username && (
            <p className="warning-login" data-testid="username-error">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input id="password" data-testid="password-input" type="password" {...register("password")} />
          {errors.password && (
            <p className="warning-login">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" data-testid="login-button" disabled={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

export default Login;
