import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../stores/useAuthStore";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { accessToken, init, initialized } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    // chỉ điều hướng sau khi init xong
    if (initialized && !accessToken) {
      navigate("/");
    }
  }, [initialized, accessToken, navigate]);

  // hiển thị tạm khi đang init
  if (!initialized) {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
