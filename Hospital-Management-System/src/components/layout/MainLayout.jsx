import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../../features/auth/useAuth";

import "./MainLayout.css";

function MainLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="main-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        onLogout={handleLogout}
      />

      <div className="main-layout-content">
        <Navbar onMenuClick={handleMenuClick} />

        <main className="main-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
