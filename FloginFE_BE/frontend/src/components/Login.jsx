import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Lock, Mail } from "lucide-react";

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
    mode: "onChange"
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
      console.error("Chi tiết lỗi:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Left Section - Intro */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">KTPM</h1>
                <p className="text-sm text-slate-500">Admin Dashboard</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Đồ án: Kiểm thử phần mềm
                </h2>
                <p className="text-slate-600 text-lg">
                  Quản lý sản phẩm của bạn một cách dễ dàng và hiệu quả
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Quản lý sản phẩm toàn diện</h3>
                    <p className="text-slate-600 text-sm">Thêm, sửa, xóa sản phẩm một cách nhanh chóng</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-100">
                      <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Tìm kiếm nâng cao</h3>
                    <p className="text-slate-600 text-sm">Tìm kiếm sản phẩm theo tên một cách dễ dàng</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-slate-200">
              <p className="text-slate-500 text-sm">
                © 2025 KTPM. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex flex-col justify-center">
          <Card className="w-full shadow-xl border-slate-200">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900">Đăng nhập</CardTitle>
              <CardDescription className="text-slate-600">
                Nhập thông tin tài khoản của bạn để tiếp tục
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700 font-medium">
                    Tên đăng nhập
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="username"
                      data-testid="username-input"
                      type="text"
                      placeholder="admin123"
                      {...register("username")}
                      className="pl-10 border-slate-300 focus:ring-blue-500"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-sm font-medium" data-testid="username-error">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      data-testid="password-input"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="pl-10 border-slate-300 focus:ring-blue-500"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition mt-6"
                  data-testid="login-button"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Đang đăng nhập...
                    </span>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                  <p className="text-xs text-blue-800">
                    <strong>Username:</strong> admin123
                  </p>
                  <p className="text-xs text-blue-800">
                    <strong>Password:</strong> admin123
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-lg font-bold text-slate-900">KTPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div
        id="login-success"
        className="hidden fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        data-testid="login-success"
      >
        Success
      </div>
    </div>
  );
}

export default Login;
