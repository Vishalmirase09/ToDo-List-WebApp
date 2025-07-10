import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBell, FaHome, FaTasks, FaCheckCircle, FaBars } from 'react-icons/fa';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ notifications, onMarkAsRead }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = (notificationId) => {
    onMarkAsRead(notificationId);
    if (unreadCount <= 1) {
      setShowNotifications(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <FaTasks className="me-2" />
          TodoApp
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
              >
                <FaHome className="me-1" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/todos') ? 'active' : ''}`} 
                to="/todos"
              >
                <FaTasks className="me-1" />
                Todos
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/completed') ? 'active' : ''}`} 
                to="/completed"
              >
                <FaCheckCircle className="me-1" />
                Completed
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/notifications') ? 'active' : ''}`} 
                to="/notifications"
              >
                <FaBell className="me-1" />
                Notifications
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <div className="position-relative notification-bell-container">
              <div
                className="notification-bell text-white"
                onClick={handleNotificationClick}
                style={{ cursor: 'pointer', zIndex: 9998 }}
              >
                <FaBell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;