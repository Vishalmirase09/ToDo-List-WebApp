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
            <div 
              className="position-relative"
              style={{ position: 'relative' }}
            >
              <div
                className="notification-bell text-white"
                onClick={handleNotificationClick}
                style={{ 
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                <FaBell size={22} />
                {unreadCount > 0 && (
                  <span 
                    className="notification-badge"
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '6px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      minWidth: '24px',
                      textAlign: 'center',
                      boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
                      border: '2px solid white',
                      animation: 'glow 2s ease-in-out infinite alternate'
                    }}
                  >
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