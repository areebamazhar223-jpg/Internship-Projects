
import { NavLink } from "react-router-dom";
import {
  HeartPulse,
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  ReceiptText,
  Settings,
  LogOut,
  X,
  BedDouble,
} from "lucide-react";

import "./Sidebar.css";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Patients",
    path: "/patients",
    icon: Users,
  },
  {
    name: "Doctors",
    path: "/doctors",
    icon: Stethoscope,
  },
  {
    name: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
  },
  {
    name: "Billing",
    path: "/billing",
    icon: ReceiptText,
  },
  {
    name: "Ward & Beds",
    path: "/wards",
    icon: BedDouble,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar({ isOpen, onClose, onLogout }) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        ></div>
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <HeartPulse size={25} />
            </div>

            <div className="brand-text">
              <p className="sidebar-brand-title">MediCare</p>
              <span>Hospital Management</span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">MAIN MENU</p>

          <nav className="sidebar-nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">
              <HeartPulse size={20} />
            </div>

            <div>
              <strong className="sidebar-help-title">Need Help?</strong>
              <p>Contact support team</p>
            </div>
          </div>

          <button
            className="sidebar-logout"
            type="button"
            onClick={onLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

          <div className="sidebar-version">
            Hospital Management System v1.0
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
