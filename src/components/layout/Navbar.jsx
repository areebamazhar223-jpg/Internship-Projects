
import { useState } from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  Search,
  CheckCheck,
  CalendarDays,
  CreditCard,
  UserPlus,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../features/auth/useAuth";
import "./Navbar.css";

const initialNotifications = [
  {
    id: 1,
    title: "New appointment booked",
    message: "A new patient appointment has been scheduled.",
    time: "10 minutes ago",
    type: "appointment",
    read: false,
  },
  {
    id: 2,
    title: "Payment received",
    message: "A patient invoice payment has been received.",
    time: "30 minutes ago",
    type: "payment",
    read: false,
  },
  {
    id: 3,
    title: "New patient registered",
    message: "A new patient has been added to the system.",
    time: "1 hour ago",
    type: "patient",
    read: true,
  },
];

function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const pageTitle =
    {
      "/dashboard": "Dashboard",
      "/patients": "Patients",
      "/doctors": "Doctors",
      "/appointments": "Appointments",
      "/billing": "Billing",
      "/settings": "Settings",
    }[pathname] || "Hospital Management";

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return <CalendarDays size={18} />;
      case "payment":
        return <CreditCard size={18} />;
      case "patient":
        return <UserPlus size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-heading">
          <p className="navbar-title">{pageTitle}</p>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        {/* Notifications */}
        <div className="navbar-notification-wrapper">
          <button
            type="button"
            className={`navbar-notification ${
              isNotificationOpen ? "active" : ""
            }`}
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={isNotificationOpen}
            onClick={() =>
              setIsNotificationOpen((previous) => !previous)
            }
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <div>
                  <p>Notifications</p>
                  <span>
                    {unreadCount} unread notifications
                  </span>
                </div>

                <button
                  type="button"
                  className="notification-close"
                  onClick={() => setIsNotificationOpen(false)}
                  aria-label="Close notifications"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      className={`notification-item ${
                        !notification.read ? "unread" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <span className={`notification-icon ${notification.type}`}>
                        {getNotificationIcon(notification.type)}
                      </span>

                      <span className="notification-content">
                        <strong>{notification.title}</strong>
                        <span>{notification.message}</span>
                        <small>{notification.time}</small>
                      </span>

                      {!notification.read && (
                        <span className="notification-unread-dot"></span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="notification-empty">
                    <Bell size={28} />
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>

              <div className="notification-footer">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck size={16} />
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="navbar-profile">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="profile-info">
            <p className="profile-name">{user?.name || "User"}</p>
            <span>{user?.role || "Staff"}</span>
          </div>

          <ChevronDown size={17} className="profile-chevron" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
