import React from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { accessToken, logOut } = useAuthStore();
  console.log(accessToken);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-header">
      <div className="user-info">
        {
          <span>
            Xin chào, <strong>User</strong>
          </span>
        }
      </div>
      <button className="btn-logout" onClick={() => handleSignOut()}>
        🚪 Đăng xuất
      </button>
    </div>
  );
};

export default Navbar;
